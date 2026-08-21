import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { ORIGIN_TIER_INFO } from '@/data/enhancements';
import * as dataBarrel from '@/data';
import { getEnhancementCurves } from '@/data/enhancement-curves';
import {
  getIOValueAtLevel,
  getAspectSchedule,
  getOriginTierValue,
  applyED,
  parseIOSetPieceValues,
  ASPECT_BOOST_TYPE,
} from './enhancement-values';
import type { EnhancementSchedule } from './enhancement-values';

/**
 * Enhancement magnitudes come off the dataset's curves, never a transcribed table.
 *
 * Rule 0 names `Maths.txt` specifically, and this is why. The public twin carried four
 * hardcoded tables here — per-level IO strength, ED thresholds, ED tier effectiveness, and
 * schedule assignment — plus a flat per-tier origin value. Three of the four happened to
 * agree with the export, which is exactly what let them survive; the other two shipped wrong
 * numbers for as long as they existed:
 *
 *  - Per-level IO strength was a 10-anchor `Maths.txt` table linearly interpolated between
 *    anchors. It disagrees with the curve on 8 of the 41 craft levels on every fork and
 *    schedule, worst 1.3 points at L26.
 *  - Origin enhancements read one flat number per tier, so every non-Schedule-A aspect was
 *    wrong: a Defense SO paid 33.3% against the export's 20%, a Knockback SO 33.3% against
 *    60%. Thunderspy rebalances the TO/DO ladder outright, so there even Schedule A was off.
 *
 * The agreeing tables are guarded too. A table that matches today is not sourced from the
 * export, it is a copy that has not drifted yet, and the next fork is what moves it.
 */

const FORKS = ['homecoming', 'rebirth', 'thunderspy'] as const;
const SCHEDULES: EnhancementSchedule[] = ['A', 'B', 'C', 'D'];

/** The rounded table the twin used to carry, kept as the thing we must NOT match. */
const RETIRED_MATHS_TABLE: Record<EnhancementSchedule, Record<number, number>> = {
  A: { 10: 0.117, 25: 0.32, 30: 0.348, 50: 0.424 },
  B: { 10: 0.07, 25: 0.192, 30: 0.209, 50: 0.255 },
  C: { 10: 0.14, 25: 0.385, 30: 0.418, 50: 0.509 },
  D: { 10: 0.21, 25: 0.577, 30: 0.627, 50: 0.764 },
};

