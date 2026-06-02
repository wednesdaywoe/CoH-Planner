import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import { countPlacedBudgetSlots } from './slot-levels';

/**
 * The "/67" slot counter must not count auto-granted freebie slots. On Rebirth,
 * Health gets +2 and Stamina gets +2 outside the level-up budget (71 total
 * slots, 67 allocatable). Counting the freebies made the counter go red at
 * 68–71. Slots placed BEYOND the freebies still count.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pow = (internalName: string, slotCount: number): any => ({
  internalName, name: internalName, slots: Array(slotCount).fill(null),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeBuild(level: number, primary: any[], inherents: any[]): any {
  const b = createEmptyBuild() as any;
  b.level = level;
  b.primary.powers = primary;
  b.inherents = inherents;
  return b;
}

describe('countPlacedBudgetSlots — Rebirth (Health +2 / Stamina +2 freebies)', () => {
  beforeAll(async () => { await loadDataset('rebirth'); });

  it('excludes the 4 Health/Stamina freebies; counts other powers’ extras', () => {
    const b = makeBuild(50,
      [pow('Blast', 3)],                       // +2 budget slots (3 - 1 base)
      [pow('Health', 3), pow('Stamina', 3)],   // base + 2 freebies each → 0 budget
    );
    expect(countPlacedBudgetSlots(b)).toBe(2);
  });

  it('counts slots placed beyond the freebies (6-slotted Health = 3 budget)', () => {
    const b = makeBuild(50, [], [pow('Health', 6), pow('Stamina', 3)]);
    expect(countPlacedBudgetSlots(b)).toBe(3); // Health 6-1-2=3, Stamina 3-1-2=0
  });

  it('a 71-slot build reads 67 against the budget (the reported case)', () => {
    const b = makeBuild(50, [pow('Blast', 68)], [pow('Health', 3), pow('Stamina', 3)]);
    expect(countPlacedBudgetSlots(b)).toBe(67); // 68-1 budget + 0 + 0 freebies
  });

  it('honors the level schedule — only 1 Health freebie by level 10 (grants at 8,16)', () => {
    const b = makeBuild(10, [], [pow('Health', 2)]); // base + 1 freebie at L10
    expect(countPlacedBudgetSlots(b)).toBe(0);
  });
});

describe('countPlacedBudgetSlots — Homecoming (no auto-granted slots)', () => {
  beforeAll(async () => { await loadDataset('homecoming'); });

  it('Health/Stamina extras all count (HC grants no freebie slots)', () => {
    const b = makeBuild(50, [], [pow('Health', 3), pow('Stamina', 3)]);
    expect(countPlacedBudgetSlots(b)).toBe(4); // 3-1 + 3-1
  });
});
