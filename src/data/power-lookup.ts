/**
 * Unified power lookup - resolves any power by powerSet + name,
 * checking all categories (primary/secondary, pools, epic, inherent).
 */

import type { Power } from '@/types';
import { getPower, getPowerset } from './powersets';
import { getPowerPool } from './power-pools';
import { getEpicPool } from './epic-pools';
import { getInherentPowerDef } from './levels';

export interface PowerLookupResult {
  power: Power;
  powersetName: string;
  isInherent: boolean;
}

/**
 * Look up any power by its powerSet ID and name.
 * Checks primary/secondary powersets, power pools, epic pools, and static inherent powers.
 * Does NOT check build-specific data (e.g., dynamically-created archetype inherents).
 */
export function lookupPower(powerSetId: string, powerName: string): PowerLookupResult | undefined {
  // 1. Primary/secondary powerset
  const power = getPower(powerSetId, powerName);
  if (power) {
    const powerset = getPowerset(powerSetId);
    return { power, powersetName: powerset?.name || powerSetId, isInherent: false };
  }

  // 2. Power pool
  const pool = getPowerPool(powerSetId);
  if (pool) {
    const poolPower = pool.powers.find(p => p.name === powerName);
    if (poolPower) return { power: poolPower, powersetName: pool.name, isInherent: false };
  }

  // 3. Epic/patron pool
  const epicPool = getEpicPool(powerSetId);
  if (epicPool) {
    const epicPower = epicPool.powers.find(p => p.name === powerName);
    if (epicPower) {
      return { power: epicPower, powersetName: epicPool.displayName || epicPool.name, isInherent: false };
    }
  }

  // 4. Inherent power (static definitions)
  if (powerSetId === 'Inherent') {
    const inherentDef = getInherentPowerDef(powerName);
    if (inherentDef) return { power: inherentDef, powersetName: 'Inherent', isInherent: true };
  }

  return undefined;
}
