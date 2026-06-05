import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset } from '@/data/powersets';
import { createEmptyBuild } from '@/types/build';
import { calculateCharacterTotals } from './character-totals';

/**
 * Bio Armor Adaptation modes feed the dashboard totals.
 *
 * Each Bio Armor power layers mode-gated bonuses on top of its always-on base,
 * gated in the binary on `k<Mode>Adaptation source.Mode?`. Environmental
 * Modification's base grants +Def to Fire/Cold/Energy/Negative (no
 * Smashing/Lethal); Defensive Adaptation *adds* a minor +0.45 Def across
 * Smashing/Lethal/Fire/Cold/Energy/Negative/Psionic on top.
 *
 * `expandActiveConditionals` applies the active mode as a synthetic active power
 * so its +Def SUMS onto the base at the totals level. The active stance is the
 * single build-scoped source of truth: the Adaptation parent's `activeSubPower`
 * (NOT a separate UI toggle). This pins both halves:
 *   1. Smashing defense is ZERO without a mode (base has none) and POSITIVE once
 *      Defensive Adaptation is selected — proving the mode reaches the dashboard.
 *   2. The Fire delta from the mode equals the Smashing value — both are the same
 *      0.45-scale Melee_Buff_Def contribution, so they must match exactly (and
 *      the Fire total is base 1.5 + mode 0.45, i.e. additive, not replaced).
 * Default-safe: with no stance selected the totals are the bare base, and with
 * no Adaptation parent in the build the stance is unavailable entirely.
 */
describe('Bio Armor Adaptation modes on the dashboard (homecoming)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function bioBuild(activeSubPower?: string, withEnabler = true): any {
    const b = createEmptyBuild();
    b.level = 50;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    b.archetype = { id: 'tanker', name: 'Tanker', stats: null, inherent: null } as any;
    const powers = [
      { internalName: 'Environmental_Adaptation', name: 'Environmental Modification', isActive: true, slots: [] },
      // The Adaptation parent (taken) holds the active stance in `activeSubPower`.
      // Without it in the build, the stance mechanic is unavailable.
      ...(withEnabler
        ? [{ internalName: 'Adaptation', name: 'Evolving Armor', isActive: false, slots: [], activeSubPower }]
        : []),
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    b.primary = { id: 'tanker/bio-armor', name: 'Bio Armor', powers } as any;
    return b;
  }

  function totals(activeSubPower?: string, withEnabler = true) {
    return calculateCharacterTotals(bioBuild(activeSubPower, withEnabler), false, undefined, {}).globalBonuses;
  }

  it('adds the active stance\'s mode-gated +Def to the dashboard, summed onto base', () => {
    const off = totals(undefined);
    const defensive = totals('Defensive_Adaptation');

    // Base Environmental Modification grants no Smashing defense; the Defensive
    // mode is the only source, so it must be 0 → positive.
    expect(off.defSmashing).toBe(0);
    expect(defensive.defSmashing).toBeGreaterThan(0);

    // Fire is additive: base (1.5 scale) plus the mode (0.45 scale). The Fire
    // gain equals the Smashing total since both are the same 0.45-scale
    // Melee_Buff_Def contribution from the Defensive mode.
    const fireDelta = defensive.defFire - off.defFire;
    expect(fireDelta).toBeGreaterThan(0);
    expect(defensive.defSmashing).toBeCloseTo(fireDelta, 4);
    // Base fire survived (not replaced) — the total exceeds the mode-only delta.
    expect(defensive.defFire).toBeGreaterThan(fireDelta);
  });

  it('is mutually exclusive and default-safe (no stance → base only)', () => {
    const off = totals(undefined);
    // Offensive grants +ToHit (no Smashing defense); selecting it must not add
    // the Defensive-only Smashing defense.
    const offensive = totals('Offensive_Adaptation');
    expect(offensive.defSmashing).toBe(0);
    expect(off.defSmashing).toBe(0);
  });

  it('does NOT apply modes when the enabling power (Adaptation) is not taken', () => {
    // The stance can't be selected without the Adaptation parent in the build,
    // so no mode bonus may leak into the dashboard.
    const gated = totals('Defensive_Adaptation', /* withEnabler */ false);
    expect(gated.defSmashing).toBe(0);
    // And the base Environmental Modification defense is unaffected (still applies).
    const baseOnly = totals(undefined, false);
    expect(gated.defFire).toBeCloseTo(baseOnly.defFire, 4);
  });

  // DNA Siphon's Defensive (+HP per living foe) and Efficient (+Regen/+Rec per
  // defeated foe) bonuses gate on a COMPOUND `Cur.kHitPoints target> 0 > k<Mode>
  // Source.Mode? &&` expression. The converter used to reject the whole gate as
  // untoggleable (the HP clause), dropping both bonuses — only Offensive (a
  // plain enttype+mode gate) survived. The fix tests untoggleability on the
  // stripped expression so the surviving mode clause classifies.
  it('extracts all three DNA Siphon mode bonuses (compound HP+mode gate)', () => {
    const ps = getPowerset('tanker/bio-armor');
    const dna = ps?.powers.find((p) => p.internalName === 'DNA_Siphon');
    expect(dna).toBeDefined();
    const conds = dna!.conditionalEffects ?? [];
    expect([...conds.map((c) => c.id)].sort()).toEqual([
      'defensiveadaptation',
      'offensiveadaptation',
      'restedadaptation',
    ]);
    // Defensive → bonus self-heal (per living target).
    const def = conds.find((c) => c.id === 'defensiveadaptation')!;
    const dmg = Array.isArray(def.damage) ? def.damage : def.damage ? [def.damage] : [];
    expect(dmg.some((d) => d?.type === 'Heal')).toBe(true);
    // Efficient (rested) → bonus regen/recovery (per defeated target).
    const rested = conds.find((c) => c.id === 'restedadaptation')!;
    expect(rested.effects?.regenBuffUnenhanced ?? rested.effects?.regenBuff).toBeDefined();
    expect(rested.effects?.recoveryBuffUnenhanced ?? rested.effects?.recoveryBuff).toBeDefined();
  });
});
