import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
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
 * so its +Def SUMS onto the base at the totals level. This pins both halves:
 *   1. Smashing defense is ZERO without a mode (base has none) and POSITIVE once
 *      Defensive Adaptation is selected — proving the mode reaches the dashboard.
 *   2. The Fire delta from the mode equals the Smashing value — both are the same
 *      0.45-scale Melee_Buff_Def contribution, so they must match exactly (and
 *      the Fire total is base 1.5 + mode 0.45, i.e. additive, not replaced).
 * Default-safe: with no mode selected the totals are the bare base.
 */
describe('Bio Armor Adaptation modes on the dashboard (homecoming)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function bioBuild(): any {
    const b = createEmptyBuild();
    b.level = 50;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    b.archetype = { id: 'tanker', name: 'Tanker', stats: null, inherent: null } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    b.primary = { id: 'tanker/bio-armor', name: 'Bio Armor', powers: [
      { internalName: 'Environmental_Adaptation', name: 'Environmental Modification', isActive: true, slots: [] },
    ] } as any;
    return b;
  }

  function totals(globalAdjusters: Record<string, boolean>) {
    return calculateCharacterTotals(bioBuild(), false, undefined, { globalAdjusters }).globalBonuses;
  }

  it('adds the active mode\'s mode-gated +Def to the dashboard, summed onto base', () => {
    const off = totals({});
    const defensive = totals({ defensiveadaptation: true });

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

  it('is mutually exclusive and default-safe (no mode → base only)', () => {
    const off = totals({});
    // Offensive grants +ToHit (no Smashing defense); selecting it must not add
    // the Defensive-only Smashing defense.
    const offensive = totals({ offensiveadaptation: true });
    expect(offensive.defSmashing).toBe(0);
    expect(off.defSmashing).toBe(0);
  });
});
