/**
 * Powerset data and accessor functions
 *
 * Routes lookups through the active dataset's powerset registry. Each
 * dataset folder under `src/data/datasets/<id>/powersets/` ships its own
 * generated `index.ts` with a `MODULAR_POWERSETS` map.
 */

import type { Powerset, Power } from '@/types';
import { MODULAR_POWERSETS as HC_POWERSETS_RAW } from './datasets/homecoming/powersets/index';
import { MODULAR_POWERSETS as REBIRTH_POWERSETS } from './datasets/rebirth/powersets/index';
import { MODULAR_POWERSETS as THUNDERSPY_POWERSETS } from './datasets/thunderspy/powersets/index';
import { getActiveDataset } from './dataset';

// ============================================
// POWERSET REGISTRY TYPE
// ============================================

export type PowersetRegistry = Record<string, Powerset>;

// ============================================
// POWERSET REGISTRY
// ============================================

// Dormant sets — present in a server's bins but not released to players (their
// powers are locked behind a dev-only `accesslevel > 0` gate) — are flagged
// `dormant: true` at convert time (see `deriveDormant` in
// scripts/convert-powerset.cjs) and dropped from every dataset's pickable
// registry here. This replaces the former hand-maintained HC_HIDDEN_POWERSETS
// list (which hid Wind Control on HC): the flag is derived per-dataset from the
// bins, so it stays correct automatically as servers finish sets. Filtering at
// runtime (not by deleting generated output) keeps the data available for a
// possible future "show unreleased sets" toggle and survives regen.
function withoutDormant(registry: PowersetRegistry): PowersetRegistry {
  const filtered: PowersetRegistry = {};
  for (const [id, ps] of Object.entries(registry)) {
    if (!ps.dormant) filtered[id] = ps;
  }
  return filtered;
}

const HC_POWERSETS = withoutDormant(HC_POWERSETS_RAW);
const REBIRTH_POWERSETS_LIVE = withoutDormant(REBIRTH_POWERSETS);
const THUNDERSPY_POWERSETS_LIVE = withoutDormant(THUNDERSPY_POWERSETS);

function getRegistry(): PowersetRegistry {
  switch (getActiveDataset().id) {
    case 'rebirth':
      return REBIRTH_POWERSETS_LIVE;
    case 'thunderspy':
      return THUNDERSPY_POWERSETS_LIVE;
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

