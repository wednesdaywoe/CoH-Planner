import { describe, it, expect } from 'vitest';
import { resolveProcPieceName, findProcData } from './proc-data';
import { IO_SETS_RAW as HC_SETS } from './datasets/homecoming/io-sets-raw';
import { IO_SETS_RAW as RB_SETS } from './datasets/rebirth/io-sets-raw';

/**
 * resolveProcPieceName rescues the "proc shows just 'Chance'" bug.
 *
 * The IO-set binary extractor can only name a proc piece when its effect is
 * derivable from the binary template; otherwise it emits a placeholder
 * "Chance" / "Recharge/Chance". The authoritative proc identity lives in
 * PROC_DATABASE, so the DISPLAY layer resolves the real ioName from there
 * (e.g. Preventive Medicine "Chance" → "Chance for +Absorb").
 *
 * Critically, the stored `enhancement.name` is NOT changed — it stays the raw
 * piece label because the calc engine keys findProcData on it, and the real
 * ioNames collide with bare PROC_DATABASE keys (e.g. "Chance for +Absorb"
 * exists for Entomb). Resolution happens only where names are displayed.
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

  // Coverage guard: every placeholder-named proc piece in the shipped datasets
  // that HAS a PROC_DATABASE entry must resolve to a real (non-placeholder)
  // name, so a bare "Chance" never reaches the UI. (Pieces with no proc-data
  // entry are a separate coverage gap and are skipped here.)
  describe.each([
    ['homecoming', HC_SETS],
    ['rebirth', RB_SETS],
  ])('%s placeholder procs resolve to real names', (_ds, REG) => {
    for (const [setId, set] of Object.entries(REG)) {
      for (const piece of set.pieces) {
        if (!piece.proc || !PLACEHOLDERS.has(piece.name)) continue;
        if (findProcData(piece.name, set.name) === undefined) continue;
        it(`${setId} #${piece.num} "${piece.name}" → real name`, () => {
          const resolved = resolveProcPieceName(piece.name, set.name, piece.proc);
          expect(PLACEHOLDERS.has(resolved)).toBe(false);
          expect(resolved.length).toBeGreaterThan(0);
        });
      }
    }
  });
});
