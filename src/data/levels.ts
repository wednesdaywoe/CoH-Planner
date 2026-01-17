/**
 * Level Progression Data
 *
 * Defines all level-based unlocks and progression rules for City of Heroes.
 * This centralizes level requirements that were previously scattered across the codebase.
 */

// ============================================
// CONSTANTS
// ============================================

/** Maximum character level */
export const MAX_LEVEL = 50;

/** Level at which Epic/Patron pools become available */
export const EPIC_POOL_LEVEL = 35;

/** Maximum number of power pools that can be selected */
export const MAX_POWER_POOLS = 4;

/** Maximum number of enhancement slots per power */
export const MAX_SLOTS_PER_POWER = 6;

/** Total enhancement slots available at level 50 */
export const TOTAL_SLOTS_AT_50 = 67;

// ============================================
// POWER PICK LEVELS
// ============================================

/**
 * Levels at which new powers can be selected.
 * Players get a power pick at each of these levels.
 * Total: 24 power picks (including level 1)
 */
export const POWER_PICK_LEVELS: readonly number[] = [
  1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 35, 38, 41, 44, 47, 49, 50,
] as const;

/**
 * Check if a level grants a power pick
 */
export function isPowerPickLevel(level: number): boolean {
  return POWER_PICK_LEVELS.includes(level);
}

/**
 * Get the number of power picks available at a given level
 */
export function getPowerPicksAtLevel(level: number): number {
  return POWER_PICK_LEVELS.filter((l) => l <= level).length;
}

// ============================================
// SLOT GRANTS BY LEVEL
// ============================================

/**
 * Enhancement slot grants by level.
 * Key = level, Value = number of slots granted at that level.
 *
 * Level 1: 2 slots (first power gets 1 slot automatically, plus 1 additional)
 * Levels 2-21 (even): 2 slots each
 * Levels 22-50 (even): 3 slots each (except level 50 = 1 slot)
 */
export const SLOT_GRANTS: Readonly<Record<number, number>> = {
  1: 2,
  2: 2,
  4: 2,
  6: 2,
  8: 2,
  10: 2,
  12: 2,
  14: 2,
  16: 2,
  18: 2,
  20: 2,
  22: 3,
  24: 3,
  26: 3,
  28: 3,
  30: 3,
  32: 3,
  34: 3,
  36: 3,
  38: 3,
  40: 3,
  42: 3,
  44: 3,
  46: 3,
  48: 3,
  50: 1,
} as const;

/**
 * Get the number of slots granted at a specific level
 */
export function getSlotsGrantedAtLevel(level: number): number {
  return SLOT_GRANTS[level] ?? 0;
}

/**
 * Get the total number of enhancement slots available at a given level
 */
export function getTotalSlotsAtLevel(level: number): number {
  let total = 0;
  for (const [lvl, slots] of Object.entries(SLOT_GRANTS)) {
    if (parseInt(lvl) <= level) {
      total += slots;
    }
  }
  return total;
}

// ============================================
// ENHANCEMENT AVAILABILITY
// ============================================

/**
 * Enhancement type availability by level
 */