describe.each(FORKS)('enhancement magnitudes are export-sourced (%s)', (fork) => {
  beforeAll(async () => { await loadDataset(fork); }, 300_000);

  it('per-level IO strength is the dataset curve itself, at every craft level', () => {
    const { schedules } = getEnhancementCurves();
    for (const s of SCHEDULES) {
      const curve = schedules[s].strengthByBoostLevel;
      expect(curve.length, `${s} curve must be populated`).toBeGreaterThan(40);
      for (let level = 10; level <= 50; level++) {
        const expected = curve[Math.min(level, curve.length) - 1];
        expect(getIOValueAtLevel(level, s), `${s} L${level}`).toBe(expected);
      }
    }
  });

  it('and is NOT the retired interpolated table — the two genuinely differ', () => {
    // Without this the test above passes on any implementation that happens to round the
    // same way. L26 is the worst disagreement; it sits between two table anchors, which is
    // where interpolation invents a value the curve does not have.
    const { schedules } = getEnhancementCurves();
    let disagreements = 0;
    for (const s of SCHEDULES) {
      for (const [lvl, tableValue] of Object.entries(RETIRED_MATHS_TABLE[s])) {
        if (Math.abs(getIOValueAtLevel(Number(lvl), s) - tableValue) > 1e-9) disagreements++;
      }
      const curve = schedules[s].strengthByBoostLevel;
      const anchors = RETIRED_MATHS_TABLE[s];
      const interpolatedAt26 = anchors[25] + (anchors[30] - anchors[25]) * (1 / 5);
      expect(
        Math.abs(curve[25] - interpolatedAt26),
        `${s}: interpolating L26 between the table's anchors must not reproduce the curve`,
      ).toBeGreaterThan(0.001);
    }
    expect(disagreements, 'the rounded table must differ from the curve somewhere').toBeGreaterThan(0);
  });

  it('ED thresholds and tier effectiveness come off the dataset', () => {
    const { schedules, tierEffectiveness } = getEnhancementCurves();
    const [t2eff] = tierEffectiveness;
    for (const s of SCHEDULES) {
      const [t1, t2] = schedules[s].edThresholds;
      expect(applyED(t1, s), `${s}: at the knee ED is still a no-op`).toBeCloseTo(t1, 10);
      // One point past the first threshold is discounted at the dataset's own tier-2 rate.
      const past = t1 + (t2 - t1) / 2;
      expect(applyED(past, s), `${s}: tier-2 slope`).toBeCloseTo(t1 + (past - t1) * t2eff, 10);
    }
  });

  it('schedule assignment is the dataset lookup, and an unknown aspect fails loud', () => {
    const { boostTypeSchedules, defaultSchedule } = getEnhancementCurves();
    for (const [aspect, boostType] of Object.entries(ASPECT_BOOST_TYPE)) {
      const expected =
        boostType === null ? defaultSchedule : boostTypeSchedules[boostType] ?? defaultSchedule;
      expect(getAspectSchedule(aspect), aspect).toBe(expected);
    }
    // Rule 1: the retired implementation returned 'A' for anything it did not know.
    expect(() => getAspectSchedule('notAnAspect')).toThrow(/aspect/i);
  });

  it('origin tiers are per aspect schedule, not one flat number per tier', () => {
    const { originTiers } = getEnhancementCurves();
    for (const tier of ['TO', 'DO', 'SO'] as const) {
      for (const aspect of Object.keys(ASPECT_BOOST_TYPE)) {
        const schedule = getAspectSchedule(aspect);
        expect(getOriginTierValue(tier, aspect), `${tier} ${aspect}`)
          .toBeCloseTo(originTiers[tier][schedule] * 100, 10);
      }
      // The schedules must not all land on one value, or a flat table would still pass.
      const spread = new Set(SCHEDULES.map((s) => originTiers[tier][s]));
      expect(spread.size, `${tier}: the four schedules must not share one value`).toBeGreaterThan(1);
    }
    // The two the flat table got most wrong, in both directions.
    expect(getOriginTierValue('SO', 'defense')).toBeCloseTo(originTiers.SO.B * 100, 10);
    expect(getOriginTierValue('SO', 'knockback')).toBeCloseTo(originTiers.SO.D * 100, 10);
    expect(getOriginTierValue('SO', 'knockback')).toBeGreaterThan(getOriginTierValue('SO', 'defense'));
  });

  it('the Move Speed bundle fans out to all four travel keys at their own schedules', () => {
    // Winter's Gift / Blessing of the Zephyr: one boost enhancing every travel mode plus
    // Range. An unrecognized aspect is SKIPPED by the parser, so before the fan-out existed
    // these pieces enhanced nothing at all through it.
    const v = parseIOSetPieceValues(['Move Speed'], 50);
    for (const key of ['run', 'fly', 'jump', 'range'] as const) {
      expect(v[key], `Move Speed must reach ${key}`).toBeGreaterThan(0);
    }
    // Range is Schedule B where the travel modes are A, so a single shared lookup would
    // give all four the same number.
    expect(getAspectSchedule('range')).not.toBe(getAspectSchedule('run'));
    expect(v.range).not.toBeCloseTo(v.run!, 6);
  });
});

/**
 * The class rather than the instance: a tier magnitude has exactly one home.
 *
 * The case above grades `getOriginTierValue`, and is blind to a second, flat copy of
 * the same number living somewhere else and being read instead. That is not
 * hypothetical — the twin's `OriginTierInfo` carried a `value: 33.3` that its picker
 * printed directly, both as the tier heading and inside a per-stat tooltip that names
 * the aspect while quoting a number that ignores it, and a same-named
 * `getOriginTierValue` sat beside it in the `@/data` barrel shadowing the curve read.
 * Every magnitude test passed the whole time, because none of them looked here.
 */
describe('an origin-tier magnitude has one source', () => {
  it('the presentation table carries no number at all', () => {
    for (const tier of ORIGIN_TIER_INFO) {
      const numeric = Object.entries(tier)
        .filter(([, v]) => typeof v === 'number')
        .map(([k]) => k);
      expect(numeric, `${tier.short}: presentation metadata only`).toEqual([]);
    }
  });

  it('and no second `getOriginTierValue` is reachable beside the curve read', () => {
    // A flat re-implementation under the same name is resolved by import order, so the
    // two-argument curve read being correct is not enough — the shadow must not exist.
    expect(Object.keys(dataBarrel)).not.toContain('getOriginTierValue');
    expect(Object.keys(dataBarrel)).not.toContain('getOriginTier');
    expect(getOriginTierValue.length, 'the curve read takes tier AND aspect').toBe(2);
  });
});
