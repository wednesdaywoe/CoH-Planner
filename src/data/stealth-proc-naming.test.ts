import { describe, it, expect } from 'vitest';
import { IO_SETS_RAW as HC_SETS } from '@/data/datasets/homecoming/io-sets-raw';
import { IO_SETS_RAW as RB_SETS } from '@/data/datasets/rebirth/io-sets-raw';
import { findProcData, getProcEffects } from '@/data/proc-data';

/**
 * Regression: the travel-set stealth globals (Celerity, Freebird, Time & Space
 * Manipulation, Unbounded Leap) were mis-extracted as "Chance for Resurrect" —
 * their stealth grant is a Create_Entity template, which the extractor's
 * CREATE_ENTITY_LABEL maps to "Resurrect" (correct only for Return From The
 * Grave). The effect still resolved via findProcData's set-name fallback, but
 * the slot displayed the bogus name.
 *
 * The name is the game's own now, read off the boost power, and the game calls
 * the piece "Stealth". What still needs guarding is everything around it: the
 * piece must carry the proc flag (HC_PIECE_PATCHES restores it, since a
 * Create_Entity template isn't read as a proc), and the name must resolve to
 * THIS set's stealth effect rather than a sibling travel set's.
 */
type Registry = Record<string, { name: string; pieces: Array<{ name: string; num: number; proc: boolean }> }>;

const STEALTH_SETS = ['celerity', 'freebird', 'timespace_manipulation', 'unbounded_leap'] as const;

describe('Travel-set +Stealth proc naming', () => {
  for (const [label, reg] of [
    ['homecoming', HC_SETS as unknown as Registry],
    ['rebirth', RB_SETS as unknown as Registry],
  ] as const) {
    for (const setId of STEALTH_SETS) {
      it(`${label}/${setId}: #3 is a "Stealth" proc resolving to a Stealth effect`, () => {
        const set = reg[setId];
        const piece = set.pieces.find((p) => p.num === 3)!;
        expect(piece.name).toBe('Stealth');
        expect(piece.proc).toBe(true);

        const data = findProcData(piece.name, set.name);
        expect(data, `${setId} should resolve proc data`).toBeDefined();
        expect(data!.setName).toBe(set.name); // resolves to THIS set, not a sibling stealth set
        const stealth = getProcEffects(data!).find((e) => e.category === 'Stealth' && (e.value ?? 0) > 0);
        expect(stealth, `${setId} should have a Stealth effect`).toBeDefined();
      });
    }
  }

  it('does not mistake the real resurrect proc for stealth', () => {
    // Sanity: no IO-set piece is still named "Chance for Resurrect"
    const offenders: string[] = [];
    for (const [label, reg] of [['hc', HC_SETS], ['rebirth', RB_SETS]] as const) {
      for (const [id, set] of Object.entries(reg as unknown as Registry)) {
        for (const p of set.pieces ?? []) {
          if (p.name === 'Chance for Resurrect') offenders.push(`${label}/${id} #${p.num}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
