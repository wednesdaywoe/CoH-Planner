import { describe, it, expect } from 'vitest';
import { resolveProcPieceName, findProcData } from './proc-data';
import { IO_SETS_RAW as HC_SETS } from './datasets/homecoming/io-sets-raw';
import { IO_SETS_RAW as RB_SETS } from './datasets/rebirth/io-sets-raw';
import { IO_SETS_RAW as TS_SETS } from './datasets/thunderspy/io-sets-raw';

/**
 * resolveProcPieceName rescues the "proc shows just 'Chance'" bug.
 *
 * The placeholder is what the IO-set extractor falls back to for a proc piece it
 * cannot name. The authoritative proc identity lives in PROC_DATABASE, so the
 * DISPLAY layer resolves the real ioName from there (e.g. "Chance" → "Chance for
 * +Absorb").
 *
 * Critically, the stored `enhancement.name` is NOT changed — it stays the raw
 * piece label because the calc engine keys findProcData on it, and the real
 * ioNames collide with bare PROC_DATABASE keys (e.g. "Chance for +Absorb"
 * exists for Entomb). Resolution happens only where names are displayed.
 *
 * The extractor now names pieces from the boost power's own display_name, so
 * Homecoming and Rebirth ship no placeholders at all and the rescue is reached
 * only by the two Thunderspy pieces whose display_name is an unresolved message
 * id. The last block below guards that, and the unit cases above keep the rescue
 * itself honest for as long as any piece needs it.
 */
const PLACEHOLDERS = new Set(['Chance', 'Recharge/Chance']);

describe('resolveProcPieceName', () => {
  it('rescues the Preventive Medicine +Absorb placeholder (the reported bug)', () => {
    expect(resolveProcPieceName('Chance', 'Preventive Medicine', true)).toBe('Chance for +Absorb');
  });

  it('is a no-op for non-proc pieces', () => {
    expect(resolveProcPieceName('Chance', 'Preventive Medicine', false)).toBe('Chance');
  });

  it('leaves already-meaningful proc names unchanged (curated globals)', () => {
    // Not a placeholder → never re-resolved, even though it is a proc piece.
    expect(resolveProcPieceName('Defense/+Recharge', 'Luck of the Gambler', true)).toBe('Defense/+Recharge');
  });

  it('falls back to the raw name when no proc-data entry exists for the set', () => {
    expect(resolveProcPieceName('Chance', 'No Such Set', true)).toBe('Chance');
  });

  // Coverage guard, in two halves: no shipped piece should carry a placeholder
  // in the first place, and any that still does must resolve to a real name.
  describe.each([
    ['homecoming', HC_SETS],
    ['rebirth', RB_SETS],
    ['thunderspy', TS_SETS],
  ])('%s', (dataset, REG) => {
    const placeholders = Object.entries(REG).flatMap(([setId, set]) =>
      set.pieces
        .filter((piece) => PLACEHOLDERS.has(piece.name))
        .map((piece) => ({ label: `${setId} #${piece.num}`, piece, setName: set.name })),
    );

    it('ships no placeholder-named pieces beyond the ones the export cannot name', () => {
      // Thunderspy's two Scourging Blast procs have an unresolved message id for
      // a display_name, so the derived name stands; nothing else should be here.
      const expected =
        dataset === 'thunderspy'
          ? ['scourging_blast #6', 'superior_scourging_blast #6']
          : [];
      expect(placeholders.map((row) => row.label).sort()).toEqual(expected);
    });

    it('resolves every placeholder it does ship to a real name', () => {
      const unresolved = placeholders
        .filter((row) => findProcData(row.piece.name, row.setName) !== undefined)
        .filter((row) => PLACEHOLDERS.has(resolveProcPieceName(row.piece.name, row.setName, row.piece.proc)))
        .map((row) => row.label);
      expect(unresolved).toEqual([]);
    });
  });
});
