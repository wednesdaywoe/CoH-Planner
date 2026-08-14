/**
 * Level Progression Data
 *
 * Defines all level-based unlocks and progression rules for City of Heroes.
 * This centralizes level requirements that were previously scattered across the codebase.
 */

import type { Power } from '@/types';
import { BASIC_INHERENTS, type BasicInherentDef } from './generated/basic-inherents';
import { BASIC_INHERENTS as REBIRTH_BASIC_INHERENTS } from '../rebirth/generated/basic-inherents';
import { BASIC_INHERENTS as THUNDERSPY_BASIC_INHERENTS } from '../thunderspy/generated/basic-inherents';

// ============================================
// CONSTANTS
// ============================================

/** Maximum character level */
export const MAX_LEVEL = 50;

/** Level at which Epic/Patron pools become available */
export const EPIC_POOL_LEVEL = 35;

/** Level at which regular Power Pools become available */
export const POOL_UNLOCK_LEVEL = 4;

/**
 * Maximum number of power pools that can be selected on the shared schedule
 * (Homecoming, Rebirth). Thunderspy allows one more — see
 * {@link getMaxPowerPools}. Prefer the getter over this constant at any call
 * site that has the build's `serverId`.
 */
export const MAX_POWER_POOLS = 4;

/** Thunderspy lets characters slot a 5th power pool. */
const THUNDERSPY_MAX_POWER_POOLS = 5;

/**
 * Maximum number of power pools selectable on a given server. Defaults to the
 * shared cap of 4; Thunderspy allows 5. Pass `build.serverId` at the call site
 * (mirrors {@link getSlotGrants}).
 */
export function getMaxPowerPools(serverId?: string): number {
  return serverId === 'thunderspy' ? THUNDERSPY_MAX_POWER_POOLS : MAX_POWER_POOLS;
}

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
 * Key = level, Value = number of PLACEABLE slots granted at that level.
 * These are the extra slots players can freely assign — NOT the free slot 0
 * that comes with every power pick.
 *
 * Pattern:
 *   L1-L2: No placeable slots (only free defaults for picked powers)
 *   L3-L29 (odd levels): 2 placeable slots each
 *   L31+: 3 placeable slots, schedule interleaved with power picks:
 *     31 slots, 32 power, 33 slots, 34 slots,
 *     35 power, 36 slots, 37 slots, 38 power, 39 slots, 40 slots,
 *     41 power, 42 slots, 43 slots, 44 power, 45 slots, 46 slots,
 *     47 power, 48 slots, 49 power, 50 slots
 *
 * Total: 14×2 + 13×3 = 67 placeable slots at level 50
 */
export const SLOT_GRANTS: Readonly<Record<number, number>> = {
  // Levels 3-29 (odd): 2 slots each
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
  // Levels 31+: 3 slots each
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
} as const;

/**
 * Thunderspy grants four MORE placeable slots than every other server — one
 * extra at L9, L23 and L29 (2→3) and at L43 (3→4) — for 71 total at L50 instead
 * of 67. (Schedule confirmed by a Thunderspy player, 2026-06-16; the only diffs
 * from the shared schedule are those four levels.) Homecoming and Rebirth use
 * the shared SLOT_GRANTS above.
 */
const THUNDERSPY_SLOT_GRANTS: Readonly<Record<number, number>> = {
  ...SLOT_GRANTS,
  9: 3,
  23: 3,
  29: 3,
  43: 4,
};

/**
 * The slot-grant schedule for a server. Defaults to the shared 67-slot schedule;
 * Thunderspy gets its own 71-slot variant. The slot functions below all accept
 * an optional `serverId` so the budget/progression math tracks the build's
 * server — pass `build.serverId` at the call site.
 */
export function getSlotGrants(serverId?: string): Readonly<Record<number, number>> {
  return serverId === 'thunderspy' ? THUNDERSPY_SLOT_GRANTS : SLOT_GRANTS;
}

/**
 * Get the number of slots granted at a specific level
 */
export function getSlotsGrantedAtLevel(level: number, serverId?: string): number {
  return getSlotGrants(serverId)[level] ?? 0;
}

/**
 * Get the total number of enhancement slots available at a given level
 */
export function getTotalSlotsAtLevel(level: number, serverId?: string): number {
  let total = 0;
  for (const [lvl, slots] of Object.entries(getSlotGrants(serverId))) {
    if (parseInt(lvl) <= level) {
      total += slots;
    }
  }
  return total;
}

/**
 * Find the next level above `currentLevel` that grants a power pick or slots.
 * Used by Level Up mode to advance to the next meaningful milestone.
 * Returns MAX_LEVEL if no further grants exist.
 */
export function getNextGrantLevel(currentLevel: number, serverId?: string): number {
  const grantLevels = new Set<number>();
  for (const l of POWER_PICK_LEVELS) grantLevels.add(l);
  for (const l of Object.keys(getSlotGrants(serverId))) grantLevels.add(Number(l));
  const sorted = [...grantLevels].sort((a, b) => a - b);
  return sorted.find((l) => l > currentLevel) ?? MAX_LEVEL;
}

