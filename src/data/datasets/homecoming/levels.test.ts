import { describe, it, expect } from 'vitest';
import {
  getTotalSlotsAtLevel,
  getSlotsGrantedAtLevel,
  getSlotGrants,
  getMaxPowerPools,
} from './levels';

/**
 * Enhancement slot budget by server. Every server shares the 67-slot schedule
 * EXCEPT Thunderspy, which grants one extra placeable slot at L9, L23, L29 (2→3)
 * and L43 (3→4) — 71 total at L50 (player-confirmed schedule, 2026-06-16). The
 * slot functions take an optional serverId so the budget/progression math
 * tracks the build's server; omitting it (or any non-Thunderspy id) yields the
 * shared 67-slot schedule.
 */
describe('slot grant schedule by server', () => {
  it('defaults to the shared 67-slot schedule', () => {
    expect(getTotalSlotsAtLevel(50)).toBe(67);
    expect(getTotalSlotsAtLevel(50, 'homecoming')).toBe(67);
    expect(getTotalSlotsAtLevel(50, 'rebirth')).toBe(67);
  });

  it('Thunderspy grants 71 slots at level 50', () => {
    expect(getTotalSlotsAtLevel(50, 'thunderspy')).toBe(71);
  });

  it('Thunderspy diverges only at L9, L23, L29 (2→3) and L43 (3→4)', () => {
    for (const lvl of [9, 23, 29]) {
      expect(getSlotsGrantedAtLevel(lvl)).toBe(2);
      expect(getSlotsGrantedAtLevel(lvl, 'thunderspy')).toBe(3);
    }
    expect(getSlotsGrantedAtLevel(43)).toBe(3);
    expect(getSlotsGrantedAtLevel(43, 'thunderspy')).toBe(4);
  });

  it('every other level matches the shared schedule on Thunderspy', () => {
    const shared = getSlotGrants();
    const ts = getSlotGrants('thunderspy');
    const diffLevels = new Set([9, 23, 29, 43]);
    const allLevels = new Set([...Object.keys(shared), ...Object.keys(ts)].map(Number));
    for (const lvl of allLevels) {
      if (diffLevels.has(lvl)) continue;
      expect(ts[lvl] ?? 0).toBe(shared[lvl] ?? 0);
    }
  });

  it('the cumulative budget never lags the shared schedule and ends +4', () => {
    let maxGap = 0;
    for (let lvl = 1; lvl <= 50; lvl++) {
      const gap = getTotalSlotsAtLevel(lvl, 'thunderspy') - getTotalSlotsAtLevel(lvl);
      expect(gap).toBeGreaterThanOrEqual(0);
      maxGap = Math.max(maxGap, gap);
    }
    expect(maxGap).toBe(4);
  });
});

/**
 * Power-pool cap by server. Every server allows 4 pools EXCEPT Thunderspy,
 * which allows 5. Omitting serverId (or any non-Thunderspy id) yields the
 * shared cap of 4.
 */
describe('max power pools by server', () => {
  it('defaults to 4 pools on the shared schedule', () => {
    expect(getMaxPowerPools()).toBe(4);
    expect(getMaxPowerPools('homecoming')).toBe(4);
    expect(getMaxPowerPools('rebirth')).toBe(4);
  });

  it('Thunderspy allows 5 pools', () => {
    expect(getMaxPowerPools('thunderspy')).toBe(5);
  });
});
