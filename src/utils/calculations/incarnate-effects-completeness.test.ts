import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getDestinyEffects, getHybridEffects } from '@/data';
import { calculateCharacterTotals } from '@/utils/calculations/character-totals';
import { createEmptyBuild } from '@/types/build';
import type { SelectedIncarnatePower } from '@/types/incarnate';

/**
 * Incarnate effect-completeness audit (2026-07-03).
 *
 * The Destiny/Hybrid converter was an allowlist keyed on Homecoming's Parse7
 * (attrib, aspect) pairs; anything unmapped hit a silent `continue`, so whole
 * effect categories were dropped and several powers rendered empty or wrong:
 *   - Rebirth Destiny: the heal (Heal_Dmg/Absolute) and core-path +Max HP
 *     (HitPoints/Maximum) were dropped — rebirth_core_invocation generated `{}`.
 *   - Clarion Destiny: mez protection (all six control types) + KB/KU protection
 *     were dropped (skipped with an "targets enemies" comment), and its mez
 *     RESISTANCE was flattened into debuffResistance, showing a bogus 300%.
 *   - Rebirth/Parse6 Clarion Radial: an aspect=Strength "+buff-strength"
 *     amplifier leaked ~20 lowercased junk keys via `attrib.toLowerCase()`.
 *   - Hybrid Support: aspect=Strength +damage/+accuracy was dropped, and a
 *     uniform multi-attrib buff summed per attrib (8 damage types → 8×).
 *
 * These guard the fixes: the effects are present, correct, and not N×-inflated.
 */

const REBIRTH_TIERS = [
  'rebirth_invocation', 'rebirth_core_invocation', 'rebirth_radial_invocation',
  'rebirth_partial_core_invocation', 'rebirth_partial_radial_invocation',
  'rebirth_total_core_invocation', 'rebirth_total_radial_invocation',
  'rebirth_core_epiphany', 'rebirth_radial_epiphany',
];
// Rebirth's Core path (invocation excluded — the T1 has heal only) grants +Max HP.
const REBIRTH_MAXHP_TIERS = [
  'rebirth_core_epiphany', 'rebirth_partial_core_invocation', 'rebirth_total_core_invocation',
];
const CLARION_TIERS = [
  'clarion_invocation', 'clarion_core_invocation', 'clarion_radial_invocation',
  'clarion_partial_core_invocation', 'clarion_partial_radial_invocation',
  'clarion_total_core_invocation', 'clarion_total_radial_invocation',
  'clarion_core_epiphany', 'clarion_radial_epiphany',
];

function destinySlot(powerId: string): SelectedIncarnatePower {
  return {
    slotId: 'destiny', powerId, powerName: powerId, displayName: powerId,
    icon: '', tier: 'rare', treeId: 'clarion', treeName: 'Clarion',
  };
}
function scrapperBuild(destiny: SelectedIncarnatePower | null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const b: any = createEmptyBuild();
  b.level = 50;
  b.archetype = { id: 'scrapper', name: 'Scrapper', stats: null, inherent: null };
  if (destiny) b.incarnates.destiny = destiny;
  return b;
}

