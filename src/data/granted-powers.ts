/**
 * Granted Powers - maps parent powers to their automatically granted sub-powers
 *
 * Some powers in City of Heroes grant additional powers when taken.
 * For example:
 * - Adaptation grants Defensive, Efficient, and Offensive Adaptation toggles
 * - Fly grants Afterburner
 * - Super Speed grants Speed Phase
 *
 * Detection methods:
 * 1. Power Pools: Use the `requires` field to detect parent-child relationships
 *    - Sub-powers have `available: -1` and `requires: "Pool.<PoolName>.<ParentPowerName>"`
 * 2. Archetype Powersets: Manual curation (no `requires` field in data)
 *    - Sub-powers have `available: -1` but no way to automatically link to parent
 */

import type { Power } from '@/types';

export interface GrantedPowerGroup {
  /** The parent power that grants sub-powers */
  parentPower: string;
  /** List of power names that are granted */
  grantedPowers: string[];
  /** Whether the granted powers are mutually exclusive (only one can be active) */
  mutuallyExclusive: boolean;
  /** Description of the granted powers group */
  description?: string;
}

// ============================================
// CURATED LIST - Archetype Powersets
// These require manual curation because they don't have a `requires` field
// ============================================

/**
 * Curated list of powers that grant sub-powers
 * Key is the parent power name, value describes the granted powers
 *
 * Note: Power pool granted powers (like Afterburner from Fly) are detected
 * automatically using the `requires` field in the power data.
 */
export const GRANTED_POWER_GROUPS: Record<string, GrantedPowerGroup> = {
  // ============================================
  // BIO ARMOR - Adaptation stances
  // ============================================
  'Adaptation': {
    parentPower: 'Adaptation',
    grantedPowers: ['Defensive Adaptation', 'Efficient Adaptation', 'Offensive Adaptation'],
    mutuallyExclusive: true,
    description: 'Bio Armor stances - only one can be active at a time',
  },

  // ============================================
  // DUAL PISTOLS - Ammunition types
  // ============================================
  'Swap Ammo': {
    parentPower: 'Swap Ammo',
    grantedPowers: ['Chemical Ammunition', 'Cryo Ammunition', 'Incendiary Ammunition'],
    mutuallyExclusive: true,
    description: 'Ammunition types - only one can be active at a time',
  },

  // ============================================
  // STAFF FIGHTING - Form stances
  // ============================================
  'Form of the Body': {
    parentPower: 'Form of the Body',
    grantedPowers: [],
    mutuallyExclusive: false,
  },
  'Form of the Mind': {
    parentPower: 'Form of the Mind',
    grantedPowers: [],
    mutuallyExclusive: false,
  },
  'Form of the Soul': {
    parentPower: 'Form of the Soul',
    grantedPowers: [],
    mutuallyExclusive: false,
  },

  // ============================================
  // POWER POOLS - Travel Powers
  // These are auto-detected but listed here as fallback/documentation
  // ============================================

  // Flight Pool
  'Fly': {
    parentPower: 'Fly',
    grantedPowers: ['Afterburner'],
    mutuallyExclusive: false,
    description: 'Afterburner boost available while Fly is active',
  },

  // Leaping Pool
  'Super Jump': {
    parentPower: 'Super Jump',
    grantedPowers: ['Double Jump'],
    mutuallyExclusive: false,
    description: 'Double Jump available while Super Jump is active',
  },
  // Also Long Jump grants Double Jump
  'Long Jump': {
    parentPower: 'Long Jump',
    grantedPowers: ['Double Jump'],
    mutuallyExclusive: false,
    description: 'Double Jump available while Long Jump is active',
  },

  // Speed Pool
  'Super Speed': {
    parentPower: 'Super Speed',
    grantedPowers: ['Speed Phase'],
    mutuallyExclusive: false,
    description: 'Speed Phase available while Super Speed is active',
  },

  // Sorcery Pool
  'Mystic Flight': {
    parentPower: 'Mystic Flight',
    grantedPowers: ['Translocation'],
    mutuallyExclusive: false,
    description: 'Translocation teleport available while Mystic Flight is active',
  },
  // Arcane Bolt grants Arcane Power
  'Arcane Bolt': {
    parentPower: 'Arcane Bolt',
    grantedPowers: ['Arcane Power'],
    mutuallyExclusive: false,
    description: 'Arcane Power buff after using Arcane Bolt',
  },

  // Experimentation Pool
  'Speed of Sound': {
    parentPower: 'Speed of Sound',
    grantedPowers: ['Jaunt'],
    mutuallyExclusive: false,
    description: 'Jaunt teleport available while Speed of Sound is active',
  },

  // Force of Will Pool
  'Mighty Leap': {
    parentPower: 'Mighty Leap',
    grantedPowers: ['Takeoff'],
    mutuallyExclusive: false,
    description: 'Takeoff ground pound available with Mighty Leap',
  },
};

// ============================================
// POWER POOL AUTO-DETECTION
// ============================================

/**
 * Parse a power's `requires` field to extract the parent power name
 * Format: "Pool.<PoolName>.<PowerName>" or more complex expressions
 *
 * @param requiresField - The requires field value (e.g., "Pool.Flight.Fly")
 * @returns The parent power name, or null if not a simple parent reference
 */
export function parseRequiresField(requiresField: string | undefined): string | null {
  if (!requiresField || requiresField === '') return null;

  // Simple case: single requirement like "Pool.Flight.Fly"
  // This indicates the power is granted by the parent power
  const simpleMatch = requiresField.match(/^Pool\.[\w_]+\.([\w_]+)$/);
  if (simpleMatch) {
    // Convert underscores to spaces (e.g., "Long_Jump" -> "Long Jump")
    return simpleMatch[1].replace(/_/g, ' ');
  }

  return null;
}

