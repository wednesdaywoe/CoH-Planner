/**
 * PROD6E-2 — the per-piece display value is the dashboard's own.
 *
 * The picker preview and the enhancement info panel each carried a level rule of their own,
 * and each contradicted `calculatePowerEnhancementBonuses` on the three cases below. They
 * now route through `calculateSingleEnhancementValues`; these pin the behaviour that was
 * wrong, so reintroducing a local rule fails here rather than shipping a preview that
 * disagrees with the total it previews.
 *
 * Every case selects its piece by shape (a set whose cap is below 50, a piece carrying the
 * universal-mez aspect) rather than by name — the rules are the data's, not any one set's.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getAllIOSets, getIOSet } from '@/data/io-sets';
import { createIOSetEnhancement } from '@/data/enhancement-registry';
import { normalizeAspectName, calculateSingleEnhancementValues } from './enhancement-values';
import type { IOSet, IOSetPiece } from '@/types';

const MEZ_ASPECTS = ['hold', 'stun', 'immobilize', 'sleep', 'confuse', 'fear'] as const;

/** The first (set, piece) pair matching a predicate, in registry order. */
function findPiece(match: (set: IOSet, piece: IOSetPiece) => boolean): [IOSet, IOSetPiece] {
  for (const set of Object.values(getAllIOSets())) {
    for (const piece of set.pieces) {
      if (match(set, piece)) return [set, piece];
    }
  }
  throw new Error('no piece in the bundle matches — the fixture assumption is stale');
}

function values(
  [set, piece]: [IOSet, IOSetPiece],
  options: { attuned: boolean; level: number; boost?: number },
  buildLevel: number,
  exemplarLevel?: number,
) {
  const slot = createIOSetEnhancement(set, piece, piece.num, options);
  return calculateSingleEnhancementValues(slot, buildLevel, getIOSet, exemplarLevel);
}

describe('single-enhancement display values', () => {
  beforeAll(async () => { await loadDataset('homecoming'); }, 120_000);

  // The game does not cap an attuned IO at its set's maxLevel — an attuned piece from a
  // 10-30 set behaves as a level-50 IO on a level-50 character (verified 2026-05-18 against
  // the in-game tooltip; see `ioLevel` in enhancement-values.ts). Both surfaces used to cap,
  // so a capped set previewed the value of its own maximum crafted level instead.
  it('does not cap an attuned IO at the set max level', () => {
    const capped = findPiece((set, piece) =>
      set.maxLevel > 1 && set.maxLevel < 50 && piece.aspects?.length === 1 && !piece.proc
      && normalizeAspectName(piece.aspects[0]) !== null);
    const [, piece] = capped;
    const aspect = normalizeAspectName(piece.aspects[0])!;

    const attuned = values(capped, { attuned: true, level: 50 }, 50)[aspect]!;
    const crafted = values(capped, { attuned: false, level: capped[0].maxLevel }, 50)[aspect]!;
    expect(attuned).toBeGreaterThan(crafted);
  });

  // Both surfaces read `build.level` and never the exemplar setting, so every previewed
  // number was the unexemplared one while the dashboard showed the scaled value.
  it('honours exemplar level', () => {
    const target = findPiece((set, piece) =>
      set.maxLevel >= 50 && piece.aspects?.length === 1 && !piece.proc
      && normalizeAspectName(piece.aspects[0]) !== null);
    const aspect = normalizeAspectName(target[1].aspects[0])!;

    const at50 = values(target, { attuned: true, level: 50 }, 50)[aspect]!;
    const exemplared = values(target, { attuned: true, level: 50 }, 50, 25)[aspect]!;
    expect(exemplared).toBeLessThan(at50);
  });

  // `Mez` is the universal-mez aspect Controller/Dominator ATOs carry. It has no
  // `normalizeAspectName` entry — the calculation fans it out into the six mez aspects — so
  // a surface keying off the normalizer alone rendered its row with no value at all.
  it('resolves the universal Mez aspect', () => {
    const target = findPiece((_set, piece) => !!piece.aspects?.some((a) => a.trim() === 'Mez'));
    expect(normalizeAspectName('Mez')).toBeNull();

    const resolved = values(target, { attuned: true, level: 50 }, 50);
    for (const aspect of MEZ_ASPECTS) {
      expect(resolved[aspect]).toBeGreaterThan(0);
    }
    // One magnitude across all six — the surfaces read whichever one they hold.
    expect(new Set(MEZ_ASPECTS.map((a) => resolved[a]!.toFixed(6))).size).toBe(1);
  });
});
