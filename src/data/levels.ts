/**
 * Level Progression Data
 *
 * Defines all level-based unlocks and progression rules for City of Heroes.
 * This centralizes level requirements that were previously scattered across the codebase.
 */

import type { Power } from '@/types';

// ============================================
// CONSTANTS
// ============================================

/** Maximum character level */
export const MAX_LEVEL = 50;

/** Level at which Epic/Patron pools become available */
export const EPIC_POOL_LEVEL = 35;

/** Level at which regular Power Pools become available */
export const POOL_UNLOCK_LEVEL = 4;

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
 * Total: 24 power picks (level 1 grants 2 picks: primary + secondary)
 */
export const POWER_PICK_LEVELS: readonly number[] = [
  1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 35, 38, 41, 44, 47, 49,
] as const;

/** Maximum selectable powers (23 pick levels, with level 1 granting 2 picks) */
export const MAX_POWER_PICKS = POWER_PICK_LEVELS.length + 1; // 24

/**
 * Check if a level grants a power pick
 */
export function isPowerPickLevel(level: number): boolean {
  return POWER_PICK_LEVELS.includes(level);
}

/**
 * Get the number of power picks available at a given level.
 * Level 1 grants 2 picks (primary + secondary) but is a single entry in
 * POWER_PICK_LEVELS, so we add 1 to account for the bonus pick.
 */
