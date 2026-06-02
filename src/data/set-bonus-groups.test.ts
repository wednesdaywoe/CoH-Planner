import { describe, it, expect } from 'vitest';
import { STAT_GROUP_INFO, SET_BONUS_GROUP_ORDER } from './set-bonus-groups';
import { STAT_NAME_MAP } from '@/utils/calculations/set-bonuses';

/**
 * The Set Bonus Totals popup groups bonuses by their NORMALIZED stat name
 * (the value side of STAT_NAME_MAP). Any normalized stat the engine can emit
 * must have a STAT_GROUP_INFO entry, or it silently lands in "Misc" — the exact
 * bug that dumped every defense/resistance bonus into "Other".
 */
describe('Set bonus group coverage', () => {
  // Normalized values that aren't real bonus stats and never reach the popup.
  const NON_BONUS = new Set(['io-set']);

  it('every normalized set-bonus stat has a group + label', () => {
    const normalized = new Set(
      Object.values(STAT_NAME_MAP).filter((v): v is string => !!v && !NON_BONUS.has(v))
    );
    const uncategorized = [...normalized].filter((stat) => !STAT_GROUP_INFO[stat]);
    expect(uncategorized).toEqual([]);
  });

  it('every group is listed in the display order', () => {
    const order = new Set(SET_BONUS_GROUP_ORDER);
    const missing = Object.values(STAT_GROUP_INFO)
      .map((i) => i.group)
      .filter((g) => !order.has(g));
    expect([...new Set(missing)]).toEqual([]);
  });

  it('paired defense/resistance stats share a label so they dedupe to one row', () => {
    // E/N, F/C, S/L pairs must collapse to a single row per group.
    expect(STAT_GROUP_INFO.defEnergy.label).toBe(STAT_GROUP_INFO.defNegative.label);
    expect(STAT_GROUP_INFO.defFire.label).toBe(STAT_GROUP_INFO.defCold.label);
    expect(STAT_GROUP_INFO.resSmashing.label).toBe(STAT_GROUP_INFO.resLethal.label);
  });
});
