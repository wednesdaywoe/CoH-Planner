import { describe, it, expect } from 'vitest';
import { ALPHA_KEY_TO_ENH_ASPECT } from '@/utils/calculations/character-totals';
import { GENERATED_ALPHA_EFFECTS as HC_ALPHA, GENERATED_ALPHA_ED_BYPASS as HC_BYPASS } from '@/data/datasets/homecoming/generated/incarnate-effects';
import { GENERATED_ALPHA_EFFECTS as RB_ALPHA, GENERATED_ALPHA_ED_BYPASS as RB_BYPASS } from '@/data/datasets/rebirth/generated/incarnate-effects';
import { GENERATED_ALPHA_EFFECTS as TS_ALPHA, GENERATED_ALPHA_ED_BYPASS as TS_BYPASS } from '@/data/datasets/thunderspy/generated/incarnate-effects';

/**
 * Every Alpha aspect the converter emits must be one the calc can spend.
 *
 * `mapAlphaEffectsToEnhancementBonuses` translates the alpha data vocabulary
 * into the enhancement-aspect vocabulary; a key it doesn't know is dropped in
 * silence, and the power keeps rendering its other bonuses as if nothing were
 * missing. That has now happened twice:
 *
 *   - `enduranceModification` was written where the aspect gates read
 *     `enduranceMod` (Musculature / Agility lost their +End Mod);
 *   - `intangible` came from an HC silent-file slot REUSE — the file kept the
 *     Intangible name while its content became Absorb — so Cardiac Radial
 *     Paragon, Resilient Radial Paragon and Resilient Total Radial Revamp lost
 *     their entire Absorb boost (reported 2026-07-27).
 *
 * Both were invisible: the data was there, the totals just never read it. This
 * gate fails the moment a dataset regen emits an aspect nothing maps.
 */

const DATASETS: Array<[string, Record<string, Record<string, number>>]> = [
  ['homecoming alpha', HC_ALPHA],
  ['homecoming ed-bypass', HC_BYPASS],
  ['rebirth alpha', RB_ALPHA],
  ['rebirth ed-bypass', RB_BYPASS],
  ['thunderspy alpha', TS_ALPHA],
  ['thunderspy ed-bypass', TS_BYPASS],
];

// The one key that is legitimately not an enhancement aspect.
const NON_ASPECT_KEYS = new Set(['levelShift']);

describe('Alpha aspect coverage', () => {
  it.each(DATASETS)('%s: every emitted key maps to an enhancement aspect', (label, table) => {
    const unmapped = new Set<string>();
    let checked = 0;
    for (const effects of Object.values(table)) {
      for (const key of Object.keys(effects)) {
        checked++;
        if (NON_ASPECT_KEYS.has(key)) continue;
        if (ALPHA_KEY_TO_ENH_ASPECT[key] === undefined) unmapped.add(key);
      }
    }
    // Guard the guard: an empty table would pass vacuously.
    expect(checked, `${label} has no alpha entries to check`).toBeGreaterThan(100);
    expect([...unmapped].sort(), `${label} emits aspect(s) nothing maps`).toEqual([]);
  });

  /**
   * The Absorb regression itself, pinned per dataset. These three are the only
   * Alphas that grant Absorb; the value is the silent file's summed scale
   * (0.11 + 0.22 = 33%), of which the BoostIgnoreDiminishing half (22%) skips
   * ED. Resilient Total Radial Revamp is the Rare tier: 0.165 + 0.165.
   */
  const ABSORB_ALPHAS: Array<[string, number, number]> = [
    ['cardiac_radial_paragon', 0.33, 0.22],
    ['resilient_radial_paragon', 0.33, 0.22],
    ['resilient_total_radial_revamp', 0.33, 0.165],
  ];

  it.each([
    ['homecoming', HC_ALPHA, HC_BYPASS],
    ['rebirth', RB_ALPHA, RB_BYPASS],
    ['thunderspy', TS_ALPHA, TS_BYPASS],
  ] as Array<[string, Record<string, Record<string, number>>, Record<string, Record<string, number>>]>)(
    '%s: the three Absorb Alphas carry their Absorb boost',
    (label, alpha, bypass) => {
      for (const [powerId, total, edBypass] of ABSORB_ALPHAS) {
        expect(alpha[powerId]?.absorb, `${label}/${powerId} lost its Absorb boost`).toBeCloseTo(total, 4);
        expect(bypass[powerId]?.absorb, `${label}/${powerId} lost its Absorb ED bypass`).toBeCloseTo(edBypass, 4);
        expect(alpha[powerId]?.intangible, `${label}/${powerId} still emits the stale intangible key`).toBeUndefined();
      }
    },
  );
});
