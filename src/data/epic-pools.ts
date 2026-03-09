/**
 * Epic/Patron Pool data and accessor functions
 * Migrated from legacy/js/data/epics/
 *
 * Epic pools are archetype-specific power pools that unlock at level 35.
 * Heroes have Epic Power Pools, Villains have Patron Power Pools.
 */

import type {
  Power,
  PowerEffects,
  IOSetCategory,
  EnhancementStatType,
  PowerType,
} from '@/types';
import { EPIC_POOLS_RAW } from './epic-pools-raw';
import { EPIC_POOL_LEVEL, EPIC_TIER_REQUIREMENTS } from './levels';

// ============================================
// EPIC POOL TYPES
// ============================================

export interface EpicPool {
  id: string;
  name: string;
  displayName: string;
  archetype: string;
  description: string;
  icon: string;
  minLevel: number;
  powers: Power[];
}

export type EpicPoolRegistry = Record<string, EpicPool>;

// ============================================
// RAW DATA TYPES (for conversion)
// ============================================

interface LegacyEpicPowerEffects {
  // Stats (renamed during transformation)
  accuracy?: number;
  range?: number;
  recharge?: number;
  endurance?: number;
  activationTime?: number;
  effectArea?: string;
  radius?: number;
  arc?: number;
  maxTargets?: number;
  // All other effect fields pass through directly
  [key: string]: unknown;
}

interface LegacyEpicPower {
  name: string;
  fullName?: string;
  rank: number;
  available: number;
  description: string;
  shortHelp?: string;
  icon: string;
  powerType: string;
  requires?: string;
  maxSlots: number;
  allowedEnhancements: string[];
  allowedSetCategories: string[];
  effects: LegacyEpicPowerEffects;
}

interface LegacyEpicPool {
  id: string;
  name: string;
  displayName?: string;
  archetype: string;
  description: string;
  icon: string;
  requires?: string;
  minLevel: number;
  powers: LegacyEpicPower[];
}

type LegacyEpicPoolRegistry = Record<string, LegacyEpicPool>;

// ============================================
// DATA TRANSFORMATION
// ============================================

/**
 * Transform legacy epic power to typed Power
 */
function transformEpicPower(legacy: LegacyEpicPower): Power {
  // Destructure stats that need renaming, spread the rest through directly
  const {
    endurance,
    activationTime,
    accuracy,
    range,
    recharge,
    effectArea,
    radius,
    arc,
    maxTargets,
    ...effectFields
  } = legacy.effects;

  return {
    name: legacy.name,
    fullName: legacy.fullName,
    available: legacy.available,
    rank: legacy.rank,
    maxSlots: legacy.maxSlots,
    allowedEnhancements: legacy.allowedEnhancements as EnhancementStatType[],
    allowedSetCategories: legacy.allowedSetCategories as IOSetCategory[],
    description: legacy.description,
    shortHelp: legacy.shortHelp,
    icon: legacy.icon,
    powerType: legacy.powerType as PowerType,
    requires: legacy.requires,
    effects: {
      // Stats (renamed from legacy format)
      accuracy,
      range,
      recharge,
      enduranceCost: endurance,
      castTime: activationTime,
      effectArea: effectArea as PowerEffects['effectArea'],
      radius,
      arc,
      maxTargets,
      // All other effects pass through directly (damage, buffs, debuffs,
      // mez, protection, resistance, movement, stealth, summon, etc.)
      ...effectFields,
    } as PowerEffects,
  };
}

/**
 * Transform legacy epic pool to typed EpicPool
 */
function transformEpicPool(legacy: LegacyEpicPool): EpicPool {
  return {
    id: legacy.id,
    name: legacy.name,
    displayName: legacy.displayName || legacy.name,
    archetype: legacy.archetype,
    description: legacy.description,
    icon: legacy.icon,
    minLevel: legacy.minLevel,
    powers: legacy.powers.map(transformEpicPower),
  };
}

/**
 * Transform entire registry
 */
function transformRegistry(legacy: LegacyEpicPoolRegistry): EpicPoolRegistry {
  const registry: EpicPoolRegistry = {};
  for (const [id, pool] of Object.entries(legacy)) {
    registry[id] = transformEpicPool(pool);
  }
  return registry;
}

// ============================================
// EPIC POOL REGISTRY
// ============================================

// Transform and cache the raw data at module load time
const _epicPools: EpicPoolRegistry = transformRegistry(
  EPIC_POOLS_RAW as unknown as LegacyEpicPoolRegistry
);

/**
 * Get all epic pools
 */
export function getAllEpicPools(): EpicPoolRegistry {
  return _epicPools;
}

// ============================================
// ACCESSOR FUNCTIONS
// ============================================

/**
 * Get an epic pool by ID (e.g., "sentinel_dark_mastery")
 */
export function getEpicPool(id: string): EpicPool | undefined {
  return _epicPools[id];
}

// Hero ATs that lack patron pool data use their villain counterpart's patron pools.
// All ATs can access patron pools in-game (unlocked via going rogue/villain).
const PATRON_POOL_FALLBACK: Record<string, string> = {
  defender: 'corruptor',
  tanker: 'brute',
  scrapper: 'stalker',
  controller: 'dominator',
  blaster: 'sentinel',
};

