/**
 * Leveling schedule — AUTO-GENERATED, DO NOT EDIT.
 *
 * Derived from the committed binary export (leveling_schedule.json =
 * schedules.bin, plus per-power FreeBoostSlotsOnPower overrides) by
 * scripts/convert-leveling-schedule.cjs (WS17). Levels are 1-based;
 * grant counts follow power_system.c CountForLevel semantics.
 *
 * Regenerate: node scripts/convert-leveling-schedule.cjs --dataset homecoming
 */

export interface LevelingScheduleData {
  dataset: string;
  /** Power picks granted at each 1-based level (level 1 grants 2: primary + secondary). */
  powerPicks: Readonly<Record<number, number>>;
  /** Total power picks by level 50. */
  maxPowerPicks: number;
  /** Placeable enhancement slots granted at each 1-based level. */
  slotGrants: Readonly<Record<number, number>>;
  /** Total placeable slots by level 50. */
  totalSlots: number;
  /** 1-based level of the first pool-powerset pick. */
  poolUnlockLevel: number;
  /** Total pool-powerset picks — the power-pool cap. */
  maxPowerPools: number;
  /** 1-based level of the first epic-powerset pick. */
  epicPoolLevel: number;
  /**
   * 1-based levels at which the named power receives auto-granted bonus
   * slots (per-power FreeBoostSlotsOnPower override, outside the
   * totalSlots user budget). The offset-0 base slot is excluded — the
   * planner models it on every power pick already.
   */
  autoGrantedSlotLevels: Readonly<Record<string, readonly number[]>>;
}

export const LEVELING_SCHEDULE: LevelingScheduleData = {
  dataset: 'homecoming',
  powerPicks: {
    1: 2,
    2: 1,
    4: 1,
    6: 1,
    8: 1,
    10: 1,
    12: 1,
    14: 1,
    16: 1,
    18: 1,
    20: 1,
    22: 1,
    24: 1,
    26: 1,
    28: 1,
    30: 1,
    32: 1,
    35: 1,
    38: 1,
    41: 1,
    44: 1,
    47: 1,
    49: 1,
  },
  maxPowerPicks: 24,
  slotGrants: {
    3: 2,
    5: 2,
    7: 2,
    9: 2,
    11: 2,
    13: 2,
    15: 2,
    17: 2,
    19: 2,
    21: 2,
    23: 2,
    25: 2,
    27: 2,
    29: 2,
    31: 3,
    33: 3,
    34: 3,
    36: 3,
    37: 3,
    39: 3,
    40: 3,
    42: 3,
    43: 3,
    45: 3,
    46: 3,
    48: 3,
    50: 3,
  },
  totalSlots: 67,
  poolUnlockLevel: 4,
  maxPowerPools: 4,
  epicPoolLevel: 35,
  autoGrantedSlotLevels: {},
};
