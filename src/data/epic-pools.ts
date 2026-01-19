/**
 * Epic/Patron Pool data and accessor functions
 * Migrated from legacy/js/data/epics/
 *
 * Epic pools are archetype-specific power pools that unlock at level 35.
 * Heroes have Epic Power Pools, Villains have Patron Power Pools.
 */

import type {
  Power,
  IOSetCategory,
  EnhancementStatType,
  PowerType,
  DamageType,
} from '@/types';
import { EPIC_POOLS_RAW } from './epic-pools-raw';
import { resolvePath } from '@/utils/paths';

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
  accuracy?: number;
  range?: number;
  recharge?: number;
  endurance?: number;
  activationTime?: number;
  effectArea?: string;
  radius?: number;
  arc?: number;
  damage?: {
    type: string;
    scale: number;
    table?: string;
  };
  protection?: Record<string, number>;
  resistance?: Record<string, number>;
  recovery?: { scale: number; table?: string };
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
      radius: legacy.effects.radius,
      damage: legacy.effects.damage
        ? {
            type: legacy.effects.damage.type as DamageType,
            scale: legacy.effects.damage.scale,
          }
        : undefined,
      protection: legacy.effects.protection,
      resistance: legacy.effects.resistance as Record<string, number> | undefined,
    },
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

/**
 * Get all epic pool IDs
 */
export function getEpicPoolIds(): string[] {
  return Object.keys(_epicPools);
}

/**
 * Get epic pools for a specific archetype
 * @param archetypeId - The archetype ID (e.g., "sentinel", "blaster")
 * @returns Array of epic pools available to that archetype
 */
export function getEpicPoolsForArchetype(archetypeId: string): EpicPool[] {
  // Normalize archetype ID (handle "arachnos-soldier" vs "arachnos_soldier")
  const normalizedId = archetypeId.toLowerCase().replace(/-/g, '_');

  return Object.values(_epicPools).filter(
    (pool) => pool.archetype.toLowerCase() === normalizedId
  );
}

/**
 * Get epic pool by archetype and pool name
 * @param archetypeId - The archetype ID
 * @param poolName - The pool display name (e.g., "Dark Mastery")
 */
export function getEpicPoolByName(archetypeId: string, poolName: string): EpicPool | undefined {
  const pools = getEpicPoolsForArchetype(archetypeId);
  return pools.find(
    (p) => p.name.toLowerCase() === poolName.toLowerCase() ||
           p.displayName.toLowerCase() === poolName.toLowerCase()
  );
}

/**
 * Get a specific power from an epic pool
 */
export function getEpicPoolPower(poolId: string, powerName: string): Power | undefined {
  const pool = getEpicPool(poolId);
  return pool?.powers.find((p) => p.name === powerName);
}

/**
 * Get powers available at or before a given level from an epic pool
 * Note: available is 0-indexed (available=34 means level 35)
 */
export function getEpicPoolPowersAvailableAtLevel(poolId: string, level: number): Power[] {
  const pool = getEpicPool(poolId);
  if (!pool) return [];
  return pool.powers.filter((p) => p.available < level && p.available >= 0);
}

/**
 * Search epic pools by name or description
 */
export function searchEpicPools(query: string): EpicPool[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(_epicPools).filter(
    (pool) =>
      pool.name.toLowerCase().includes(lowerQuery) ||
      pool.displayName.toLowerCase().includes(lowerQuery) ||
      pool.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get count of epic pools by archetype
 */
export function getEpicPoolCountByArchetype(): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const pool of Object.values(_epicPools)) {
    const archetype = pool.archetype;
    counts[archetype] = (counts[archetype] || 0) + 1;
  }

  return counts;
}

// ============================================
// EPIC POOL ICON UTILITIES
// ============================================

/**
 * Get the full icon path for an epic pool power
 */
export function getEpicPoolPowerIconPath(poolName: string, iconFilename: string | undefined): string {
  if (!iconFilename) {
    return resolvePath('/img/Unknown.png');
  }

  // Epic pool power icons are typically in the Powers folder with their set name
  // Convert to proper path format
  const folderName = `${poolName} Powers Icons`;

  // Convert icon filename to CamelCase if needed
  const camelCaseIcon = iconFilename
    .split('_')
    .map(part => {
      if (part.endsWith('.png')) {
        const name = part.slice(0, -4);
        return name.charAt(0).toUpperCase() + name.slice(1) + '.png';
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('_');

  return resolvePath(`/img/Powers/${folderName}/${camelCaseIcon}`);
}
