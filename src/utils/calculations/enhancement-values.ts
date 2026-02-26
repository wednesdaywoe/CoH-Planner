/**
 * City of Heroes - Enhancement Value Calculation System
 *
 * Parses IO set piece values and calculates enhancement bonuses
 * with Enhancement Diversification (ED) applied
 */

import type { Enhancement, EnhancementStatType } from '@/types';

// ============================================
// ENHANCEMENT SCHEDULES
// ============================================

/**
 * Enhancement schedule types
 * Different aspects follow different value schedules
 */
export type EnhancementSchedule = 'A' | 'B' | 'C' | 'D';

/**
 * Map aspect types to ED schedules
 *
 * Schedule A (33.33% SO): Accuracy, Confusion, Damage, Defense Debuff, Endurance Modification,
 *   Endurance Reduction, Fear, Fly, Healing, Hold Duration, Immobilization Duration, Jumping,
 *   Recharge Time, Run Speed, Sleep, Slow, Stun, Taunt
 * Schedule B (20% SO): Defense Buff, Range Increase, Resist Damage, To Hit Buff, To Hit Debuff
 * Schedule C (40% SO): Interrupt Time
 * Schedule D (60% SO): Knockback Distance
 */
const ASPECT_SCHEDULE_MAP: Record<string, EnhancementSchedule> = {
  // Schedule A (33.33% SO)
  accuracy: 'A',
  confuse: 'A',
  damage: 'A',
  defenseDebuff: 'A',
  endurance: 'A',
  enduranceMod: 'A',
  fear: 'A',
  fly: 'A',
  heal: 'A',
  hold: 'A',
  immobilize: 'A',
  jump: 'A',
  recharge: 'A',
  run: 'A',
  sleep: 'A',
  slow: 'A',
  stun: 'A',
  taunt: 'A',

  // Schedule B (20% SO)
  defense: 'B',
  defenseBuff: 'B',
  range: 'B',
  resistance: 'B',
  tohit: 'B',
  tohitBuff: 'B',
  tohitDebuff: 'B',

  // Schedule C (40% SO)
  interrupt: 'C',

  // Schedule D (60% SO)
  knockback: 'D',
};

/**
 * Get the enhancement schedule for a given aspect
 */
export function getAspectSchedule(normalizedAspect: string): EnhancementSchedule {
  return ASPECT_SCHEDULE_MAP[normalizedAspect] || 'A';
}

// ============================================
// IO EFFECTIVENESS BY LEVEL
// ============================================

/**
 * IO enhancement values by level for each schedule
 * Based on Maths.txt "Level-Based IO Effectiveness" table
 */
const IO_EFFECTIVENESS: Record<EnhancementSchedule, Record<number, number>> = {
  A: {
    10: 0.117,
    15: 0.192,
    20: 0.256,
    25: 0.32,
    30: 0.348,
    35: 0.367,
    40: 0.386,
    45: 0.405,
    50: 0.424,
    53: 0.435,
  },
  B: {
    10: 0.07,
    15: 0.115,
    20: 0.154,
    25: 0.192,
    30: 0.209,
    35: 0.22,
    40: 0.232,
    45: 0.243,
    50: 0.255,
    53: 0.261,
  },
  C: {
    10: 0.14,
    15: 0.231,
    20: 0.308,
    25: 0.385,
    30: 0.418,
    35: 0.441,
    40: 0.464,
    45: 0.486,
    50: 0.509,
    53: 0.523,
  },
  D: {
    10: 0.21,
    15: 0.346,
    20: 0.462,
    25: 0.577,
    30: 0.627,
    35: 0.661,
    40: 0.695,
    45: 0.73,
    50: 0.764,
    53: 0.784,
  },
};

/**
 * Get IO enhancement value at a specific level for a given schedule
 */
export function getIOValueAtLevel(level: number, schedule: EnhancementSchedule = 'A'): number {
  const clampedLevel = Math.max(10, Math.min(53, level));
  const ioValues = IO_EFFECTIVENESS[schedule];

  // If exact level exists, return it
  if (ioValues[clampedLevel]) {
    return ioValues[clampedLevel];
  }

  // Otherwise interpolate between levels
  const levels = [10, 15, 20, 25, 30, 35, 40, 45, 50, 53];
  let lowerLevel = levels[0];
  let upperLevel = levels[1];

  for (let i = 0; i < levels.length - 1; i++) {
    if (levels[i] <= clampedLevel && levels[i + 1] > clampedLevel) {
      lowerLevel = levels[i];
      upperLevel = levels[i + 1];
      break;
    }
  }

  const ratio = (clampedLevel - lowerLevel) / (upperLevel - lowerLevel);
  return ioValues[lowerLevel] + (ioValues[upperLevel] - ioValues[lowerLevel]) * ratio;
}

// ============================================
// ASPECT NAME NORMALIZATION
// ============================================

/**
 * Map of aspect names to normalized internal keys
 */
