/**
 * Archetype data facade.
 *
 * The actual archetype registry and ID lists live in the active dataset
 * (e.g. `src/data/datasets/homecoming/archetypes.ts`). This file is a
 * thin facade that forwards reads to whichever dataset is currently
 * active, so existing imports from `@/data/archetypes` continue to work
 * after the multi-dataset migration.
 *
 * `ARCHETYPES` and the ID-list constants are exposed as Proxies so that
 * indexed reads (`ARCHETYPES[id]`, `EPIC_ARCHETYPE_IDS.includes(id)`)
 * route through the active dataset at call time.
 */

import type { Archetype, ArchetypeId, ArchetypeRegistry } from '@/types';
import { getActiveDataset } from './dataset';

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

const arrayProxy = <T>(getter: () => readonly T[]): T[] =>
  new Proxy([] as unknown as T[], {
    get: (_, key) => Reflect.get(getter(), key),
    has: (_, key) => Reflect.has(getter(), key),
    ownKeys: () => Reflect.ownKeys(getter()),
    getOwnPropertyDescriptor: (_, key) => Reflect.getOwnPropertyDescriptor(getter(), key),
  });

// ============================================
// PUBLIC EXPORTS
// ============================================

export const ARCHETYPES: ArchetypeRegistry = objectProxy<ArchetypeRegistry>(
  () => getActiveDataset().archetypes.registry,
);

export const EPIC_ARCHETYPE_IDS: ArchetypeId[] = arrayProxy<ArchetypeId>(
  () => getActiveDataset().archetypes.epicIds,
);

export const STANDARD_ARCHETYPE_IDS: ArchetypeId[] = arrayProxy<ArchetypeId>(
  () => getActiveDataset().archetypes.standardIds,
);

export function getArchetype(id: ArchetypeId): Archetype | undefined {
  return getActiveDataset().archetypes.registry[id];
}

export function getArchetypeIds(): ArchetypeId[] {
  return Object.keys(getActiveDataset().archetypes.registry) as ArchetypeId[];
}

export function getArchetypesByFaction(faction: 'hero' | 'villain'): Archetype[] {
  return Object.values(getActiveDataset().archetypes.registry).filter((at) => at.side === faction);
}

export function isEpicArchetype(id: ArchetypeId): boolean {
  return getActiveDataset().archetypes.epicIds.includes(id);
}

export function getEpicArchetypes(): Archetype[] {
  const ds = getActiveDataset();
  return ds.archetypes.epicIds.map((id) => ds.archetypes.registry[id]);
}

export function getStandardArchetypes(): Archetype[] {
  const ds = getActiveDataset();
  return ds.archetypes.standardIds.map((id) => ds.archetypes.registry[id]);
}
