/**
 * Powerset data and accessor functions
 *
 * Routes lookups through the active dataset's powerset registry. Each
 * dataset folder under `src/data/datasets/<id>/powersets/` ships its own
 * generated `index.ts` with a `MODULAR_POWERSETS` map.
 */

import type { Powerset, Power } from '@/types';
import { getActiveDataset } from './dataset';
import type { DatasetId } from './dataset';

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

// Lazy-load + cache the dormant-filtered registry per dataset. The raw
// registry (with dormant sets) rides in the active dataset's dynamic chunk
// via `getActiveDataset().powersetsRaw`, so only the active server's powerset
// data is downloaded; the filter runs once per dataset on first access.
const _liveRegistryCache = new Map<DatasetId, PowersetRegistry>();

function getRegistry(): PowersetRegistry {
  const ds = getActiveDataset();
  let live = _liveRegistryCache.get(ds.id);
  if (!live) {
    live = withoutDormant(ds.powersetsRaw);
    _liveRegistryCache.set(ds.id, live);
  }
  return live;
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

