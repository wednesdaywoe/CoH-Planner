import { describe, it, expect } from 'vitest';
import { IO_SETS_RAW as HC_SETS } from '@/data/datasets/homecoming/io-sets-raw';
import { IO_SETS_RAW as RB_SETS } from '@/data/datasets/rebirth/io-sets-raw';

/**
 * Heal/Absorb enhancement-aspect invariant.
 *
 * In CoH every Heal-boosting enhancement also boosts Absorb — they share one
 * enhancement category, and the binary encodes Absorb as its OWN Strength
 * attrib on healing pieces (verified against boostsets.bin: Panacea/Numina/etc.
 * each carry HitPoints AND a distinct Absorb attrib). We therefore list Absorb
 * as its own aspect so it surfaces as a distinct enhanced stat on the piece.
 *
 * NOTE — Absorb does NOT dilute the per-aspect value. Heal and Absorb are the
 * SAME enhancement category (one boost applied to two attributes), so they
 * occupy a single slot in the multi-aspect scheduling penalty. A pure Heal
 * piece is genuinely 1 aspect (42.4% @ L50), and "Heal/Absorb/Recharge" is a
 * 2-aspect piece (26.5%), not 3. `getEffectiveAspectCount` collapses the pair;
 * see enhancement-values.heal-absorb.test.ts. (An earlier fix — 6574dfcc9 —
 * mistakenly read "Absorb is its own binary attrib" as "Absorb is a separate
 * value-diluting aspect"; the over-dilution went uncaught because the change
 * was never checked against the known in-game enhancement percentages.)
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