export function getPowerPicksAtLevel(level: number): number {
  const entries = POWER_PICK_LEVELS.filter((l) => l <= level).length;
  return level >= 1 ? entries + 1 : entries;
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
 * Levels 22-50 (even): 3 slots each
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
  50: 3,
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
 * Note: Pool access itself requires level 4 (POOL_UNLOCK_LEVEL)
 */
export const POOL_TIER_REQUIREMENTS = {
  /** Tier 1-2 powers: Available at pool unlock level (level 4) */
  ENTRY: {
    minLevel: 4,
    requiredPowers: 0,
    description: 'First two powers in a pool, available at pool unlock',
  },
  /** Tier 3 power: Requires level 14+ and 1 power from the pool */
  TIER_3: {
    minLevel: 14,
    requiredPowers: 1,
    description: 'Third power, requires level 14 and 1 power from the pool',
  },
  /** Tier 4-5 powers: Requires level 14+ and 2 powers from the pool */
  TIER_4_5: {
    minLevel: 14,
    requiredPowers: 2,
    description: 'Fourth and fifth powers, require level 14 and 2 powers from the pool',
  },
} as const;

/**
 * Travel powers that are available at level 4 despite being rank 3 powers
 * These powers have available=4 in the data but require no prerequisites
 */
export const EARLY_TRAVEL_POWERS: readonly string[] = [
  'Super Speed',
  'Fly',
  'Teleport',
  'Super Jump',
  'Infiltration',
  'Speed of Sound',
  'Mystic Flight',
] as const;

/**
 * Epic/Patron pool power tier requirements
 * Epic pools unlock at level 35 (EPIC_POOL_LEVEL)
 */
export const EPIC_TIER_REQUIREMENTS = {
  /** Powers 1-2: Available at level 35 */
  TIER_1_2: {
    minLevel: 35,
    requiredPowers: 0,
    description: 'First two powers, available at epic pool unlock',
  },
  /** Power 3: Requires level 38+ and 1 power from the pool */
  TIER_3: {
    minLevel: 38,
    requiredPowers: 1,
    description: 'Third power, requires level 38 and 1 power from the pool',
  },
  /** Power 4: Requires level 41+ and 1 power from the pool */
  TIER_4: {
    minLevel: 41,
    requiredPowers: 1,
    description: 'Fourth power, requires level 41 and 1 power from the pool',
  },
  /** Power 5: Requires level 44+ and 2 powers from the pool */
  TIER_5: {
    minLevel: 44,
    requiredPowers: 2,
    description: 'Fifth power, requires level 44 and 2 powers from the pool',
  },
} as const;

// ============================================
// EPIC/PATRON POOLS
// ============================================

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
export interface InherentPowerDef extends Power {
  /** If true, this power cannot be removed by the user */
  isLocked?: boolean;
  /** Category for grouping (fitness, basic, prestige, archetype) */
  category?: 'fitness' | 'basic' | 'prestige' | 'archetype';
}

/**
 * Inherent Fitness powers - all characters receive these at level 1
 */
export const INHERENT_FITNESS_POWERS: InherentPowerDef[] = [
  {
    name: 'Swift',
    fullName: 'Inherent.Fitness.Swift',
    description: 'You can naturally run slightly faster than normal. This ability is always on and does not cost any Endurance.',
    shortHelp: 'Auto: Self +Speed',
    icon: 'fitness_quick.png',
    powerType: 'Auto',
    available: -1,
    maxSlots: 6,
    allowedEnhancements: ['Run Speed', 'Fly'],
    allowedSetCategories: ['Running', 'Flight'],
    isLocked: true,
    category: 'fitness',
    effects: {
      runSpeed: { scale: 0.1, table: 'Melee_SpeedRunning' },
      flySpeed: { scale: 0.1, table: 'Melee_SpeedFlying' },
    },
  },
  {
    name: 'Hurdle',
    fullName: 'Inherent.Fitness.Hurdle',
    description: 'You can naturally jump higher than normal. This ability is always on and does not cost any Endurance.',
    shortHelp: 'Auto: Self +Jump',
    icon: 'fitness_hurdle.png',
    powerType: 'Auto',
    available: -1,
    maxSlots: 6,
    allowedEnhancements: ['Jump'],
    allowedSetCategories: ['Leaping'],
    isLocked: true,
    category: 'fitness',
    effects: {
      jumpHeight: { scale: 0.06, table: 'Melee_Leap' },
      jumpSpeed: { scale: 0.5, table: 'Melee_SpeedJumping' },
    },
  },
  {
    name: 'Health',
    fullName: 'Inherent.Fitness.Health',
    description: 'You heal slightly faster than a normal person. Your improved Health also grants you resistance to Sleep. This ability is always on and does not cost any Endurance.',
    shortHelp: 'Auto: Self +Regeneration, Res(Sleep)',
    icon: 'fitness_health.png',
    powerType: 'Auto',
    available: -1,
    maxSlots: 6,
    allowedEnhancements: ['Healing'],
    allowedSetCategories: ['Healing'],
    isLocked: true,
    category: 'fitness',
    effects: {
      regenBuff: { scale: 0.4, table: 'Melee_Ones' },
    },
  },
  {
    name: 'Stamina',
    fullName: 'Inherent.Fitness.Stamina',
    description: 'You recover Endurance slightly more quickly than normal. This ability is always on and does not cost any Endurance.',
    shortHelp: 'Auto: Self +Recovery',
    icon: 'fitness_stamina.png',
    powerType: 'Auto',
    available: -1,
    maxSlots: 6,
    allowedEnhancements: ['EnduranceModification'],
    allowedSetCategories: ['Endurance Modification'],
    isLocked: true,
    category: 'fitness',
    effects: {
      recoveryBuff: { scale: 0.25, table: 'Melee_Ones' },
    },
  },
];

/**
 * Basic inherent powers - Brawl, Rest, and Sprint
 */
export const BASIC_INHERENT_POWERS: InherentPowerDef[] = [
  {
    name: 'Brawl',
    fullName: 'Inherent.Brawl',
    description: 'When all else fails, use your fists. Brawl attacks deal minor smashing damage but have a very fast recharge.',
    shortHelp: 'Melee, DMG(Smashing)',
    icon: 'inherent_brawl.png',
    powerType: 'Click',
    targetType: 'Foe',
    effectArea: 'SingleTarget',
    available: -1,
    maxSlots: 6,
    allowedEnhancements: ['Accuracy', 'Damage', 'Recharge', 'EnduranceReduction'],
    allowedSetCategories: ['Melee Damage'],
    isLocked: true,
    category: 'basic',
    stats: {
      accuracy: 1,
      range: 7,
      recharge: 4,
      endurance: 5.2,
      castTime: 1.0,
    },
    damage: [
      { type: 'Smashing', scale: 0.6267, table: 'Melee_Damage' },
    ],
  },
  {
    name: 'Rest',
    fullName: 'Inherent.Rest',
    description: 'Rest to recover hit points and endurance. You are vulnerable while resting.',
    shortHelp: 'Self +Regen, +Recovery',
    icon: 'inherent_rest.png',
    powerType: 'Click',
    targetType: 'Self',
    available: -1,
    maxSlots: 4,
    allowedEnhancements: ['Interrupt', 'Healing', 'EnduranceModification'],
    allowedSetCategories: [],
    isLocked: true,
    category: 'basic',
    stats: {
      recharge: 300,
      castTime: 2.0,
    },
    effects: {
      recharge: 300,
      castTime: 2.0,
      regenBuff: { scale: 4.0, table: 'Melee_Ones' },
      recoveryBuff: { scale: 4.0, table: 'Melee_Ones' },
      buffDuration: 30,
    },
  },
  {
    name: 'Sprint',
    fullName: 'Inherent.Sprint',
    description: 'You can Sprint at a faster than normal rate, but you are not as quick as characters with Super Speed.',
    shortHelp: 'Toggle: Self +Speed',
    icon: 'inherent_sprint.png',
    powerType: 'Toggle',
    available: -1,
    maxSlots: 4,
    allowedEnhancements: ['Run Speed', 'EnduranceReduction', 'Jump'],
    allowedSetCategories: ['Running & Sprints', 'Leaping & Sprints'],
    isLocked: true,
    category: 'basic',
    effects: {
      enduranceCost: 0.13,
      runSpeed: { scale: 0.5, table: 'Melee_SpeedRunning' },
    },
  },
];

/**
 * Prestige Sprint powers - travel powers available to all characters
 */
export const PRESTIGE_SPRINT_POWERS: InherentPowerDef[] = [
  {
    name: 'Prestige Power Slide',
    fullName: 'Inherent.Prestige.PowerSlide',
    description: 'Activating this power will have your character slide across the ground, leaving behind a trail of sparks. This prestige power increases your run speed.',
    shortHelp: 'Toggle: Self +Speed',
    icon: 'inherent_athleticrun.png',
    powerType: 'Toggle',
    available: -1,
    maxSlots: 4,
    allowedEnhancements: ['Run Speed', 'EnduranceReduction', 'Jump'],
    allowedSetCategories: ['Running & Sprints', 'Leaping & Sprints'],
    isLocked: true,
    category: 'prestige',
    effects: {
      enduranceCost: 0.13,
      runSpeed: { scale: 0.5, table: 'Melee_SpeedRunning' },
    },
  },
  {
    name: 'Prestige Power Rush',
    fullName: 'Inherent.Prestige.PowerRush',
    description: 'Activating this power will give your character a burst of speed, leaving behind a colored trail. This prestige power increases your run speed.',
    shortHelp: 'Toggle: Self +Speed',
    icon: 'inherent_athleticrun.png',
    powerType: 'Toggle',
    available: -1,
    maxSlots: 4,
    allowedEnhancements: ['Run Speed', 'EnduranceReduction', 'Jump'],
    allowedSetCategories: ['Running & Sprints', 'Leaping & Sprints'],
    isLocked: true,
    category: 'prestige',
    effects: {
      enduranceCost: 0.13,
      runSpeed: { scale: 0.5, table: 'Melee_SpeedRunning' },
    },
  },
  {
    name: 'Prestige Power Surge',
    fullName: 'Inherent.Prestige.PowerSurge',
    description: 'Activating this power will surround your character with an electric field as you run. This prestige power increases your run speed.',
    shortHelp: 'Toggle: Self +Speed',
    icon: 'inherent_athleticrun.png',
    powerType: 'Toggle',
    available: -1,
    maxSlots: 4,
    allowedEnhancements: ['Run Speed', 'EnduranceReduction', 'Jump'],
    allowedSetCategories: ['Running & Sprints', 'Leaping & Sprints'],
    isLocked: true,
    category: 'prestige',
    effects: {
      enduranceCost: 0.13,
      runSpeed: { scale: 0.5, table: 'Melee_SpeedRunning' },
    },
  },
  {
    name: 'Prestige Power Dash',
    fullName: 'Inherent.Prestige.PowerDash',
    description: 'Activating this power will cause your character to dash forward leaving a colored afterimage trail. This prestige power increases your run speed.',
    shortHelp: 'Toggle: Self +Speed',
    icon: 'inherent_athleticrun.png',
    powerType: 'Toggle',
    available: -1,
    maxSlots: 4,
    allowedEnhancements: ['Run Speed', 'EnduranceReduction', 'Jump'],
    allowedSetCategories: ['Running & Sprints', 'Leaping & Sprints'],
    isLocked: true,
    category: 'prestige',
    effects: {
      enduranceCost: 0.13,
      runSpeed: { scale: 0.5, table: 'Melee_SpeedRunning' },
    },
  },
  {
    name: 'Prestige Power Quick',
    fullName: 'Inherent.Prestige.PowerQuick',
    description: 'Activating this power will cause your character to leave behind ghostly afterimages as you run. This prestige power increases your run speed.',
    shortHelp: 'Toggle: Self +Speed',
    icon: 'inherent_athleticrun.png',
    powerType: 'Toggle',
    available: -1,
    maxSlots: 4,
    allowedEnhancements: ['Run Speed', 'EnduranceReduction', 'Jump'],
    allowedSetCategories: ['Running & Sprints', 'Leaping & Sprints'],
    isLocked: true,
    category: 'prestige',
    effects: {
      enduranceCost: 0.13,
      runSpeed: { scale: 0.5, table: 'Melee_SpeedRunning' },
    },
  },
];

// ============================================
// KHELDIAN INHERENT POWERS
// ============================================

/**
 * Peacebringer-specific inherent travel powers
 */
const PEACEBRINGER_INHERENT_POWERS: InherentPowerDef[] = [
  {
    name: 'Energy Flight',
    fullName: 'Inherent.Inherent.Energy Flight',
    description:
      'Energy Flight allows you to travel large distances quickly. If you attack a target while this power is on, your flight speed will be temporarily reduced. Your Energy Flight speed increases with your Level.',
    shortHelp: 'Toggle: Self Fly',
    icon: 'inherentpeacebringer_energyflight.png',
    powerType: 'Toggle',
    targetType: 'Self',
    effectArea: 'SingleTarget',
    available: -1, // Level 1
    maxSlots: 6,
    allowedEnhancements: ['EnduranceReduction', 'Fly'],
    allowedSetCategories: ['Flight', 'Universal Travel'],
    isLocked: true,
    category: 'basic',
    stats: {
      endurance: 0.2275,
    },
    effects: {
      movement: {
        fly: { scale: 1.0, table: 'Melee_Ones' },
        flySpeed: { scale: 1.1, table: 'Melee_SpeedFlying' },
      },
    },
  },
  {
    name: 'Combat Flight',
    fullName: 'Inherent.Inherent.Combat Flight',
    description:
      'For hovering and aerial combat. This power is much slower than Energy Flight, but provides some Defense, offers good air control, costs little Endurance, and has none of the penalties associated with Energy Flight.',
    shortHelp: 'Toggle: Self Fly, +DEF',
    icon: 'luminousaura_combatflight.png',
    powerType: 'Toggle',
    targetType: 'Self',
    effectArea: 'SingleTarget',
    available: 9, // Level 10
    maxSlots: 6,
    allowedEnhancements: ['EnduranceReduction', 'Fly', 'Defense'],
    allowedSetCategories: ['Defense Sets', 'Flight', 'Universal Travel'],
    isLocked: true,
    category: 'basic',
    stats: {
      endurance: 0.0975,
      castTime: 0.5,
    },
    effects: {
      movement: {
        fly: { scale: 0.1, table: 'Melee_Ones' },
      },
      defenseBuff: {
        ranged: { scale: 0.25, table: 'Melee_Buff_Def' },
        melee: { scale: 0.25, table: 'Melee_Buff_Def' },
        aoe: { scale: 0.25, table: 'Melee_Buff_Def' },
        smashing: { scale: 0.25, table: 'Melee_Buff_Def' },
        lethal: { scale: 0.25, table: 'Melee_Buff_Def' },
        fire: { scale: 0.25, table: 'Melee_Buff_Def' },
        cold: { scale: 0.25, table: 'Melee_Buff_Def' },
        energy: { scale: 0.25, table: 'Melee_Buff_Def' },
        negative: { scale: 0.25, table: 'Melee_Buff_Def' },
        psionic: { scale: 0.25, table: 'Melee_Buff_Def' },
        toxic: { scale: 0.25, table: 'Melee_Buff_Def' },
      },
    },
  },
];

/**
 * Warshade-specific inherent travel powers
 */
const WARSHADE_INHERENT_POWERS: InherentPowerDef[] = [
  {
    name: 'Shadow Step',
    fullName: 'Inherent.Inherent.Shadow Step',
    description:
      'You can Teleport long distances. Once at your destination, you will be stuck in between dimensions for up to 15s. While in this state, you will not be affected by gravity, and be able to execute additional teleportation jumps at a discounted endurance cost.',
    shortHelp: 'Ranged (Location), Self Teleport',
    icon: 'umbralaura_shadowstep.png',
    powerType: 'Click',
    targetType: 'Location (Teleport)',
    effectArea: 'Location',
    available: -1, // Level 1
    maxSlots: 6,
    allowedEnhancements: ['EnduranceReduction', 'Range'],
    allowedSetCategories: ['Teleport', 'Universal Travel'],
    isLocked: true,
    category: 'basic',
    stats: {
      range: 300,
      endurance: 13.0,
      castTime: 1.67,
    },
  },
  {
    name: 'Shadow Recall',
    fullName: 'Inherent.Inherent.Shadow Recall',
    description:
      'You can Teleport a single foe or ally directly next to yourself. A successful hit must be made in order to Teleport the foes. Some powerful foes cannot be Teleported.',
    shortHelp: 'Teleport Teammate or Foe',
    icon: 'umbralaura_shadowrecall.png',
    powerType: 'Click',
    targetType: 'Any (Alive)',
    effectArea: 'SingleTarget',
    available: 9, // Level 10
    maxSlots: 6,
    allowedEnhancements: ['Interrupt', 'EnduranceReduction', 'Range', 'Recharge', 'Accuracy'],
    allowedSetCategories: ['Teleport', 'Universal Travel'],
    isLocked: true,
    category: 'basic',
    stats: {
      accuracy: 1,
      range: 10000,
      recharge: 6,
      endurance: 15.0,
      castTime: 5.93,
    },
  },
];

/**
 * Map of archetype IDs to their extra inherent powers
 */
const ARCHETYPE_INHERENT_POWERS: Record<string, InherentPowerDef[]> = {
  peacebringer: PEACEBRINGER_INHERENT_POWERS,
  warshade: WARSHADE_INHERENT_POWERS,
};

/**
 * Get archetype-specific inherent powers (e.g. Kheldian travel powers)
 */
export function getArchetypeInherentPowers(archetypeId?: string): InherentPowerDef[] {
  if (!archetypeId) return [];
  return ARCHETYPE_INHERENT_POWERS[archetypeId] || [];
}

/**
 * Get all inherent powers that should be auto-granted
 * Note: Archetype inherent is added separately based on selected archetype
 */
export function getInherentPowers(): InherentPowerDef[] {
  return [...BASIC_INHERENT_POWERS, ...INHERENT_FITNESS_POWERS, ...PRESTIGE_SPRINT_POWERS];
}

/**
 * Get an inherent power definition by name
 */
export function getInherentPowerDef(name: string): InherentPowerDef | undefined {
  const allInherents = getInherentPowers();
  const found = allInherents.find((p) => p.name === name);
  if (found) return found;
  // Also check archetype-specific inherent powers (e.g. Kheldian travel powers)
  for (const powers of Object.values(ARCHETYPE_INHERENT_POWERS)) {
    const match = powers.find((p) => p.name === name);
    if (match) return match;
  }
  return undefined;
}

/**
 * Create an archetype inherent power definition from an archetype's inherent
 */
export function createArchetypeInherentPower(
  archetypeName: string,
  inherent: { name: string; description: string; icon?: string }
): InherentPowerDef {
  // Use explicit icon if provided, otherwise generate from archetype and power name
  // e.g., "Blaster" + "Defiance" -> "inherent_blaster_defiance.png"
  const archetypeSlug = archetypeName.toLowerCase().replace(/[\s-]+/g, '');
  const powerSlug = inherent.name.toLowerCase().replace(/[\s-]+/g, '');
  const iconName = inherent.icon || `inherent_${archetypeSlug}_${powerSlug}.png`;

  return {
    name: inherent.name,
    fullName: `Inherent.${archetypeName}.${inherent.name.replace(/\s+/g, '')}`,
    description: inherent.description,
    icon: iconName,
    powerType: 'Auto',
    available: -1,
    maxSlots: 0, // Archetype inherents cannot have slots
    allowedEnhancements: [],
    allowedSetCategories: [],
    isLocked: true,
    category: 'archetype',
  };
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
