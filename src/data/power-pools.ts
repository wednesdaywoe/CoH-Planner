/**
 * Power Pool data and accessor functions
 * Migrated from legacy/js/data/pools/
 *
 * Power Pools are secondary power sets that any character can take.
 * Players can select up to 4 pools total.
 */

import type {
  PowerPool,
  Power,
  IOSetCategory,
  EnhancementStatType,
  PowerType,
  DamageType,
} from '@/types';
import { POWER_POOLS_RAW } from './power-pools-raw';
import { POOL_UNLOCK_LEVEL, EARLY_TRAVEL_POWERS } from './levels';

// ============================================
// POWER POOL REGISTRY TYPE
// ============================================

export type PowerPoolRegistry = Record<string, PowerPool>;

// ============================================
// RAW DATA TYPES (for conversion)
// ============================================

interface LegacyPoolPowerEffects {
  accuracy?: number;
  range?: number;
  recharge?: number;
  endurance?: number;
  activationTime?: number;
  effectArea?: string;
  radius?: number;
  damage?: {
    type: string;
    scale: number;
    table?: string;
  };
  protection?: Record<string, number>;
  runSpeed?: { scale: number; table?: string };
  jumpHeight?: { scale: number; table?: string };
  jumpSpeed?: { scale: number; table?: string };
  [key: string]: unknown;
}

interface LegacyPoolPower {
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
  effects: LegacyPoolPowerEffects;
}

interface LegacyPowerPool {
  id: string;
  name: string;
  displayName?: string;
  description: string;
  icon: string;
  requires?: string;
  powers: LegacyPoolPower[];
}

type LegacyPowerPoolRegistry = Record<string, LegacyPowerPool>;

// ============================================
// DATA TRANSFORMATION
// ============================================

/**
 * Transform legacy pool power to typed Power
 */
function transformPoolPower(legacy: LegacyPoolPower): Power {
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
      accuracy: legacy.effects.accuracy,
      range: legacy.effects.range,
      recharge: legacy.effects.recharge,
      enduranceCost: legacy.effects.endurance,
      castTime: legacy.effects.activationTime,
      damage: legacy.effects.damage
        ? {
            type: legacy.effects.damage.type as DamageType,
            scale: legacy.effects.damage.scale,
          }
        : undefined,
      protection: legacy.effects.protection,
      runSpeed: legacy.effects.runSpeed,
      jumpHeight: legacy.effects.jumpHeight,
      jumpSpeed: legacy.effects.jumpSpeed,
    },
  };
}

/**
 * Transform legacy power pool to typed PowerPool
 */
function transformPowerPool(legacy: LegacyPowerPool): PowerPool {
  return {
    id: legacy.id,
    name: legacy.name,
    displayName: legacy.displayName,
    description: legacy.description,
    icon: legacy.icon,
    requires: legacy.requires,
    powers: legacy.powers.map(transformPoolPower),
  };
}

/**
 * Transform entire registry
 */
function transformRegistry(legacy: LegacyPowerPoolRegistry): PowerPoolRegistry {
  const registry: PowerPoolRegistry = {};
  for (const [id, pool] of Object.entries(legacy)) {
    registry[id] = transformPowerPool(pool);
  }
  return registry;
}

// ============================================
// POWER POOL REGISTRY
// ============================================

// Transform and cache the raw data at module load time
const _pools: PowerPoolRegistry = transformRegistry(
  POWER_POOLS_RAW as unknown as LegacyPowerPoolRegistry
);

/**
 * Get all power pools
 */
export function getAllPowerPools(): PowerPoolRegistry {
  return _pools;
}

// ============================================
// ACCESSOR FUNCTIONS
// ============================================

/**
 * Get a power pool by ID (e.g., "speed", "fighting")
 */
export function getPowerPool(id: string): PowerPool | undefined {
  return _pools[id];
}

/**
 * Get all pool IDs
 */
export function getPowerPoolIds(): string[] {
  return Object.keys(_pools);
}

/**
 * Get a specific power from a pool
 */
export function getPoolPower(poolId: string, powerName: string): Power | undefined {
  const pool = getPowerPool(poolId);
  return pool?.powers.find((p) => p.name === powerName);
}

/**
 * Get powers available at or before a given level (including rank 1 and 2)
 * Note: available is 0-indexed (available=0 means level 1)
 */
export function getPoolPowersAvailableAtLevel(poolId: string, level: number): Power[] {
  const pool = getPowerPool(poolId);
  if (!pool) return [];
  return pool.powers.filter((p) => p.available < level && p.available >= 0);
}

/**
 * Get the tier-unlocking powers for a pool (typically rank 1 and 2)
 */
export function getPoolEntryPowers(poolId: string): Power[] {
  const pool = getPowerPool(poolId);
  if (!pool) return [];
  return pool.powers.filter((p) => p.available === 0 && (!p.requires || p.requires === ''));
}

/**
 * Check if prerequisites are met for a pool power
 * @param poolId - The pool ID
 * @param powerName - The power to check
 * @param selectedPowers - Array of power names already selected from this pool
 */
