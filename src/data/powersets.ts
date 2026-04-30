/**
 * Powerset data and accessor functions
 *
 * Routes lookups through the active dataset's powerset registry. Each
 * dataset folder under `src/data/datasets/<id>/powersets/` ships its own
 * generated `index.ts` with a `MODULAR_POWERSETS` map. HC's tree still
 * lives at the legacy `src/data/powersets/` path until the deferred
 * Stage B migration moves it under `datasets/homecoming/`.
 */

import type { Powerset, Power } from '@/types';
import { MODULAR_POWERSETS as HC_POWERSETS } from './powersets/index';
import { MODULAR_POWERSETS as REBIRTH_POWERSETS } from './datasets/rebirth/powersets/index';
import { getActiveDataset } from './dataset';

// ============================================
// POWERSET REGISTRY TYPE
// ============================================

export type PowersetRegistry = Record<string, Powerset>;

// ============================================
// POWERSET REGISTRY
// ============================================

function getRegistry(): PowersetRegistry {
  switch (getActiveDataset().id) {
    case 'rebirth':
      return REBIRTH_POWERSETS;
    case 'homecoming':
    default:
      return HC_POWERSETS;
  }
}

/**
 * Get all powersets
 */
export function getAllPowersets(): PowersetRegistry {
  return getRegistry();
}

// ============================================
// ACCESSOR FUNCTIONS
// ============================================

/**
 * Get a powerset by ID (e.g., "blaster/fire-blast")
 */
export function getPowerset(id: string): Powerset | undefined {
  return getRegistry()[id];
}

/**
 * Get all powersets for an archetype category (e.g., "blaster")
 */
export function getPowersetsForArchetype(archetypeId: string): Powerset[] {
  const prefix = `${archetypeId}/`;
  return Object.entries(getRegistry())
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

