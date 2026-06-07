import { describe, it, expect } from 'vitest';
import { PROC_DATABASE, findProcData } from '@/data/proc-data';
import { IO_SETS_RAW as HC_SETS } from '@/data/datasets/homecoming/io-sets-raw';
import { IO_SETS_RAW as RB_SETS } from '@/data/datasets/rebirth/io-sets-raw';

/**
 * Guard against the Steadfast/Stupefy proc mis-resolution class.
 *
 * The IO-set binary extractor can't always name a proc piece (e.g. a
 * Knockback proc effect has no label), so it emits the placeholder "Chance".
 * When such a piece is slotted, the UI resolves its effect via
 * findProcData(piece.name, set.name). A bare "Chance" matches no proc-data
 * key, so findProcData falls through to its set-name fallback, which returns
 * the FIRST PROC_DATABASE entry for that set. For a set with more than one
 * special (Steadfast: +Def AND +KB Prot; Stupefy: Chance-for-Stun AND
 * Chance-for-Knockback) that silently shows the WRONG effect.
 *
 * Invariant: every proc piece in a set that has >1 proc-data entry must
 * resolve by an EXACT name match — never the ambiguous set-name fallback.
 * Curate the piece's real name in HC_PIECE_PATCHES (extract-rebirth-io-sets-v2.py)
 * so it matches its proc-data entry.
 */
function resolvesExactly(name: string, setName: string): boolean {
  if (PROC_DATABASE[`${setName}: ${name}`]) return true;
  if (PROC_DATABASE[name]) return true; // exact bare key
  for (const [key, data] of Object.entries(PROC_DATABASE)) {
    if ((data.ioName === name || key.endsWith(`: ${name}`)) && data.setName === setName) return true;
  }
  return false;
}

describe.each([
  ['homecoming', HC_SETS],
  ['rebirth', RB_SETS],
])('%s proc pieces resolve unambiguously', (_dataset, REG) => {
  for (const [setId, set] of Object.entries(REG)) {
    const dbEntries = Object.values(PROC_DATABASE).filter((d) => d.setName === set.name).length;
    if (dbEntries < 2) continue; // single-entry fallback can't pick the wrong one
    for (const piece of set.pieces.filter((p) => p.proc)) {
      it(`${setId} #${piece.num} "${piece.name}" matches a proc-data entry exactly`, () => {
        // If it doesn't resolve exactly, findProcData would grab the first of
        // ${dbEntries} entries for "${set.name}" — likely the wrong effect.
        expect(resolvesExactly(piece.name, set.name)).toBe(true);
        // And the resolved effect must actually belong to this set.
        expect(findProcData(piece.name, set.name)?.setName).toBe(set.name);
      });
    }
  }
});