describe('Homecoming Destiny — dropped effects are now exposed', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('Rebirth exposes its click heal for every tier (was empty {})', () => {
    for (const id of REBIRTH_TIERS) {
      const fx = getDestinyEffects(id);
      expect(fx, `missing ${id}`).toBeDefined();
      expect(fx!.healScale, `${id} heal dropped`).toBeGreaterThan(0);
      expect(fx!.healTable).toBe('Ranged_Tempdamage');
    }
    // The formerly-empty core tiers now carry real data.
    expect(getDestinyEffects('rebirth_core_invocation')!.healScale).toBe(6);
    expect(getDestinyEffects('rebirth_invocation')!.healScale).toBe(5);
  });

  it('Rebirth Core-path tiers carry a +Max HP buff (stored as a fraction)', () => {
    for (const id of REBIRTH_MAXHP_TIERS) {
      const fx = getDestinyEffects(id);
      expect(fx!.maxHP, `${id} maxHP`).toBeGreaterThan(0);
      // scale 2 → +20% (scale × 0.1 fraction), consumed as ×100.
      expect(fx!.maxHP).toBeCloseTo(0.2, 6);
    }
    // Radial path heals+regens instead — no Max HP.
    expect(getDestinyEffects('rebirth_radial_epiphany')!.maxHP).toBeUndefined();
  });

  it('Clarion exposes mez + KB protection for every tier (was dropped)', () => {
    for (const id of CLARION_TIERS) {
      const fx = getDestinyEffects(id);
      expect(fx!.mezProtection, `${id} mezProtection`).toBeGreaterThan(0);
      expect(fx!.kbProtection, `${id} kbProtection`).toBeGreaterThan(0);
    }
    const core = getDestinyEffects('clarion_core_epiphany')!;
    expect(core.mezProtection).toBe(21);
    expect(core.kbProtection).toBe(10.5);
  });

  it('Clarion debuffResistance is the real (Repel) value, not the mislabeled confuse-resistance', () => {
    const core = getDestinyEffects('clarion_core_epiphany')!;
    // Repel resistance (0.7), split apart from the mez/status resistance (2.1)
    // that used to masquerade as "300% Debuff Resistance".
    expect(core.debuffResistance).toBeCloseTo(0.7, 6);
    expect(core.statusResistance).toBeCloseTo(2.1, 6);
    // The bogus number is gone: debuffResistance is no longer the confuse mag.
    expect(core.debuffResistance).not.toBeCloseTo(2.1, 3);
  });

  it('Incandescence Radial surfaces its run-speed buff (was dropped)', () => {
    const fx = getDestinyEffects('incandescence_radial_epiphany')!;
    expect(fx.runSpeed).toBeCloseTo(0.35, 6);
  });

  it('Clarion mez + KB protection feed the status-protection totals (was display-only)', () => {
    const base = calculateCharacterTotals(scrapperBuild(null), false, undefined, { combatMode: false });
    const withClarion = calculateCharacterTotals(
      scrapperBuild(destinySlot('clarion_core_epiphany')), false, undefined, { combatMode: false },
    );
    const g = withClarion.globalBonuses;
    // A flat magnitude to all six control types...
    for (const key of ['protHold', 'protStun', 'protImmobilize', 'protSleep', 'protConfuse', 'protFear'] as const) {
      expect(g[key], `${key}`).toBeGreaterThan(base.globalBonuses[key]);
    }
    // ...uniformly (Clarion protects every control type equally).
    expect(g.protHold).toBe(g.protStun);
    expect(g.protHold).toBe(g.protFear);
    // ...and knockback protection is its own total.
    expect(g.protKnockback).toBeGreaterThan(base.globalBonuses.protKnockback);
  });
});

describe('Hybrid Support — aspect=Strength buffs, not N×-inflated', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('surfaces +damage/+accuracy strength as a single buff (not 8× summed)', () => {
    // T4 Support (Total Radial Graft) buffs +6% damage strength across all eight
    // damage types in ONE template — must read 0.06, not 8 × 0.06 = 0.48.
    const fx = getHybridEffects('support_total_radial_graft');
    expect(fx, 'missing support_total_radial_graft').toBeDefined();
    expect(fx!.frontLoaded.damage).toBeCloseTo(0.06, 6);
    expect(fx!.frontLoaded.accuracy).toBeCloseTo(0.06, 6);
    // Distinct defense positions still each apply.
    expect(fx!.frontLoaded.defMelee).toBeCloseTo(0.06, 6);
  });
});

describe('Rebirth dataset (Parse6) — no junk keys, no N× collapse', () => {
  beforeAll(async () => {
    await loadDataset('rebirth');
  });

  it('Clarion mez protection is not 6×-inflated (Parse6 splits the six types)', () => {
    // HC packs all six mez types into one template; Parse6 emits one per type.
    // Collapsing same-duration duplicates keeps the magnitude at 21, not 126.
    expect(getDestinyEffects('clarion_core_epiphany')!.mezProtection).toBe(21);
  });

  it('no lowercased junk keys leak from the aspect=Strength catch-all', () => {
    // Rebirth's Clarion Radial is a broad "+buff-strength" amplifier; the old
    // `attrib.toLowerCase()` fallthrough leaked keys like melee/tohit/absorb/held.
    const JUNK = [
      'melee', 'ranged', 'area', 'smashing', 'lethal', 'fire', 'cold', 'energy',
      'psionic', 'toxic', 'tohit', 'absorb', 'range', 'held', 'stunned', 'sleep',
      'confused', 'immobilized', 'terrorized', 'afraid', 'runningspeed', 'flyingspeed',
    ];
    for (const id of CLARION_TIERS) {
      const fx = getDestinyEffects(id);
      if (!fx) continue;
      for (const junk of JUNK) {
        expect(fx, `${id} leaked junk key '${junk}'`).not.toHaveProperty(junk);
      }
    }
  });

  it('Ageless Radial debuff resistance is consolidated to ~50% (was scattered)', () => {
    const fx = getDestinyEffects('ageless_radial_epiphany')!;
    expect(fx.debuffResistance).toBeCloseTo(0.5, 6);
  });
});
