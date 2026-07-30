import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { mapEnhancementUid } from './mappers';
import { enhancementLevelMultiplier } from '@/utils/calculations';

/**
 * Mids `RelativeLevel` (the `eEnhRelative` enum) runs MinusThree..PlusFive, but
 * the importer's lookup table only listed `PlusOne`..`PlusFive`. Every `Minus*`
 * fell through the `?? 0` and imported as even.
 *
 * That silently overstated imported builds, and SOs are where it bites: a
 * levelling build is full of them, and on Homecoming one three levels under
 * your combat level is worth x0.70. Specials had the same hole, but a build
 * carrying under-level Hamidons is a far rarer thing than one carrying red SOs.
 */

beforeAll(async () => {
  await loadDataset('homecoming');
});

const RELATIVE_LEVELS: Array<[string, number]> = [
  ['MinusThree', -3],
  ['MinusTwo', -2],
  ['MinusOne', -1],
  ['Even', 0],
  ['PlusOne', 1],
  ['PlusTwo', 2],
  ['PlusThree', 3],
];

describe('Mids import — relative level', () => {
  it.each(RELATIVE_LEVELS)('reads an SO at %s as %i', (relativeLevel, expected) => {
    const { enhancement } = mapEnhancementUid('Damage', 49, relativeLevel, 'SO');
    expect(enhancement, `SO at ${relativeLevel} did not map`).toBeTruthy();
    // 0 is stored as undefined so an even slot stays slim on the wire.
    expect(enhancement!.boost ?? 0).toBe(expected);
  });

  it('the negative half actually reaches the calculation', () => {
    const under = mapEnhancementUid('Damage', 49, 'MinusThree', 'SO').enhancement!;
    const even = mapEnhancementUid('Damage', 49, 'Even', 'SO').enhancement!;
    expect(enhancementLevelMultiplier(under)).toBeCloseTo(0.7, 6);
    expect(enhancementLevelMultiplier(even)).toBeCloseTo(1, 6);
    // The bug: flooring MinusThree to Even made an out-levelled SO read as a
    // fresh one — a 43% overstatement of that slot's contribution.
    expect(enhancementLevelMultiplier(even) / enhancementLevelMultiplier(under))
      .toBeCloseTo(1 / 0.7, 5);
  });

  it('carries the negative onto specials too', () => {
    const { enhancement } = mapEnhancementUid('Hamidon_Damage_Accuracy', 49, 'MinusTwo', 'SingleO');
    expect(enhancement, 'special did not map').toBeTruthy();
    expect(enhancement!.boost).toBe(-2);
  });

  it('an empty slot has no level offset to preserve', () => {
    // Mids writes "None" for an unfilled slot; it is not a -1.
    const { enhancement } = mapEnhancementUid('Damage', 49, 'None', 'SO');
    expect(enhancement!.boost ?? 0).toBe(0);
  });
});
