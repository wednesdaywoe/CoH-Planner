import { describe, it, expect } from 'vitest';
import {
  getPPMAreaDenominator,
  getPPMAreaFactor,
  calculateProcChance,
} from './proc-data';

/**
 * Regression guard for the PPM area-factor formula.
 *
 * The AoE denominator is 0.25 + 0.75 × (1 + radius × (11 × arc + 540) / 30,000).
 * A prior bug used a 40,000 divisor (per-foot coefficient 0.1125 instead of the
 * game's 0.15), inflating AoE/cone proc chances — e.g. Blaze Mastery > Fire Ball
 * read 85% instead of 71.6%. The formula also lived in two places (this calc and
 * the power-info display) that drifted out of sync, so pin the numbers here.
 */
describe('PPM area factor', () => {
  it('single target (radius 0) has denominator 1.0 regardless of arc', () => {
    expect(getPPMAreaDenominator(0, 360)).toBe(1.0);
    expect(getPPMAreaDenominator(0, 30)).toBe(1.0);
    expect(getPPMAreaFactor(0)).toBe(1.0);
  });

  it('sphere uses a 0.15 per-foot coefficient: r15 → 2.6875', () => {
    // 0.25 + 0.75 × (1 + 0.15 × 15) = 2.6875
    expect(getPPMAreaDenominator(15, 360)).toBeCloseTo(2.6875, 6);
    expect(getPPMAreaFactor(15, 360)).toBeCloseTo(1 / 2.6875, 6);
  });

  it('cone scales the radius term down with arc: r40 arc30 → 1.87', () => {
    // 0.25 + 0.75 × (1 + 40 × (11×30 + 540) / 30000) = 1.87
    expect(getPPMAreaDenominator(40, 30)).toBeCloseTo(1.87, 6);
  });

  it('Fire Ball (3.5 PPM, 32s recharge, 1s cast, r15 sphere) → 71.6%', () => {
    // 3.5 × (32 + 1) / (60 × 2.6875) = 0.7163
    const chance = calculateProcChance(3.5, 32, 1, 15, 360);
    expect(chance).toBeCloseTo(0.716, 3);
  });
});