const ASPECT_NAME_MAP: Record<string, string> = {
  // Abbreviations
  Acc: 'accuracy',
  Dmg: 'damage',
  Dam: 'damage',
  Rech: 'recharge',
  EndRdx: 'endurance',
  EndMod: 'enduranceMod',
  Range: 'range',
  Heal: 'heal',
  Def: 'defense',
  Res: 'resistance',
  ToHit: 'tohit',
  ToHitDeb: 'tohitDebuff',
  DefDeb: 'defenseDebuff',
  DefBuff: 'defenseBuff',
  Hold: 'hold',
  Stun: 'stun',
  Immob: 'immobilize',
  Sleep: 'sleep',
  Confuse: 'confuse',
  Fear: 'fear',
  KB: 'knockback',
  Slow: 'slow',

  // EnhancementStatType values (used by generic IOs, origin enhancements, and specials)
  EnduranceReduction: 'endurance',

  // Full names
  Accuracy: 'accuracy',
  Damage: 'damage',
  Recharge: 'recharge',
  Endurance: 'endurance',
  'End Reduction': 'endurance',
  'Endurance Discount': 'endurance',
  'Endurance Reduction': 'endurance',
  'Endurance Modification': 'enduranceMod',
  Healing: 'heal',
  Defense: 'defense',
  'Defense Buff': 'defenseBuff',
  'Defense Debuff': 'defenseDebuff',
  'Resist Damage': 'resistance',
  'Damage Resistance': 'resistance',
  Resistance: 'resistance',
  'ToHit Buff': 'tohit',
  'To Hit Buff': 'tohit',
  'ToHit Debuff': 'tohitDebuff',
  'To Hit Debuff': 'tohitDebuff',
  'Hold Duration': 'hold',
  'Stun Duration': 'stun',
  'Immobilization Duration': 'immobilize',
  'Sleep Duration': 'sleep',
  Confusion: 'confuse',
  'Confuse Duration': 'confuse',
  'Fear Duration': 'fear',
  Knockback: 'knockback',
  'Knockback Distance': 'knockback',
  Snare: 'slow',
  'Range Increase': 'range',
  Fly: 'fly',
  'Run Speed': 'run',
  Jumping: 'jump',
  Jump: 'jump',
  Taunt: 'taunt',
  'Interrupt Time': 'interrupt',
  'Activation Acceleration': 'interrupt',
};

/**
 * Normalize aspect names from IO pieces to internal keys
 */
export function normalizeAspectName(aspect: string): string | null {
  const trimmed = aspect.trim();
  return ASPECT_NAME_MAP[trimmed] || null;
}

// ============================================
// ENHANCEMENT DIVERSIFICATION
// ============================================

/**
 * ED thresholds by schedule
 */
const ED_THRESHOLDS: Record<EnhancementSchedule, { t1: number; t2: number; t3: number }> = {
  A: { t1: 0.7, t2: 0.9, t3: 1.0 },
  B: { t1: 0.4, t2: 0.5, t3: 0.6 },
  C: { t1: 0.8, t2: 1.0, t3: 1.2 },
  D: { t1: 1.2, t2: 1.5, t3: 1.8 },
};

/**
 * Apply Enhancement Diversification to a bonus value
 * ED reduces effectiveness of enhancements beyond certain thresholds
 *
 * The formula applies diminishing returns in 4 tiers:
 * - Tier 1 (0 to t1): 100% effective (no penalty)
 * - Tier 2 (t1 to t2): 90% effective
 * - Tier 3 (t2 to t3): 70% effective
 * - Tier 4 (beyond t3): 15% effective
 *
 * These values match Homecoming/i25+ game behavior (confirmed via Mids Reborn source).
 */
export function applyED(value: number, schedule: EnhancementSchedule = 'A'): number {
  const { t1, t2, t3 } = ED_THRESHOLDS[schedule];

  if (value <= t1) {
    // No penalty
    return value;
  } else if (value <= t2) {
    // Slight penalty (90% effective)
    return t1 + (value - t1) * 0.9;
  } else if (value <= t3) {
    // Moderate penalty (70% effective)
    const tier2 = t1 + (t2 - t1) * 0.9;
    return tier2 + (value - t2) * 0.7;
  } else {
    // Heavy penalty (15% effective)
    const tier2 = t1 + (t2 - t1) * 0.9;
    const tier3 = tier2 + (t3 - t2) * 0.7;
    return tier3 + (value - t3) * 0.15;
  }
}

// ============================================
// IO SET PIECE VALUE PARSING
// ============================================

export interface ParsedBonuses {
  [aspect: string]: number;
}

/**
 * Get the multi-aspect modifier for IO set pieces
 * Per Homecoming Wiki:
 * - 1 aspect: 100% of base value
 * - 2 aspects: 62.5% (5/8) of base value per aspect
 * - 3 aspects: 50% of base value per aspect
 * - 4 aspects: 43.75% of base value per aspect
 */
