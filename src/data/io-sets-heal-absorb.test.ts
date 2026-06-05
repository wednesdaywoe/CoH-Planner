import { describe, it, expect } from 'vitest';
import { IO_SETS_RAW as HC_SETS } from '@/data/datasets/homecoming/io-sets-raw';
import { IO_SETS_RAW as RB_SETS } from '@/data/datasets/rebirth/io-sets-raw';

/**
 * Heal/Absorb enhancement-aspect invariant.
 *
 * In CoH every Heal-boosting enhancement also boosts Absorb — they share one
 * enhancement category, and the binary encodes Absorb as its OWN Strength
 * attrib on healing pieces (verified against boostsets.bin: Panacea/Numina/etc.
 * each carry HitPoints AND a distinct Absorb attrib). The planner treats Heal
 * and Absorb as separate, value-DILUTING aspects: `parseIOSetPieceValues`
 * divides the enhancement value by the aspect count, so a Heal piece missing
 * Absorb counts as 1 aspect and over-values Heal.
 *
 * Therefore, for every non-proc IO-set piece:
 *   - 'Heal' ⟺ 'Absorb'  (both present or neither)
 *   - when both present, 'Absorb' sits immediately after 'Heal' (so names read
 *     "Heal/Absorb", "Endurance/Heal/Absorb", "Heal/Absorb/Recharge", …)
 *
 * Guards BOTH the hand-curated data and the Rebirth generator
 * (scripts/extract-rebirth-io-sets-v2.py ATTRIB_TO_ASPECT / canonical order)
 * against silently dropping Absorb on a regen.
 */
type Piece = { name: string; aspects: string[] };
type Registry = Record<string, { pieces?: Piece[] }>;

function findOffenders(label: string, registry: Registry): string[] {
  const offenders: string[] = [];
  for (const [setId, set] of Object.entries(registry)) {
    for (const piece of set.pieces ?? []) {
      const a = piece.aspects ?? [];
      const heal = a.indexOf('Heal');
      const absorb = a.indexOf('Absorb');
      const hasHeal = heal !== -1;
      const hasAbsorb = absorb !== -1;
      if (hasHeal !== hasAbsorb) {
        offenders.push(`${label}/${setId} "${piece.name}": Heal⟺Absorb violated — ${JSON.stringify(a)}`);
      } else if (hasHeal && hasAbsorb && absorb !== heal + 1) {
        offenders.push(`${label}/${setId} "${piece.name}": Absorb not immediately after Heal — ${JSON.stringify(a)}`);
      }
    }
  }
  return offenders;
}

describe('IO-set Heal/Absorb aspect invariant', () => {
  it('homecoming: every Heal piece also boosts Absorb (adjacent)', () => {
    expect(findOffenders('hc', HC_SETS as unknown as Registry)).toEqual([]);
  });

  it('rebirth: every Heal piece also boosts Absorb (adjacent)', () => {
    expect(findOffenders('rebirth', RB_SETS as unknown as Registry)).toEqual([]);
  });

  it('sanity: at least one Heal/Absorb piece exists in each dataset (the check has teeth)', () => {
    const healPieces = (reg: Registry) =>
      Object.values(reg).flatMap((s) => s.pieces ?? []).filter((p) => (p.aspects ?? []).includes('Heal'));
    expect(healPieces(HC_SETS as unknown as Registry).length).toBeGreaterThan(0);
    expect(healPieces(RB_SETS as unknown as Registry).length).toBeGreaterThan(0);
  });
});