export const ENHANCEMENT_AVAILABILITY = {
  /** Training Origin enhancements - available from level 1 */
  TO: {
    minLevel: 1,
    maxLevel: 15, // Effectively useless after this
    description: 'Training Origin - Basic enhancements available at level 1',
  },
  /** Dual Origin enhancements - available from level 12 */
  DO: {
    minLevel: 12,
    maxLevel: 25, // Effectively replaced by SO
    description: 'Dual Origin - Available at level 12, stronger than TO',
  },
  /** Single Origin enhancements - available from level 22 */
  SO: {
    minLevel: 22,
    maxLevel: 50,
    description: 'Single Origin - Available at level 22, standard endgame enhancement',
  },
  /** Invention Origin (basic IOs) - available from level 10 */
  IO: {
    minLevel: 10,
    maxLevel: 50,
    description: 'Invention Origin - Craftable, never expire, available level 10+',
  },
  /** IO Sets - available from level 10 (varies by set) */
  IO_SET: {
    minLevel: 10,
    maxLevel: 50,
    description: 'IO Sets - Set bonuses, available level 10+ (varies by set)',
  },
  /** Purple Sets (Very Rare) - level 50 only */
  PURPLE: {
    minLevel: 50,
    maxLevel: 50,
    description: 'Purple Sets - Very Rare, level 50 only, can be attuned',
  },
  /** PvP Sets - various level ranges */
  PVP: {
    minLevel: 10,
    maxLevel: 50,
    description: 'PvP IO Sets - From PvP rewards',
  },
  /** Archetype Origin (ATO) - any level when attuned */
  ATO: {
    minLevel: 1, // When attuned
    maxLevel: 50,
    description: 'Archetype Origin - From Super Packs, scale when attuned',
  },
  /** Winter/Event Sets */
  WINTER: {
    minLevel: 1, // When attuned
    maxLevel: 50,
    description: 'Winter-O Sets - From Winter Event, scale when attuned',
  },
} as const;

/**
 * Check if an enhancement type is available at a given level
 */
export function isEnhancementAvailable(
  type: keyof typeof ENHANCEMENT_AVAILABILITY,
  level: number
): boolean {
  const info = ENHANCEMENT_AVAILABILITY[type];
  return level >= info.minLevel && level <= info.maxLevel;
}

// ============================================
// POOL POWER REQUIREMENTS
// ============================================

/**
 * Pool power tier requirements
 */
export const POOL_TIER_REQUIREMENTS = {
  /** Tier 1-2 powers: Available at level 1 (pool access level) */
  ENTRY: {
    minLevel: 1,
    requiredPowers: 0,
    description: 'First two powers in a pool, available immediately',
  },
  /** Tier 3 power: Requires level 4+ and 1 power from the pool */
  TIER_3: {
    minLevel: 4,
    requiredPowers: 1,
    description: 'Third power, requires 1 power from the pool',
  },
  /** Tier 4-5 powers: Requires level 14+ and 2 powers from the pool */
  TIER_4_5: {
    minLevel: 14,
    requiredPowers: 2,
    description: 'Fourth and fifth powers, require 2 powers from the pool',
  },
} as const;

// ============================================
// EPIC/PATRON POOLS
// ============================================

/**
 * Epic/Patron Ancillary Power Pools by archetype
 */
export const EPIC_POOLS: Readonly<Record<string, readonly string[]>> = {
  // Hero Archetypes - Epic Power Pools
  blaster: ['Cold Mastery', 'Electricity Mastery', 'Fire Mastery', 'Force Mastery', 'Munitions Mastery'],
  controller: ['Fire Mastery', 'Ice Mastery', 'Primal Forces Mastery', 'Psionic Mastery', 'Stone Mastery'],
  defender: ['Dark Mastery', 'Electricity Mastery', 'Power Mastery', 'Psionic Mastery'],
  scrapper: ['Body Mastery', 'Darkness Mastery', 'Weapon Mastery', 'Shield Mastery'],
  tanker: ['Energy Mastery', 'Pyre Mastery', 'Arctic Mastery', 'Earth Mastery'],

  // Villain Archetypes - Patron Power Pools
  brute: ['Mu Mastery', 'Soul Mastery', 'Mace Mastery', 'Leviathan Mastery'],
  corruptor: ['Mu Mastery', 'Soul Mastery', 'Mace Mastery', 'Leviathan Mastery'],
  dominator: ['Mu Mastery', 'Soul Mastery', 'Mace Mastery', 'Leviathan Mastery'],
  mastermind: ['Mu Mastery', 'Soul Mastery', 'Mace Mastery', 'Leviathan Mastery'],
  stalker: ['Mu Mastery', 'Soul Mastery', 'Mace Mastery', 'Leviathan Mastery'],

  // Praetorian/Neutral - Can choose Epic or Patron
  sentinel: ['Bio Mastery', 'Dark Mastery', 'Electricity Mastery', 'Ice Mastery', 'Ninja Mastery'],

  // Kheldian - No Epic pools (use inherent forms)
  peacebringer: [],
  warshade: [],

  // Soldiers of Arachnos - Special Epic pools
  arachnos_soldier: ['Mace Mastery', 'Mu Mastery', 'Soul Mastery', 'Leviathan Mastery'],
  arachnos_widow: ['Mu Mastery', 'Soul Mastery', 'Mace Mastery', 'Leviathan Mastery'],
} as const;