export function getMultiAspectModifier(aspectCount: number): number {
  switch (aspectCount) {
    case 1: return 1.0;
    case 2: return 0.625;  // 5/8
    case 3: return 0.5;
    case 4:
    default: return 0.4375;
  }
}

/**
 * Parse IO set piece aspects into enhancement bonuses
 */
export function parseIOSetPieceValues(aspects: string[], level = 50): ParsedBonuses {
  if (!aspects || !Array.isArray(aspects)) {
    return {};
  }

  const bonuses: ParsedBonuses = {};
  const modifier = getMultiAspectModifier(aspects.length);

  // Each aspect gets the schedule's value modified by aspect count
  aspects.forEach((aspect) => {
    const normalized = normalizeAspectName(aspect);
    if (normalized) {
      const schedule = getAspectSchedule(normalized);
      const baseValue = getIOValueAtLevel(level, schedule);
      bonuses[normalized] = baseValue * modifier;
    }
  });

  return bonuses;
}

// ============================================
// POWER ENHANCEMENT BONUS CALCULATION
// ============================================

export interface SlotWithEnhancement {
  enhancement: Enhancement | null;
  level?: number;
}

export interface PowerWithSlots {
  name: string;
  slots: (Enhancement | null)[];
}

export interface EnhancementBonuses {
  accuracy?: number;
  damage?: number;
  recharge?: number;
  endurance?: number;
  range?: number;
  heal?: number;
  defense?: number;
  resistance?: number;
  tohit?: number;
  tohitDebuff?: number;
  [key: string]: number | undefined;
}

/**
 * Calculate total enhancement bonuses from slotted enhancements
 * Applies Enhancement Diversification (ED) limits
 */
export function calculatePowerEnhancementBonuses(
  power: PowerWithSlots,
  globalIOLevel = 50,
  getIOSet?: (setId: string) => { pieces: Array<{ num: number; aspects?: string[] }>; maxLevel: number } | undefined
): EnhancementBonuses {
  if (!power?.slots) {
    return {};
  }

  const rawBonuses: Record<string, number> = {};

  // Accumulate bonuses from all slots
  power.slots.forEach((slot) => {
    if (!slot) return;

    // Boost multiplier: each boost level adds 5% to enhancement value
    const boostMultiplier = 1 + (slot.boost || 0) * 0.05;

    if (slot.type === 'io-set' && getIOSet) {
      // IO Set piece
      const set = getIOSet(slot.setId);
      if (!set) return;

      const piece = set.pieces.find((p) => p.num === slot.pieceNum);
      if (!piece?.aspects) return;

      const ioLevel = Math.min(globalIOLevel, set.maxLevel);
      const bonuses = parseIOSetPieceValues(piece.aspects, ioLevel);

      Object.entries(bonuses).forEach(([aspect, value]) => {
        rawBonuses[aspect] = (rawBonuses[aspect] || 0) + value * boostMultiplier;
      });
    } else if (slot.type === 'io-generic') {
      // Common IO
      const aspect = slot.stat as string;
      const normalized = normalizeAspectName(aspect);
      if (normalized) {
        const schedule = getAspectSchedule(normalized);
        const value = getIOValueAtLevel(slot.level || globalIOLevel, schedule);
        rawBonuses[normalized] = (rawBonuses[normalized] || 0) + value * boostMultiplier;
      }
    } else if (slot.type === 'special') {
      // Special enhancements (Hamidon, Titan, etc.) - each aspect has its own value
      if (slot.aspects) {
        slot.aspects.forEach((aspect: { stat: string; value: number }) => {
          const normalized = normalizeAspectName(aspect.stat);
          if (normalized) {
            rawBonuses[normalized] = (rawBonuses[normalized] || 0) + (aspect.value / 100) * boostMultiplier;
          }
        });
      }
    } else if (slot.type === 'origin') {
      // TO/DO/SO
      const aspect = slot.stat as string;
      const normalized = normalizeAspectName(aspect);
      if (normalized && slot.value) {
        rawBonuses[normalized] = (rawBonuses[normalized] || 0) + (slot.value / 100) * boostMultiplier;
      }
    }
  });

  // Apply Enhancement Diversification
  const edBonuses: EnhancementBonuses = {};
  Object.entries(rawBonuses).forEach(([aspect, rawValue]) => {
    const schedule = getAspectSchedule(aspect);
    edBonuses[aspect] = applyED(rawValue, schedule);
  });

  return edBonuses;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Calculate Common IO value by level
 */
export function calculateCommonIOValue(level: number, aspect: EnhancementStatType): number {
  const normalized = normalizeAspectName(aspect) || aspect.toLowerCase();
  const schedule = getAspectSchedule(normalized);
  return getIOValueAtLevel(level, schedule);
}

/**
 * Format enhancement value as percentage
 */
export function formatEnhancementValue(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