// Villain ATs that lack epic pool data use their hero counterpart's epic pools.
// Epic pools were proliferated to villain ATs in-game.
const EPIC_POOL_FALLBACK: Record<string, string> = {
  corruptor: 'defender',
  brute: 'tanker',
  stalker: 'scrapper',
  dominator: 'controller',
  mastermind: 'defender',
};

const PATRON_POOL_NAMES = new Set(['Leviathan Mastery', 'Mace Mastery', 'Mu Mastery', 'Soul Mastery']);

/**
 * Get epic pools for a specific archetype
 * @param archetypeId - The archetype ID (e.g., "sentinel", "blaster")
 * @returns Array of epic pools available to that archetype
 */
export function getEpicPoolsForArchetype(archetypeId: string): EpicPool[] {
  // Normalize archetype ID (handle "arachnos-soldier" vs "arachnos_soldier")
  const normalizedId = archetypeId.toLowerCase().replace(/-/g, '_');

  // Special case: Arachnos Widow shares patron pools with Arachnos Soldier
  // In-game, both VEATs can access the same patron pools (Leviathan, Mace, Mu, Soul)
  const archTypesToMatch = normalizedId === 'arachnos_widow'
    ? ['arachnos_widow', 'arachnos_soldier']
    : [normalizedId];

  const pools = Object.values(_epicPools).filter(
    (pool) => archTypesToMatch.includes(pool.archetype.toLowerCase())
  );

  // Fill in missing patron pools from villain counterpart
  const patronFallbackAT = PATRON_POOL_FALLBACK[normalizedId];
  if (patronFallbackAT) {
    const existingNames = new Set(pools.map(p => p.displayName || p.name));
    const fallbackPools = Object.values(_epicPools).filter(
      (pool) => pool.archetype.toLowerCase() === patronFallbackAT
        && PATRON_POOL_NAMES.has(pool.displayName || pool.name)
        && !existingNames.has(pool.displayName || pool.name)
    );
    pools.push(...fallbackPools);
  }

  // Fill in missing epic pools from hero counterpart
  const epicFallbackAT = EPIC_POOL_FALLBACK[normalizedId];
  if (epicFallbackAT) {
    const existingNames = new Set(pools.map(p => p.displayName || p.name));
    const fallbackPools = Object.values(_epicPools).filter(
      (pool) => pool.archetype.toLowerCase() === epicFallbackAT
        && !PATRON_POOL_NAMES.has(pool.displayName || pool.name)
        && !existingNames.has(pool.displayName || pool.name)
    );
    pools.push(...fallbackPools);
  }

  return pools;
}

// ============================================
// EPIC POWER AVAILABILITY CHECKING
// ============================================

/**
 * Check if epic pools are available at the given level
 */
export function areEpicPoolsUnlocked(level: number): boolean {
  return level >= EPIC_POOL_LEVEL;
}

/**
 * Check if a specific epic pool power is available based on level and selected powers
 *
 * Rules:
 * - Epic pools unlock at level 35
 * - First two powers (rank 1-2) are available at level 35
 * - Third power (rank 3) requires level 38 AND 1 power from the pool
 * - Fourth power (rank 4) requires level 41 AND 1 power from the pool
 * - Fifth power (rank 5) requires level 44 AND 2 powers from the pool
 *
 * @param power - The power to check
 * @param level - Current character level
 * @param selectedPowersInPool - Array of power names already selected from this pool
 */
export function isEpicPowerAvailable(
  power: Power,
  level: number,
  selectedPowersInPool: string[]
): boolean {
  // Epic pools not available before level 35
  if (level < EPIC_POOL_LEVEL) return false;

  // Powers with available=-1 are auto-granted powers that should never be shown in selection
  if (power.available < 0) {
    return false;
  }

  const rank = power.rank || 1;
  const numSelectedPowers = selectedPowersInPool.length;

  // Rank 1-2: Available at level 35 (epic pool unlock)
  if (rank <= 2) {
    return level >= EPIC_TIER_REQUIREMENTS.TIER_1_2.minLevel;
  }

  // Rank 3: Requires level 38 and 1 power from the pool
  if (rank === 3) {
    if (level < EPIC_TIER_REQUIREMENTS.TIER_3.minLevel) return false;
    return numSelectedPowers >= EPIC_TIER_REQUIREMENTS.TIER_3.requiredPowers;
  }

  // Rank 4: Requires level 41 and 1 power from the pool
  if (rank === 4) {
    if (level < EPIC_TIER_REQUIREMENTS.TIER_4.minLevel) return false;
    return numSelectedPowers >= EPIC_TIER_REQUIREMENTS.TIER_4.requiredPowers;
  }

  // Rank 5+: Requires level 44 and 2 powers from the pool
  if (rank >= 5) {
    if (level < EPIC_TIER_REQUIREMENTS.TIER_5.minLevel) return false;
    return numSelectedPowers >= EPIC_TIER_REQUIREMENTS.TIER_5.requiredPowers;
  }

  return false;
}