/**
 * Get available Epic/Patron pools for an archetype
 */
export function getEpicPools(archetypeId: string): readonly string[] {
  return EPIC_POOLS[archetypeId.toLowerCase()] ?? [];
}

/**
 * Check if a character can access Epic/Patron pools
 */
export function canAccessEpicPools(level: number): boolean {
  return level >= EPIC_POOL_LEVEL;
}

// ============================================
// INCARNATE SYSTEM
// ============================================

/** Level required to access Incarnate powers */
export const INCARNATE_LEVEL = 50;

/**
 * Incarnate slots and their unlock requirements
 */
export const INCARNATE_SLOTS = {
  Alpha: {
    order: 1,
    description: 'Level shift and stat boost',
    unlockMethod: 'Complete Menders of Ouroboros arc or Ramiel arc',
  },
  Judgment: {
    order: 2,
    description: 'Powerful AoE attack',
    unlockMethod: 'Unlock Alpha slot',
  },
  Interface: {
    order: 3,
    description: 'Proc effect on attacks',
    unlockMethod: 'Unlock Judgment slot',
  },
  Lore: {
    order: 4,
    description: 'Summon powerful pets',
    unlockMethod: 'Unlock Interface slot',
  },
  Destiny: {
    order: 5,
    description: 'Team-wide buff/debuff',
    unlockMethod: 'Unlock Lore slot',
  },
  Hybrid: {
    order: 6,
    description: 'Sustained personal buff',
    unlockMethod: 'Unlock all previous slots',
  },
  Genesis: {
    order: 7,
    description: 'Pet enhancement',
    unlockMethod: 'Unlock Hybrid slot',
  },
  Omega: {
    order: 8,
    description: 'Additional level shift',
    unlockMethod: 'Unlock Genesis slot',
  },
} as const;

// ============================================
// INHERENT POWERS
// ============================================

/**
 * Inherent powers that all characters receive automatically.
 * These include fitness powers (became inherent in Issue 19) and basic powers.
 */
export interface InherentPowerDef {
  name: string;
  fullName: string;
  description: string;
  icon: string;
  powerType: 'Auto' | 'Click';
  maxSlots: number;
  allowedEnhancements: string[];
  allowedSetCategories: string[];
}

/**
 * Inherent Fitness powers - all characters receive these at level 1
 */
export const INHERENT_FITNESS_POWERS: readonly InherentPowerDef[] = [
  {
    name: 'Swift',
    fullName: 'Inherent.Fitness.Swift',
    description: 'You can naturally run slightly faster than normal. This ability is always on and does not cost any Endurance.',
    icon: 'fitness_quick.png',
    powerType: 'Auto',
    maxSlots: 6,
    allowedEnhancements: ['Run Speed'],
    allowedSetCategories: ['Running'],
  },
  {
    name: 'Hurdle',
    fullName: 'Inherent.Fitness.Hurdle',
    description: 'You can naturally jump higher than normal. This ability is always on and does not cost any Endurance.',
    icon: 'fitness_hurdle.png',
    powerType: 'Auto',
    maxSlots: 6,
    allowedEnhancements: ['Jump'],
    allowedSetCategories: ['Leaping'],
  },
  {
    name: 'Health',
    fullName: 'Inherent.Fitness.Health',
    description: 'You heal slightly faster than a normal person. Your improved Health also grants you resistance to Sleep. This ability is always on and does not cost any Endurance.',
    icon: 'fitness_health.png',
    powerType: 'Auto',
    maxSlots: 6,
    allowedEnhancements: ['Heal'],
    allowedSetCategories: ['Healing'],
  },
  {
    name: 'Stamina',
    fullName: 'Inherent.Fitness.Stamina',
    description: 'You recover Endurance slightly more quickly than normal. This ability is always on and does not cost any Endurance.',
    icon: 'fitness_stamina.png',
    powerType: 'Auto',
    maxSlots: 6,
    allowedEnhancements: ['EnduranceModification'],
    allowedSetCategories: ['Endurance Modification'],
  },
] as const;

