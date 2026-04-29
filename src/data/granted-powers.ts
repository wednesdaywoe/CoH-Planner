/**
 * Granted-powers facade.
 *
 * The actual GRANTED_POWER_GROUPS map (which parent powers auto-grant
 * which children — Adaptation stances, Fly → Afterburner, ammo swaps,
 * etc.) lives in the active dataset (e.g.
 * `src/data/datasets/homecoming/granted-powers.ts`). This file forwards
 * reads to whichever dataset is active, so existing imports of
 * `GRANTED_POWER_GROUPS` and the lookup helpers keep working.
 *
 * The `GrantedPowerGroup` interface is server-agnostic (just the shape
 * of an entry) and is re-exported from `./dataset.ts`.
 */

import { getActiveDataset } from './dataset';
import type { GrantedPowerGroup } from './dataset';

export type { GrantedPowerGroup };

const objectProxy = <T extends object>(getter: () => T): T =>
  new Proxy({} as T, {
    get: (_, key) => Reflect.get(getter(), key),
    has: (_, key) => Reflect.has(getter(), key),
    ownKeys: () => Reflect.ownKeys(getter()),
    getOwnPropertyDescriptor: (_, key) => Reflect.getOwnPropertyDescriptor(getter(), key),
  });

export const GRANTED_POWER_GROUPS: Record<string, GrantedPowerGroup> = objectProxy(
  () => getActiveDataset().grantedPowerGroups,
);

export function hasGrantedPowers(powerName: string): boolean {
  const groups = getActiveDataset().grantedPowerGroups;
  return powerName in groups && groups[powerName].grantedPowers.length > 0;
}

export function getGrantedPowerGroup(powerName: string): GrantedPowerGroup | null {
  return getActiveDataset().grantedPowerGroups[powerName] || null;
}

/**
 * Get the active damage type conversion for a powerset, if any.
 * Checks if any power in the build has an activeSubPower that maps to a
 * damageConversion. Returns { from, to } if a conversion is active, or
 * null if not.
 */
export function getActiveDamageConversion(
  powers: Array<{ internalName: string; activeSubPower?: string }>,
): { from: string; to: string } | null {
  const groups = getActiveDataset().grantedPowerGroups;
  for (const power of powers) {
    if (!power.activeSubPower) continue;
    const group = groups[power.internalName];
    if (!group?.damageConversion) continue;
    const conversion = group.damageConversion[power.activeSubPower];
    if (conversion) return conversion;
  }
  return null;
}
