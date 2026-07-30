/**
 * Archetype Modifier Table facade.
 *
 * The actual table data and helper implementations live in the active
 * dataset (e.g. `src/data/datasets/homecoming/at-tables.ts`). This file
 * is a thin facade that forwards reads to whichever dataset is currently
 * active, so existing imports from `@/data/at-tables` continue to work
 * after the multi-dataset migration.
 *
 * `AT_TABLES` / `PET_TABLES` are Proxies so that indexed reads
 * (`AT_TABLES[archetypeId]`, `archetypeId in AT_TABLES`) route through
 * the active dataset at call time.
 */

import { getActiveDataset } from './dataset';
import type { ATTableData, PetTableData } from './dataset';

export type { ATTableData, PetTableData };

// ============================================
// PROXY HELPERS
// ============================================

const objectProxy = <T extends object>(getter: () => T): T =>
  new Proxy({} as T, {
    get: (_, key) => Reflect.get(getter(), key),
    has: (_, key) => Reflect.has(getter(), key),
    ownKeys: () => Reflect.ownKeys(getter()),
    getOwnPropertyDescriptor: (_, key) => Reflect.getOwnPropertyDescriptor(getter(), key),
  });

// ============================================
// PUBLIC EXPORTS
// ============================================

export const AT_TABLES: Record<string, ATTableData> = objectProxy(
  () => getActiveDataset().atTables.archetypes,
);

export const PET_TABLES: Record<string, PetTableData> = objectProxy(
  () => getActiveDataset().atTables.pets,
);

export function getTableValue(archetype: string, tableName: string, level: number): number | undefined {
  return getActiveDataset().getTableValue(archetype, tableName, level);
}

/**
 * The archetype's RechargeTime `ClampStrength` interval, or undefined when the
 * active dataset's export didn't carry one. Read from the same per-class export
 * the tables come from, so it follows the active dataset.
 *
 * Consumers must treat undefined as "no ceiling to measure against" and stand
 * aside, never substitute a literal — a hardcoded stand-in for this exact number
 * is what put unfillable perma rings on ~80 powers per fork (see perma.ts).
 */
export function getRechargeBounds(
  archetype: string | null | undefined,
): { floor: number; cap: number } | undefined {
  if (!archetype) return undefined;
  return getActiveDataset().atTables.archetypes[archetype]?.rechargeBounds;
}

export function calculateEffectValue(
  archetype: string,
  tableName: string,
  scale: number,
  level: number = 50,
): number | undefined {
  return getActiveDataset().calculateEffectValue(archetype, tableName, scale, level);
}

export function calculateIncarnateDamage(
  scale: number,
  tableName: string,
  archetype: string,
  level: number = 50,
): number | null {
  return getActiveDataset().calculateIncarnateDamage(scale, tableName, archetype, level);
}

export function getPetTableValue(petClass: string, tableName: string, level: number): number | undefined {
  return getActiveDataset().getPetTableValue(petClass, tableName, level);
}