export function arePoolPrerequisitesMet(
  poolId: string,
  powerName: string,
  selectedPowers: string[]
): boolean {
  const power = getPoolPower(poolId, powerName);
  if (!power) return false;

  // No requires means no prerequisites
  if (!power.requires || power.requires === '') return true;

  // Build a mapping from fullName to display name for this pool
  // This handles cases where internal names differ from display names
  // (e.g., Pool.Flight.Combat_Flight -> "Hover", not "Combat Flight")
  const pool = _pools[poolId];
  const fullNameToDisplayName: Record<string, string> = {};
  if (pool) {
    for (const p of pool.powers) {
      if (p.fullName) {
        const internalParts = p.fullName.split('.');
        const internalName = internalParts[internalParts.length - 1].replace(/_/g, ' ');
        fullNameToDisplayName[internalName] = p.name;
      }
    }
  }

  // Parse the requires expression
  // Format: "Pool.Speed.Flurry && Pool.Speed.Hasten || Pool.Speed.Flurry && Pool.Speed.Super_Speed"
  const requiresExpr = power.requires;

  // Split by || (OR conditions)
  const orConditions = requiresExpr.split('||').map((s) => s.trim());

  // Check if any OR condition is satisfied
  return orConditions.some((orCond) => {
    // Split by && (AND conditions)
    const andConditions = orCond.split('&&').map((s) => s.trim());

    // All AND conditions must be met
    return andConditions.every((andCond) => {
      // Extract power name from full name (e.g., "Pool.Speed.Hasten" -> "Hasten")
      const parts = andCond.split('.');
      const internalName = parts[parts.length - 1].replace(/_/g, ' ');
      // Resolve to display name if available, otherwise use the internal name
      const reqPowerName = fullNameToDisplayName[internalName] || internalName;
      return selectedPowers.includes(reqPowerName);
    });
  });
}

// ============================================
// POOL CATEGORY INFO
// ============================================

export interface PoolCategoryInfo {
  id: string;
  name: string;
  pools: string[];
}

/**
 * Standard pool categories
 */
export const POOL_CATEGORIES: PoolCategoryInfo[] = [
  {
    id: 'travel',
    name: 'Travel',
    pools: ['flight', 'leaping', 'speed', 'teleportation'],
  },
  {
    id: 'combat',
    name: 'Combat',
    pools: ['fighting', 'presence', 'invisibility', 'force_of_will'],
  },
  {
    id: 'support',
    name: 'Support',
    pools: ['medicine', 'leadership'],
  },
  {
    id: 'utility',
    name: 'Utility',
    pools: ['sorcery', 'experimentation'],
  },
];

/**
 * Get pools in a category
 */
export function getPoolsByCategory(categoryId: string): PowerPool[] {
  const category = POOL_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return [];
  return category.pools.map((poolId) => _pools[poolId]).filter(Boolean) as PowerPool[];
}

// ============================================
// POWER AVAILABILITY CHECKING
// ============================================

/**
 * Check if power pools are available at the given level
 */
export function arePoolsUnlocked(level: number): boolean {
  return level >= POOL_UNLOCK_LEVEL;
}

/**
 * Check if a specific pool power is available based on level and selected powers
 *
 * Rules:
 * - Pools unlock at level 4
 * - First two powers (rank 1-2) are available immediately when pool unlocks
 * - Travel powers (Super Speed, Fly, Teleport, Super Jump, Infiltration, Speed of Sound, Mystic Flight)
 *   are available at level 4 despite being rank 3
 * - Other rank 3 powers require level 14 AND 1 other power from the pool
 * - Rank 4-5 powers require level 14 AND 2 other powers from the pool
 *
 * @param poolId - The pool ID
 * @param power - The power to check
 * @param level - Current character level
 * @param selectedPowersInPool - Array of power names already selected from this pool
 */
export function isPowerAvailableInPool(
  poolId: string,
  power: Power,
  level: number,
  selectedPowersInPool: string[]
): boolean {
  // Pools not available before level 4
  if (level < POOL_UNLOCK_LEVEL) return false;

  // Powers with available=-1 are auto-granted powers that should never be shown in selection
  // They are automatically added to the build when their parent power is selected
  // Examples: Afterburner (granted by Fly), Adaptation modes in Bio Organic Armor
  if (power.available < 0) {
    return false;
  }

  const rank = power.rank || 1;
  const numSelectedPowers = selectedPowersInPool.length;

  // Rank 1-2: Available immediately at pool unlock (level 4)
  if (rank <= 2) {
    return true;
  }

  // Rank 3: Check if it's an early travel power
  if (rank === 3) {
    const isEarlyTravelPower = EARLY_TRAVEL_POWERS.includes(power.name);
    if (isEarlyTravelPower) {
      // Travel powers are available at level 4 with no prerequisites
      return true;
    }
    // Non-travel rank 3 powers require level 14 and 1 power from the pool
    if (level < 14) return false;
    if (numSelectedPowers < 1) return false;
    return arePoolPrerequisitesMet(poolId, power.name, selectedPowersInPool);
  }

  // Rank 4-5+: Require level 14 and 2 powers from the pool
  if (rank >= 4) {
    if (level < 14) return false;
    if (numSelectedPowers < 2) return false;
    return arePoolPrerequisitesMet(poolId, power.name, selectedPowersInPool);
  }

  return false;
}

/**
 * Get all available powers from a pool based on level and already selected powers
 * This filters out already selected powers and checks level/prerequisite requirements
 */
export function getAvailablePoolPowers(
  poolId: string,
  level: number,
  selectedPowersInPool: string[]
): Power[] {
  const pool = getPowerPool(poolId);
  if (!pool) return [];

  return pool.powers.filter((power) => {
    // Skip already selected powers
    if (selectedPowersInPool.includes(power.name)) return false;
    // Check availability
    return isPowerAvailableInPool(poolId, power, level, selectedPowersInPool);
  });
}
