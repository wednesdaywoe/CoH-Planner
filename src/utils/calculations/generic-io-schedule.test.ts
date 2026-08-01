import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import type { DatasetId } from '@/data/dataset';
import { getAllIOSets, COMMON_IO_TYPES } from '@/data';
import { createGenericIOEnhancement } from '@/data/enhancement-registry';
import {
  normalizeAspectName,
  getAspectSchedule,
  genericIOValueAtLevel,
  calculatePowerEnhancementBonuses,
} from './enhancement-values';

/**
 * Generic-IO display value == the value the calc applies (reported 2026-07-31).
 *
 * A level 50 ToHit IO showed +42.4% and enhanced by 25.5%. The display side went
 * through its own `COMMON_IO_VALUES` table in `src/data/enhancements.ts` that only
 * ever held the Schedule A curve, so every Schedule B/C/D generic IO — ToHit, ToHit
 * Debuff, Defense, Resistance, Range, Interrupt, Knockback — was labelled with the
 * Schedule A number while `accumulateRawSlotBonuses` read the real schedule off
 * `getAspectSchedule`. The duplicate table is gone; both sides now resolve the aspect
 * once and read one curve, which is what the first test here pins.
 *
 * The second is the vocabulary guard that would have caught the sibling bug found
 * alongside it: `Immobilize` is a live `boosts_allowed` term on 109 HC powers and an
 * aspect on 17 set pieces, and it was absent from `ASPECT_NAME_MAP`. An absent name
 * is not an inert one — every consumer SKIPS the aspect, so those enhancements
 * contributed nothing at all. Silent zero is exactly the soft-wrong number the
 * fail-loud rule exists to stop, so a term the datasets use and the map lacks must
 * red here rather than ship.
 */

/** Piece aspects that are deliberately NOT enhancement aspects. `Mez` and `Move
 *  Speed` fan out to several keys (handled by `parseAspectsToBonuses`, never by
 *  `normalizeAspectName`); the rest name a piece's special/proc behaviour, which
 *  carries no schedule of its own. They still occupy an aspect slot, so they count
 *  toward the multi-aspect divisor via `getEffectiveAspectCount`. */
const NON_ENHANCEMENT_ASPECTS = new Set([
  'Mez',
  'Move Speed',
  'PowerChanceMod',
  '+Fly Magnitude',
  'KnockToKnockDown',
]);

const DATASET_IDS: DatasetId[] = ['homecoming', 'rebirth', 'thunderspy'];

describe.each(DATASET_IDS)('Generic IO schedules (%s)', (datasetId) => {
  beforeAll(async () => {
    await loadDataset(datasetId);
  }, 120000);

  it('labels each generic IO with the value it actually enhances by', () => {
    const mismatched: string[] = [];
    for (const stat of COMMON_IO_TYPES) {
      const enhancement = createGenericIOEnhancement(stat, 50);
      const normalized = normalizeAspectName(stat);
      expect(normalized, `${stat} has no normalized aspect`).not.toBeNull();
      // One IO is always under its schedule's first ED threshold, so this reads the
      // raw enhancement the calc applies without ED muddying the comparison.
      const applied = calculatePowerEnhancementBonuses({ name: stat, slots: [enhancement] }, 50);
      const appliedPct = ((applied[normalized!] as number | undefined) ?? 0) * 100;
      if (Math.abs(enhancement.value - appliedPct) > 0.001) {
        mismatched.push(`${stat}: shown +${enhancement.value.toFixed(1)}% vs applied +${appliedPct.toFixed(1)}%`);
      }
    }
    expect(mismatched, 'generic IO tooltip disagrees with the calc').toEqual([]);
  });

  it('puts ToHit on Schedule B, not the Schedule A default', () => {
    // The reported symptom, pinned directly: Schedule A at 50 is 42.4%.
    expect(getAspectSchedule('tohit')).toBe('B');
    expect(genericIOValueAtLevel('ToHit', 50)).toBeCloseTo(25.5, 1);
  });

  it('normalizes every aspect the dataset actually uses', () => {
    const unmapped = new Set<string>();
    for (const stat of COMMON_IO_TYPES) {
      if (!normalizeAspectName(stat)) unmapped.add(`generic IO "${stat}"`);
    }
    for (const set of Object.values(getAllIOSets())) {
      for (const piece of set.pieces ?? []) {
        for (const aspect of piece.aspects ?? []) {
          if (NON_ENHANCEMENT_ASPECTS.has(aspect)) continue;
          if (!normalizeAspectName(aspect)) unmapped.add(`set piece "${aspect}" (${set.name})`);
        }
      }
    }
    expect([...unmapped], 'unmapped aspects contribute NOTHING, silently').toEqual([]);
  });
});
