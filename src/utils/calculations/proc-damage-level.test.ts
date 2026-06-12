import { describe, it, expect } from 'vitest';
import { calculateSlottedProcDamagePerCast } from './power-proc-damage';

/**
 * Damage procs scale with the CHARACTER's (combat) level, NOT the slotted IO's
 * crafted level — a level-21 and a level-50 Touch of Lady Grey deal identical
 * damage on a level-50 character (the well-known "slot the cheapest proc" rule).
 * The IO level governs enhancement *values* and exemplar floor, never the proc
 * payload. interpolateProcDamage clamps to the proc's own levelRange.
 *
 * Regression for @Redlynne's 2026-06-12 report: with a low "Global IO Level"
 * the planner interpolated proc damage at the crafted level (~7) instead of the
 * character level (~72) — a ~10× under-count that cascaded into attack DPS.
 *
 * Touch of Lady Grey: Chance for Negative Energy Damage — value 7 (range floor,
 * L21) .. valueMax 72 (L50), levelRange "21--50", ppm 3.5.
 */
function procSlot(level: number, attuned = false): any {
  return {
    type: 'io-set', isProc: true,
    name: 'Chance for Negative Energy Damage',
    setName: 'Touch of Lady Grey',
    setId: 'touch-of-lady-grey', pieceNum: 1,
    level, attuned,
  };
}

function perCast(slot: any, buildLevel: number): number {
  // Fixed chance inputs (single-target) — proc chance is level-independent, so
  // any difference between calls is purely the damage interpolation level.
  return calculateSlottedProcDamagePerCast({
    slots: [slot], baseRecharge: 8, castTime: 1, radius: 0, arcDegrees: 360,
    rechargeEnh: 0, buildLevel,
  });
}

describe('proc damage uses CHARACTER level, not crafted IO level', () => {
  it('crafted IO level does NOT change proc damage (L21 vs L50 proc on a L50 char → identical)', () => {
    const craftedLow = perCast(procSlot(21), 50);
    const craftedHigh = perCast(procSlot(50), 50);
    expect(craftedLow).toBeGreaterThan(0);
    expect(craftedLow).toBeCloseTo(craftedHigh, 6);
  });

  it('CHARACTER level drives proc damage (~10× from L21 floor to L50 ceiling)', () => {
    const charL50 = perCast(procSlot(21), 50);
    const charL21 = perCast(procSlot(21), 21);
    expect(charL50).toBeGreaterThan(charL21);
    // 72 / 7 ≈ 10.3× at the levelRange extremes (chance cancels — same inputs).
    expect(charL50 / charL21).toBeGreaterThan(8);
  });

  it('attuned and non-attuned procs deal the same damage at the same character level', () => {
    const fixed = perCast(procSlot(50, false), 50);
    const attuned = perCast(procSlot(50, true), 50);
    expect(fixed).toBeCloseTo(attuned, 6);
  });
});
