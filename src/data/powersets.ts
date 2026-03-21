/**
 * Powerset data and accessor functions
 *
 * All powersets (362 total: 348 standard + 14 Epic AT) are loaded from the modular format.
 */

import type { Powerset, Power } from '@/types';
import { MODULAR_POWERSETS } from './powersets/index';

// ============================================
// POWERSET REGISTRY TYPE
// ============================================

export type PowersetRegistry = Record<string, Powerset>;

// ============================================
// POWERSET REGISTRY
// ============================================

// All powersets are now in modular format
const _powersets: PowersetRegistry = MODULAR_POWERSETS;

/**
 * Get all powersets
 */
export function getAllPowersets(): PowersetRegistry {
  return _powersets;
}

// ============================================
// ACCESSOR FUNCTIONS
// ============================================

/**
 * Get a powerset by ID (e.g., "blaster/fire-blast")
 */
export function getPowerset(id: string): Powerset | undefined {
  return _powersets[id];
}

/**
 * Get all powersets for an archetype category (e.g., "blaster")
 */
export function getPowersetsForArchetype(archetypeId: string): Powerset[] {
  const prefix = `${archetypeId}/`;
  return Object.entries(_powersets)
    .filter(([id]) => id.startsWith(prefix))
    .map(([, powerset]) => powerset);
}

/**
 * Get a specific power from a powerset
 */
export function getPower(powersetId: string, powerName: string): Power | undefined {
  const powerset = getPowerset(powersetId);
  return powerset?.powers.find((p) => p.internalName === powerName);
}

/**
 * Get powers available at or before a given level
 * Note: available is 0-indexed (available=0 means level 1)
 */
export function getPowersAvailableAtLevel(powersetId: string, level: number): Power[] {
  const powerset = getPowerset(powersetId);
  if (!powerset) return [];
  return powerset.powers.filter((p) => p.available < level && p.available >= 0);
}

// ============================================
// POWER ICON UTILITIES
// ============================================

