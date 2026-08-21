/**
 * An active Alpha must not relevel the slots it sits alongside.
 *
 * `combineWithAlphaED` is the aggregation every slotted power runs through once an Alpha
 * incarnate is active — the power detail panel, the tooltip, the totals, the perma ring.
 * Its non-attuned IO-set branch read the piece at `min(buildLevel, set.maxLevel)` and never
 * looked at `slot.level`, so a deliberately down-crafted IO silently paid out at the
 * character's level: an Artillery Acc/Dam/Rech crafted at 30 read 21.2% recharge (the L50
 * value) instead of 17.4%, but ONLY on builds with an Alpha — which is why it presented as
 * "enhancements sometimes can't be downleveled".
 *
 * The sibling `calculatePowerEnhancementBonuses` has honoured `slot.level` since the
 * Gaussian's fix; these pin the two to each other so a level rule can only be changed in
 * one place, and pin the reported magnitudes so the regression can't come back numerically
 * silent.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getAllIOSets, getIOSet } from '@/data/io-sets';
import { createIOSetEnhancement } from '@/data/enhancement-registry';
import {
  calculatePowerEnhancementBonuses,
  combineWithAlphaED,
  normalizeAspectName,
} from './enhancement-values';
import type { IOSet, IOSetPiece } from '@/types';

/** The first (set, piece) pair matching a predicate, in registry order. */
function findPiece(match: (set: IOSet, piece: IOSetPiece) => boolean): [IOSet, IOSetPiece] {
  for (const set of Object.values(getAllIOSets())) {
    for (const piece of set.pieces) {
      if (match(set, piece)) return [set, piece];
    }
  }
  throw new Error('no piece in the bundle matches — the fixture assumption is stale');
}

/** A one-slot power holding `piece` crafted at `level`, non-attuned. */
function slotted(set: IOSet, piece: IOSetPiece, level: number) {
  return {
    name: 'test',
    slots: [createIOSetEnhancement(set, piece, piece.num, { attuned: false, level })],
  };
}

describe('Alpha combine reads the slot craft level', () => {
  beforeAll(async () => { await loadDataset('homecoming'); }, 120_000);

  // The reported case, by name and by number: a three-aspect piece from a 10–50 set,
  // crafted at 30, on a level-50 character with an Alpha. Schedule-A strength is 0.34810 at
  // L30 and 0.42380 at L50, read off the dataset's own curve; the three-aspect modifier
  // halves both. These were 0.348 / 0.424 while the values came from a rounded Maths.txt
  // table — close enough to look right, and wrong by up to 1.3 points at other levels.
  it('values a down-crafted piece at its craft level, not the build level', () => {
    const artillery = getAllIOSets()['Artillery'] ?? Object.values(getAllIOSets()).find((s) => s.name === 'Artillery');
    expect(artillery, 'Artillery is in the Homecoming bundle').toBeTruthy();
    const piece = artillery!.pieces.find((p) => p.name.includes('Accuracy/Damage/Recharge'));
    expect(piece, 'Artillery ships an Accuracy/Damage/Recharge piece').toBeTruthy();

    const alpha = { damage: 0.33 };
    const bypass = { damage: 0.15 };

    const at30 = combineWithAlphaED(slotted(artillery!, piece!, 30), 50, getIOSet, alpha, bypass);
    const at50 = combineWithAlphaED(slotted(artillery!, piece!, 50), 50, getIOSet, alpha, bypass);

    expect(at30.recharge).toBeCloseTo(0.17405, 5);
    expect(at50.recharge).toBeCloseTo(0.21190, 5);
  });

  // The invariant behind the number: Alpha changes what is ADDED to a power's aspects, never
  // how the slots themselves are read. Every aspect the two aggregations share must agree on
  // a slot-only power (empty Alpha), at any craft level.
  it('agrees with the non-Alpha aggregation at every craft level', () => {
    const target = findPiece((set, piece) =>
      set.maxLevel >= 50 && (set.minLevel ?? 10) <= 10 && !piece.proc
      && (piece.aspects?.length ?? 0) >= 2
      && piece.aspects!.every((a) => normalizeAspectName(a) !== null));

    for (const level of [10, 25, 30, 40, 50]) {
      const power = slotted(target[0], target[1], level);
      const plain = calculatePowerEnhancementBonuses(power, 50, getIOSet);
      const withAlpha = combineWithAlphaED(power, 50, getIOSet, {}, {});
      expect(Object.keys(withAlpha).sort()).toEqual(Object.keys(plain).sort());
      for (const [aspect, value] of Object.entries(plain)) {
        expect(withAlpha[aspect], `${aspect} at craft level ${level}`).toBeCloseTo(value!, 10);
      }
    }
  });

  // Attuned pieces have no craft level at all — they scale with the character — so the fix
  // must not start reading a `level` the picker deliberately leaves undefined on them.
  it('leaves attuned pieces scaling with the character', () => {
    const target = findPiece((set, piece) =>
      set.maxLevel > 1 && set.maxLevel < 50 && !piece.proc
      && piece.aspects?.length === 1 && normalizeAspectName(piece.aspects[0]) !== null);
    const aspect = normalizeAspectName(target[1].aspects[0])!;

    const attuned = {
      name: 'test',
      slots: [createIOSetEnhancement(target[0], target[1], target[1].num, { attuned: true, level: target[0].maxLevel })],
    };
    const capped = slotted(target[0], target[1], target[0].maxLevel);

    const attunedValue = combineWithAlphaED(attuned, 50, getIOSet, {}, {})[aspect]!;
    const cappedValue = combineWithAlphaED(capped, 50, getIOSet, {}, {})[aspect]!;
    expect(attunedValue).toBeGreaterThan(cappedValue);
  });
});
