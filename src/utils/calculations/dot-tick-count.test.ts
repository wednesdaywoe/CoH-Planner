import { describe, it, expect } from 'vitest';
import { dotTickCount } from './damage';

/**
 * DoT tick count fires at t = 0, period, 2·period, …, duration — so it's
 * `duration / period + 1`. The bin stores periods as float32, so a 0.2s tick
 * round-trips as 0.20000000298; `2 / 0.20000000298 = 9.9999998`, which a bare
 * Math.floor truncates to 9 → 10 ticks instead of 11. Freeze Ray (2s @ 0.2s)
 * was the reported regression. dotTickCount adds an epsilon to absorb that.
 */
describe('dotTickCount', () => {
  it('Freeze Ray (2s @ float32-noisy 0.2s) is 11 ticks, not 10', () => {
    expect(dotTickCount(2, 0.20000000298023224)).toBe(11);
  });

  it('counts the t=0 tick for clean ratios', () => {
    expect(dotTickCount(10, 1)).toBe(11);
    expect(dotTickCount(2, 0.5)).toBe(5);
    expect(dotTickCount(3, 0.25)).toBe(13);
  });

  it('does not over-count a genuinely fractional ratio', () => {
    // 2.4s @ 1s → ticks at 0, 1, 2 = 3 (the 0.4 remainder adds no tick).
    expect(dotTickCount(2.4, 1)).toBe(3);
  });

  it('guards against a zero / missing period', () => {
    expect(dotTickCount(2, 0)).toBe(1);
    expect(dotTickCount(2, -1)).toBe(1);
  });
});
