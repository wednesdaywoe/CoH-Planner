/**
 * Plan B Slice 1 — regression guard for the atom-native ToHit applier.
 *
 * `character-totals.ts` now sources +ToHit from `toHitBuffValue(power)` (atoms)
 * instead of `effects.tohitBuff` (bag). This asserts the LIVE atom path returns
 * the value the calc needs, on the real generated data, for the three shapes the
 * migration had to get right:
 *   - per-target (Soul Drain: 1.0 flat + 0.2/foe → the per-foe slider),
 *   - per-target where the atom's own `stacking` lost the flavor (Invincibility's
 *     `Continuous` folds to `No`, so only the converter-STAMPED increment survives),
 *   - burst/tail (Inner Light: sustained 0.77 tail, NOT the 2.77 overlap sum).
 * Corpus-wide equality vs the bag is proven separately by
 * `scripts/planb-shadow-pertarget.cjs`; this pins the headline cases in CI.
 */
import { describe, it, expect } from 'vitest';
import { toHitBuffValue } from '@/data/core/atom-query';
import { SoulDrain } from '@/data/datasets/homecoming/generated/powersets/scrapper/primary/dark-melee/soul-drain';
import { Invincibility } from '@/data/datasets/homecoming/generated/powersets/scrapper/secondary/invulnerability/invincibility';
import { BuildUp as InnerLight } from '@/data/datasets/homecoming/generated/powersets/peacebringer/epic/luminous-blast/build-up';

// Mirror adjustForPerTarget: scale + perTarget × (N − 1), with N=1 the base.
const perTargetAt = (scale: number, perTarget: number, n: number) =>
  n <= 0 ? 0 : n === 1 ? scale : scale + perTarget * (n - 1);

describe('atom-native ToHit — Soul Drain per-foe scaling (the slider)', () => {
  const v = toHitBuffValue(SoulDrain)!;
  it('reconstructs 1.0 flat + 0.2/foe as { scale: 1.2, perTarget: 0.2 }', () => {
    expect(v).toBeDefined();
    expect(v.scale).toBeCloseTo(1.2);
    expect(v.perTarget).toBeCloseTo(0.2);
    expect(v.table).toBe('Melee_Buff_ToHit');
  });
  it('scales from 1 to 8 targets like the bag would (0.2 per extra foe)', () => {
    expect(perTargetAt(v.scale, v.perTarget!, 1)).toBeCloseTo(1.2);
    expect(perTargetAt(v.scale, v.perTarget!, 8)).toBeCloseTo(1.2 + 0.2 * 7); // 2.6
  });
});

describe('atom-native ToHit — Invincibility (Continuous increment, stamp-only)', () => {
  it('recovers perTarget from the stamp even though the atom stacking reads "No"', () => {
    const v = toHitBuffValue(Invincibility)!;
    expect(v).toBeDefined();
    expect(v.scale).toBeCloseTo(0.2);
    expect(v.perTarget).toBeCloseTo(0.2); // would be 0 if we re-derived off `stacking`
  });
});

describe('atom-native ToHit — Inner Light burst/tail (sustained value)', () => {
  it('returns the 0.77 tail (not the 2.77 first-10s overlap), no perTarget', () => {
    const v = toHitBuffValue(InnerLight)!;
    expect(v).toBeDefined();
    expect(v.scale).toBeCloseTo(0.77);
    expect(v.perTarget ?? 0).toBe(0);
  });
});