/**
 * Basic inherent powers - Brawl and Rest
 */
export const BASIC_INHERENT_POWERS: readonly InherentPowerDef[] = [
  {
    name: 'Brawl',
    fullName: 'Inherent.Brawl',
    description: 'When all else fails, use your fists. Brawl attacks deal minor smashing damage but have a very fast recharge.',
    icon: 'inherent_brawl.png',
    powerType: 'Click',
    maxSlots: 6,
    allowedEnhancements: ['Accuracy', 'Damage', 'Recharge', 'EnduranceReduction'],
    allowedSetCategories: ['Melee Damage'],
  },
  {
    name: 'Rest',
    fullName: 'Inherent.Rest',
    description: 'Rest to recover hit points and endurance. You are vulnerable while resting.',
    icon: 'inherent_rest.png',
    powerType: 'Click',
    maxSlots: 1,
    allowedEnhancements: ['Recharge'],
    allowedSetCategories: [],
  },
  {
    name: 'Sprint',
    fullName: 'Inherent.Sprint',
    description: 'You can Sprint at a faster than normal rate, but you are not as quick as characters with Super Speed.',
    icon: 'inherent_sprint.png',
    powerType: 'Click',
    maxSlots: 4,
    allowedEnhancements: ['Run Speed', 'EnduranceReduction'],
    allowedSetCategories: ['Running', 'Running & Sprints', 'Universal Travel'],
  },
] as const;

/**
 * Get all inherent powers that should be auto-granted at level 1
 */
export function getInherentPowers(): InherentPowerDef[] {
  return [...BASIC_INHERENT_POWERS, ...INHERENT_FITNESS_POWERS];
}

// ============================================
// LEVEL PROGRESSION SUMMARY
// ============================================

export interface LevelInfo {
  level: number;
  powerPick: boolean;
  slotsGranted: number;
  totalSlots: number;
  totalPowerPicks: number;
  enhancements: {
    TO: boolean;
    DO: boolean;
    SO: boolean;
    IO: boolean;
  };
  epicPoolAccess: boolean;
  incarnateAccess: boolean;
}

/**
 * Get complete progression info for a specific level
 */
export function getLevelInfo(level: number): LevelInfo {
  return {
    level,
    powerPick: isPowerPickLevel(level),
    slotsGranted: getSlotsGrantedAtLevel(level),
    totalSlots: getTotalSlotsAtLevel(level),
    totalPowerPicks: getPowerPicksAtLevel(level),
    enhancements: {
      TO: isEnhancementAvailable('TO', level),
      DO: isEnhancementAvailable('DO', level),
      SO: isEnhancementAvailable('SO', level),
      IO: isEnhancementAvailable('IO', level),
    },
    epicPoolAccess: canAccessEpicPools(level),
    incarnateAccess: level >= INCARNATE_LEVEL,
  };
}

/**
 * Generate full level progression table (levels 1-50)
 */
export function generateProgressionTable(): LevelInfo[] {
  const table: LevelInfo[] = [];
  for (let level = 1; level <= MAX_LEVEL; level++) {
    table.push(getLevelInfo(level));
  }
  return table;
}