/**
 * Check if a power is a granted sub-power based on its data
 * Sub-powers have `available: -1` which means they can't be selected directly
 */
export function isAutoGrantedPower(power: Power): boolean {
  return power.available < 0;
}

/**
 * Build granted power relationships from power pool data
 * This automatically detects parent-child relationships using the `requires` field
 *
 * @param powers - Array of powers from a power pool
 * @returns Map of parent power name to granted power names
 */
export function buildGrantedPowerMap(powers: Power[]): Map<string, string[]> {
  const map = new Map<string, string[]>();

  for (const power of powers) {
    // Only process auto-granted powers (available: -1)
    if (!isAutoGrantedPower(power)) continue;

    // Parse the requires field to get parent power name
    const parentName = parseRequiresField(power.requires);
    if (!parentName) continue;

    // Add to map
    if (!map.has(parentName)) {
      map.set(parentName, []);
    }
    map.get(parentName)!.push(power.name);
  }

  return map;
}

/**
 * Get granted powers for a parent power, checking both curated list and requires field
 *
 * @param parentPowerName - The parent power name
 * @param powersetPowers - Optional array of powers from the powerset to check requires field
 * @returns Array of granted power names
 */
export function getGrantedPowersForParent(
  parentPowerName: string,
  powersetPowers?: Power[]
): string[] {
  // First check curated list
  const curated = GRANTED_POWER_GROUPS[parentPowerName];
  if (curated && curated.grantedPowers.length > 0) {
    return curated.grantedPowers;
  }

  // If we have powerset powers, check requires field
  if (powersetPowers) {
    const granted: string[] = [];
    for (const power of powersetPowers) {
      if (isAutoGrantedPower(power)) {
        const parent = parseRequiresField(power.requires);
        if (parent === parentPowerName) {
          granted.push(power.name);
        }
      }
    }
    if (granted.length > 0) {
      return granted;
    }
  }

  return [];
}

// ============================================
// CURATED LIST ACCESSOR FUNCTIONS
// ============================================

/**
 * Check if a power grants sub-powers (curated list only)
 */
export function hasGrantedPowers(powerName: string): boolean {
  return powerName in GRANTED_POWER_GROUPS &&
         GRANTED_POWER_GROUPS[powerName].grantedPowers.length > 0;
}

/**
 * Get the granted power group for a parent power
 */
export function getGrantedPowerGroup(powerName: string): GrantedPowerGroup | null {
  return GRANTED_POWER_GROUPS[powerName] || null;
}

/**
 * Get list of granted power names for a parent power
 */
export function getGrantedPowerNames(powerName: string): string[] {
  return GRANTED_POWER_GROUPS[powerName]?.grantedPowers || [];
}

/**
 * Check if granted powers are mutually exclusive
 */
export function arePowersMutuallyExclusive(powerName: string): boolean {
  return GRANTED_POWER_GROUPS[powerName]?.mutuallyExclusive ?? false;
}

/**
 * Get the parent power for a granted sub-power
 */
export function getParentPower(subPowerName: string): string | null {
  for (const [parentName, group] of Object.entries(GRANTED_POWER_GROUPS)) {
    if (group.grantedPowers.includes(subPowerName)) {
      return parentName;
    }
  }
  return null;
}

/**
 * Check if a power is a granted sub-power (curated list)
 */
export function isGrantedSubPower(powerName: string): boolean {
  return getParentPower(powerName) !== null;
}

/**
 * Get sibling granted powers (other powers in the same group)
 */
export function getSiblingPowers(subPowerName: string): string[] {
  const parentName = getParentPower(subPowerName);
  if (!parentName) return [];

  const group = GRANTED_POWER_GROUPS[parentName];
  return group.grantedPowers.filter(name => name !== subPowerName);
}

// ============================================
// SMART DETECTION (combines curated + auto)
// ============================================

/**
 * Smart check if a power grants sub-powers
 * Checks both curated list and power data (if provided)
 *
 * @param powerName - The power name to check
 * @param powersetPowers - Optional array of all powers in the powerset
 */
export function hasGrantedPowersSmart(powerName: string, powersetPowers?: Power[]): boolean {
  // Check curated list first
  if (hasGrantedPowers(powerName)) {
    return true;
  }

  // Check power data if provided
  if (powersetPowers) {
    for (const power of powersetPowers) {
      if (isAutoGrantedPower(power)) {
        const parent = parseRequiresField(power.requires);
        if (parent === powerName) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Smart get granted power group
 * Returns curated group if available, or builds one dynamically from power data
 *
 * @param powerName - The parent power name
 * @param powersetPowers - Optional array of all powers in the powerset
 */
export function getGrantedPowerGroupSmart(
  powerName: string,
  powersetPowers?: Power[]
): GrantedPowerGroup | null {
  // Check curated list first
  const curated = getGrantedPowerGroup(powerName);
  if (curated && curated.grantedPowers.length > 0) {
    return curated;
  }

  // Build from power data if provided
  if (powersetPowers) {
    const grantedPowers = getGrantedPowersForParent(powerName, powersetPowers);
    if (grantedPowers.length > 0) {
      return {
        parentPower: powerName,
        grantedPowers,
        mutuallyExclusive: false, // Can't determine from data, default to false
      };
    }
  }

  return null;
}