/**
 * Number of *new* power picks granted at this specific level (not cumulative).
 * Level 1 grants 2 (primary + secondary); every other POWER_PICK_LEVELS entry grants 1.
 */
export function getPicksGrantedAtLevel(level: number): number {
  if (!POWER_PICK_LEVELS.includes(level)) return 0;
  return level === 1 ? 2 : 1;
}

/**
 * Compute the "progression level" for a build given how many picks/slots have
 * been used. Returns the lowest level where the cumulative grants exceed what
 * the user has already consumed — i.e. the level the user is currently working on.
 *
 * Used by Level Up mode to clamp `build.level` so a user can't pre-pay picks
 * from future levels. If the build has fully consumed everything at level 50,
 * returns MAX_LEVEL.
 */
export function getProgressionLevel(usedPicks: number, usedSlots: number, serverId?: string): number {
  let accumPicks = 0;
  let accumSlots = 0;
  for (let L = 1; L <= MAX_LEVEL; L++) {
    accumPicks += getPicksGrantedAtLevel(L);
    accumSlots += getSlotsGrantedAtLevel(L, serverId);
    if (usedPicks < accumPicks || usedSlots < accumSlots) {
      return L;
    }
  }
  return MAX_LEVEL;
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

// NOTE: Power-pool pick gating is fully data-driven — see isPowerAvailableInPool
// in power-pools.ts. The level gate comes from each power's own `available`
// field (clamped to POOL_UNLOCK_LEVEL) and prerequisites come from its
// `requires` expression. The former POOL_TIER_REQUIREMENTS rank→level table and
// the EARLY_TRAVEL_POWERS hard-coded list were removed: they only approximated
// what `available` (e.g. Super Speed/Fly = available 3 = level 4) and `requires`
// already encode, and mis-gated non-Homecoming pool layouts.

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
    internalName: 'Swift',
    fullName: 'Inherent.Fitness.Swift',
    description: 'You can naturally run slightly faster than normal. This ability is always on and does not cost any Endurance.',
    shortHelp: 'Auto: Self +Speed',
    icon: 'fitness_quick.png',
    powerType: 'Auto',
    available: -1,
    maxSlots: 6,
    allowedEnhancements: ['Run Speed', 'Fly'],
    allowedSetCategories: [],
    isLocked: true,
    category: 'fitness',
    effects: {
      runSpeed: { scale: 0.1, table: 'Melee_SpeedRunning' },
      flySpeed: { scale: 0.1, table: 'Melee_SpeedFlying' },
    },
  },
  {
    name: 'Hurdle',
    internalName: 'Hurdle',
    fullName: 'Inherent.Fitness.Hurdle',
    description: 'You can naturally jump higher than normal. This ability is always on and does not cost any Endurance.',
    shortHelp: 'Auto: Self +Jump',
    icon: 'fitness_hurdle.png',
    powerType: 'Auto',
    available: -1,
    maxSlots: 6,
    allowedEnhancements: ['Jump'],
    allowedSetCategories: [],
    isLocked: true,
    category: 'fitness',
    effects: {
      jumpHeight: { scale: 0.06, table: 'Melee_Leap' },
      jumpSpeed: { scale: 0.5, table: 'Melee_SpeedJumping' },
    },
  },
  {
    name: 'Health',
    internalName: 'Health',
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
    internalName: 'Stamina',
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
 * The universal inherent powers, read from each fork's own export.
 *
 * Brawl, Sprint, Rest, the free travel toggles and the prestige sprints used to
 * be spelled out here by hand — scales, tables, endurance, the lot — and because
 * only Homecoming has a `levels.ts`, every fork got Homecoming's copy. The
 * numbers disagreed with the export on nearly every axis and the membership was
 * simply wrong off Homecoming (INHERENT-4, INHERENT-5). They now come from
 * `generated/basic-inherents.ts`, one module per fork, built by
 * `scripts/convert-basic-inherents.cjs`.
 *
 * A power absent from a fork's module is a power that fork does not grant, and
 * the getters below say nothing about it rather than falling back to Homecoming.
 * Thunderspy is the case that matters: it has no Ninja Run, Beast Run, Athletic
 * Run or prestige sprint anywhere, and folds the travel band those carry into
 * its own Sprint instead.
 */
const BASIC_INHERENTS_BY_SERVER: Record<string, readonly BasicInherentDef[]> = {
  homecoming: BASIC_INHERENTS,
  rebirth: REBIRTH_BASIC_INHERENTS,
  thunderspy: THUNDERSPY_BASIC_INHERENTS,
};

function basicInherentsOf(serverId?: string): readonly BasicInherentDef[] {
  return (serverId !== undefined ? BASIC_INHERENTS_BY_SERVER[serverId] : undefined) ?? BASIC_INHERENTS;
}

/** Brawl, Sprint, Rest and the free travel toggles this server grants. */
export function getBasicInherentPowers(serverId?: string): InherentPowerDef[] {
  return basicInherentsOf(serverId).filter((p) => p.category === 'basic');
}

/** The prestige sprints this server grants — none of them on Thunderspy. */
export function getPrestigeSprintPowers(serverId?: string): InherentPowerDef[] {
  return basicInherentsOf(serverId).filter((p) => p.category === 'prestige');
}

/**
 * The Homecoming lists, for the static importers that predate the per-server
 * getters. Prefer `getBasicInherentPowers(build.serverId)` at any call site that
 * has a server.
 */
export const BASIC_INHERENT_POWERS: InherentPowerDef[] = getBasicInherentPowers();
export const PRESTIGE_SPRINT_POWERS: InherentPowerDef[] = getPrestigeSprintPowers();

// ============================================
// KHELDIAN INHERENT POWERS
// ============================================

/**
 * Peacebringer-specific inherent travel powers
 */
const PEACEBRINGER_INHERENT_POWERS: InherentPowerDef[] = [
  {
    name: 'Energy Flight',
    internalName: 'Energy_Flight',
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
    // Kheldian travel inherents render under the expanded "<AT> Inherent"
    // group (alongside Cosmic Balance), not the Basic group which is collapsed
    // by default — otherwise these auto-granted powers are undiscoverable.
    category: 'archetype',
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
    internalName: 'Combat_Flight',
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
    category: 'archetype', // Kheldian travel inherent → expanded "<AT> Inherent" group
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
    internalName: 'Shadow_Step',
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
    category: 'archetype', // Kheldian travel inherent → expanded "<AT> Inherent" group
    stats: {
      range: 300,
      endurance: 13.0,
      castTime: 1.67,
    },
  },
  {
    name: 'Shadow Recall',
    internalName: 'Shadow_Recall',
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
    category: 'archetype', // Kheldian travel inherent → expanded "<AT> Inherent" group
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
export function getInherentPowers(serverId?: string): InherentPowerDef[] {
  return [
    ...getBasicInherentPowers(serverId),
    ...INHERENT_FITNESS_POWERS,
    ...getPrestigeSprintPowers(serverId),
  ];
}

/**
 * Get an inherent power definition by name
 */
export function getInherentPowerDef(name: string, serverId?: string): InherentPowerDef | undefined {
  const allInherents = getInherentPowers(serverId);
  const found = allInherents.find((p) => p.internalName === name);
  if (found) return found;
  // Also check archetype-specific inherent powers (e.g. Kheldian travel powers)
  for (const powers of Object.values(ARCHETYPE_INHERENT_POWERS)) {
    const match = powers.find((p) => p.internalName === name);
    if (match) return match;
  }
  return undefined;
}

/**
 * Create an archetype inherent power definition from an archetype's inherent
 */
export function createArchetypeInherentPower(
  archetypeName: string,
  inherent: { name: string; description: string; icon?: string; powerType?: import('@/types').PowerType; effects?: import('@/types').PowerEffects }
): InherentPowerDef {
  // Use explicit icon if provided, otherwise generate from archetype and power name
  // e.g., "Blaster" + "Defiance" -> "inherent_blaster_defiance.png"
  const archetypeSlug = archetypeName.toLowerCase().replace(/[\s-]+/g, '');
  const powerSlug = inherent.name.toLowerCase().replace(/[\s-]+/g, '');
  const iconName = inherent.icon || `inherent_${archetypeSlug}_${powerSlug}.png`;

  return {
    name: inherent.name,
    internalName: inherent.name.replace(/\s+/g, '_'),
    fullName: `Inherent.${archetypeName}.${inherent.name.replace(/\s+/g, '')}`,
    description: inherent.description,
    icon: iconName,
    // Most archetype inherents are passive (Fury, Containment, Gauntlet, …);
    // honour an explicit type for the click-activated exceptions (Domination)
    // so they stay perma-trackable instead of being flattened to Auto.
    powerType: inherent.powerType ?? 'Auto',
    available: -1,
    maxSlots: 0, // Archetype inherents cannot have slots
    allowedEnhancements: [],
    allowedSetCategories: [],
    isLocked: true,
    category: 'archetype',
    ...(inherent.effects ? { effects: inherent.effects } : {}),
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
export function getLevelInfo(level: number, serverId?: string): LevelInfo {
  return {
    level,
    powerPick: isPowerPickLevel(level),
    slotsGranted: getSlotsGrantedAtLevel(level, serverId),
    totalSlots: getTotalSlotsAtLevel(level, serverId),
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
export function generateProgressionTable(serverId?: string): LevelInfo[] {
  const table: LevelInfo[] = [];
  for (let level = 1; level <= MAX_LEVEL; level++) {
    table.push(getLevelInfo(level, serverId));
  }
  return table;
}
