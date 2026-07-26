/**
 * Plan B Slice 4 — regression guard for the atom-native defense appliers.
 *
 * `legacy-totals.oracle.ts` now sources the always-on +Defense buff from
 * `defenseBuffValue(power)` and the combat-suppressed half from
 * `defenseBuffSuppressibleValue(power)` (atoms) instead of `effects.defenseBuff` /
 * `effects.defenseBuffSuppressible`. This was the FIRST slice that needed a
 * converter change to make the atom list complete: the `suppressible` split lived
 * only in a `suppress_events` template tail (Hide's attack-click suppression) that
 * never reached the wire atom, so the converter now stamps `AtomicEffect.suppressible`.
 *
 * This asserts the LIVE atom path returns the per-type values the calc needs, on the
 * real generated data, for the shapes the migration had to get right:
 *   - the suppressible SPLIT (Hide: +0.25 always-on vs +0.5 combat-suppressed, AoE +5),
 *   - a per-foe non-suppressible self-defense whose increment survives only as the
 *     converter STAMP (Invincibility: +0.5 base +0.1/foe — the per-foe slider),
 *   - a GATED firstTargetExcluded increment (Phalanx Fighting: +0.5 base +0.3/ally,
 *     the increment rides a target≠self gate so it is `gated` yet folded into the base
 *     slot — N=1 stays 0.5, the caster is not counted).
 * Corpus-wide equality vs the bag is proven separately by
 * `scripts/planb-shadow-defense.cjs`; this pins the headline cases in CI.
 */
import { describe, it, expect } from 'vitest';
import { defenseBuffValue, defenseBuffSuppressibleValue } from '@/data/core/atom-query';
import { Hide } from '@/data/datasets/homecoming/generated/powersets/stalker/secondary/super-reflexes/hide';
import { Invincibility } from '@/data/datasets/homecoming/generated/powersets/scrapper/secondary/invulnerability/invincibility';
import { PhalanxFighting } from '@/data/datasets/homecoming/generated/powersets/scrapper/secondary/shield-defense/phalanx-fighting';

// Mirror adjustForPerTarget: scale + perTarget × (N − 1), with N=1 the base.
const perTargetAt = (scale: number, perTarget: number, n: number) =>
  n <= 0 ? 0 : n === 1 ? scale : scale + perTarget * (n - 1);

describe('atom-native Defense — Hide (the suppressible split)', () => {
  const buff = defenseBuffValue(Hide)!;
  const supp = defenseBuffSuppressibleValue(Hide)!;
  it('routes the always-on +0.25 to the buff half (all 11 standard globals)', () => {
    expect(buff).toBeDefined();
    for (const t of ['melee', 'ranged', 'aoe', 'smashing', 'lethal', 'fire', 'cold', 'energy', 'negative', 'toxic', 'psionic']) {
      expect(buff[t].scale).toBeCloseTo(0.25);
      expect(buff[t].perTarget ?? 0).toBe(0);
    }
    expect(buff.smashing.table).toBe('Melee_Buff_Def');
  });
  it('routes the combat-suppressed +0.5 (AoE +5) to the suppressible half', () => {
    expect(supp).toBeDefined();
    expect(supp.melee.scale).toBeCloseTo(0.5);
    expect(supp.smashing.scale).toBeCloseTo(0.5);
    expect(supp.psionic.scale).toBeCloseTo(0.5);
    expect(supp.aoe.scale).toBeCloseTo(5); // Hide's oversized AoE stealth-defense
  });
  it('keeps the two halves disjoint — the same type appears in both, at its own value', () => {
    expect(buff.melee.scale).toBeCloseTo(0.25);
    expect(supp.melee.scale).toBeCloseTo(0.5);
  });
});

describe('atom-native Defense — Invincibility (per-foe self-buff, stamp-only)', () => {
  const buff = defenseBuffValue(Invincibility)!;
  it('reconstructs +0.5 base +0.1/foe on the S/L/F/C/E/N types from the stamp', () => {
    expect(buff.smashing.scale).toBeCloseTo(0.6);
    expect(buff.smashing.perTarget).toBeCloseTo(0.1);
    expect(buff.negative.perTarget).toBeCloseTo(0.1);
    // Psionic/Toxic are the odd types out (+0.1667 base + 0.0333/foe → 0.2 at N=1).
    expect(buff.psionic.scale).toBeCloseTo(0.2);
    expect(buff.psionic.perTarget).toBeCloseTo(0.0333);
  });
  it('scales smashing defense from 1 to 8 foes like the bag would', () => {
    expect(perTargetAt(buff.smashing.scale, buff.smashing.perTarget!, 1)).toBeCloseTo(0.6);
    expect(perTargetAt(buff.smashing.scale, buff.smashing.perTarget!, 8)).toBeCloseTo(0.6 + 0.1 * 7); // 1.3
  });
  it('grants no combat-suppressed defense (an always-on armor)', () => {
    expect(defenseBuffSuppressibleValue(Invincibility)).toBeUndefined();
  });
});

describe('atom-native Defense — Phalanx Fighting (gated firstTargetExcluded increment)', () => {
  const buff = defenseBuffValue(PhalanxFighting)!;
  it('folds the target≠self +0.3/ally increment into the base slot without inflating N=1', () => {
    for (const t of ['melee', 'ranged', 'aoe']) {
      expect(buff[t].scale).toBeCloseTo(0.5); // NOT 0.8 — the caster excludes itself at one target
      expect(buff[t].perTarget).toBeCloseTo(0.3);
    }
  });
  it('grows +0.3 per additional ally (0.5 alone → 1.4 with 3 more allies)', () => {
    expect(perTargetAt(buff.melee.scale, buff.melee.perTarget!, 1)).toBeCloseTo(0.5);
    expect(perTargetAt(buff.melee.scale, buff.melee.perTarget!, 4)).toBeCloseTo(0.5 + 0.3 * 3); // 1.4
  });
  it('is not combat-suppressed', () => {
    expect(defenseBuffSuppressibleValue(PhalanxFighting)).toBeUndefined();
  });
});
