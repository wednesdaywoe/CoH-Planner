/**
 * Plan B Slice 3 — regression guard for the atom-native resistance appliers.
 *
 * `character-totals.ts` now sources +Resistance from `resistanceBuffValue(power)`
 * and the self-directed −Res penalty from `resistanceSelfDebuffValue(power)`
 * (atoms) instead of `effects.resistance` / the `toWho:'Self'` entries of
 * `effects.resistanceDebuff`. This asserts the LIVE atom path returns the per-type
 * values the calc needs, on the real generated data, for the shapes the migration
 * had to get right:
 *   - a plain per-damage-type buff (Fire Shield: S/L/F = 3.0, Cold = 1.0),
 *   - a per-foe AoE self-buff whose increment survives only as the converter STAMP
 *     (Bio Armor's Evolving Armor: +0.55 base + 0.05/foe on S/L/Tox — the per-foe
 *     slider), restricted to the eight standard resistance globals,
 *   - a self-directed −Res penalty (Offensive Adaptation: −7.5% to all 8 types).
 * Corpus-wide equality vs the bag is proven separately by
 * `scripts/planb-shadow-resistance.cjs`; this pins the headline cases in CI.
 */
import { describe, it, expect } from 'vitest';
import { resistanceBuffValue, resistanceSelfDebuffValue } from '@/data/core/atom-query';
import { FireShield } from '@/data/datasets/homecoming/generated/powersets/tanker/primary/fiery-aura/fire-shield';
import { Adaptation as EvolvingArmor } from '@/data/datasets/homecoming/generated/powersets/tanker/primary/bio-armor/adaptation';
import { OffensiveAdaptation } from '@/data/datasets/homecoming/generated/powersets/tanker/primary/bio-armor/offensive-adaptation';

// Mirror adjustForPerTarget: scale + perTarget × (N − 1), with N=1 the base.
const perTargetAt = (scale: number, perTarget: number, n: number) =>
  n <= 0 ? 0 : n === 1 ? scale : scale + perTarget * (n - 1);

describe('atom-native Resistance — Fire Shield (plain per-type buff)', () => {
  const v = resistanceBuffValue(FireShield)!;
  it('routes each standard damage type independently (S/L/F = 3.0, Cold = 1.0)', () => {
    expect(v).toBeDefined();
    expect(v.smashing.scale).toBeCloseTo(3);
    expect(v.lethal.scale).toBeCloseTo(3);
    expect(v.fire.scale).toBeCloseTo(3);
    expect(v.cold.scale).toBeCloseTo(1);
    expect(v.smashing.table).toBe('Melee_Res_Dmg');
  });
  it('carries no per-target increment and no self-penalty', () => {
    expect(v.smashing.perTarget ?? 0).toBe(0);
    expect(resistanceSelfDebuffValue(FireShield)).toBeUndefined();
  });
});

describe('atom-native Resistance — Evolving Armor (per-foe self-buff, stamp-only)', () => {
  const v = resistanceBuffValue(EvolvingArmor)!;
  it('reconstructs +0.55 base + 0.05/foe on S/L/Tox from the converter stamp', () => {
    expect(v.smashing.scale).toBeCloseTo(0.55);
    expect(v.smashing.perTarget).toBeCloseTo(0.05);
    expect(v.lethal.perTarget).toBeCloseTo(0.05);
    expect(v.toxic.perTarget).toBeCloseTo(0.05);
    // Psionic is the odd type out (+0.33 base + 0.03/foe).
    expect(v.psionic.scale).toBeCloseTo(0.33);
    expect(v.psionic.perTarget).toBeCloseTo(0.03);
  });
  it('scales smashing resistance from 1 to 8 targets like the bag would', () => {
    expect(perTargetAt(v.smashing.scale, v.smashing.perTarget!, 1)).toBeCloseTo(0.55);
    expect(perTargetAt(v.smashing.scale, v.smashing.perTarget!, 8)).toBeCloseTo(0.55 + 0.05 * 7); // 0.9
  });
  it('restricts to the eight standard globals — no "all" leak from base_defense@Res', () => {
    expect(Object.keys(v).sort()).toEqual(
      ['cold', 'energy', 'fire', 'lethal', 'negative', 'psionic', 'smashing', 'toxic'],
    );
  });
});

describe('atom-native Resistance — Offensive Adaptation (self −Res penalty)', () => {
  it('returns −7.5% to all 8 standard types, tagged toWho:Self (not a foe debuff)', () => {
    const v = resistanceSelfDebuffValue(OffensiveAdaptation)!;
    expect(v).toBeDefined();
    for (const t of ['smashing', 'lethal', 'fire', 'cold', 'energy', 'negative', 'toxic', 'psionic']) {
      expect(v[t].scale).toBeCloseTo(0.075);
      expect(v[t].toWho).toBe('Self');
    }
    // It grants no +resistance buff (the trade-off is pure penalty on the res axis).
    expect(resistanceBuffValue(OffensiveAdaptation)).toBeUndefined();
  });
});
