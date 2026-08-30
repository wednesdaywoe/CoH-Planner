/**
 * useBuildBudget — level-scoped power-pick and enhancement-slot budget for the
 * current build. Single source of truth shared by the dashboard counters and
 * the mobile build bar.
 *
 * Budgets track what `build.level` has granted so far (a level-32 character
 * hasn't earned the full 24 picks / 67 slots yet); both reach their level-50
 * max. Counts exclude auto-granted form sub-powers and each power's free base
 * slot / auto-granted freebie slots.
 */

import { useBuildStore } from '@/stores';
import { getPowerPicksAtLevel, getTotalSlotsAtLevel } from '@/data';
import { countPlacedBudgetSlots } from '@/utils/slot-levels';
import { countBudgetPowerPicks } from '@/utils/build-budget';

export interface BuildBudget {
  /** Manually-picked powers consuming the level-up budget. */
  currentPowerCount: number;
  /** Power picks granted by the current level. */
  powerBudget: number;
  /** Picks still available (never negative). */
  powerRemaining: number;
  /** Slots placed against the level-up budget (excludes free base slots). */
  currentSlotCount: number;
  /** Slots granted by the current level. */
  slotBudget: number;
  /** Slots still available (never negative). */
  slotRemaining: number;
}

export function useBuildBudget(): BuildBudget {
  const build = useBuildStore((s) => s.build);

  const currentPowerCount = countBudgetPowerPicks(build);
  const currentSlotCount = countPlacedBudgetSlots(build);
  const powerBudget = getPowerPicksAtLevel(build.level);
  const slotBudget = getTotalSlotsAtLevel(build.level, build.serverId);

  return {
    currentPowerCount,
    powerBudget,
    powerRemaining: Math.max(0, powerBudget - currentPowerCount),
    currentSlotCount,
    slotBudget,
    slotRemaining: Math.max(0, slotBudget - currentSlotCount),
  };
}
