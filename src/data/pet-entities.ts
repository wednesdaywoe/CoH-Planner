/**
 * Pet entities facade.
 *
 * The 24K-line PET_ENTITIES record (pet abilities + upgrade tiers used
 * for pet damage calculation: Mastermind summons, Voltaic Sentinel,
 * Lore pets, etc.) lives in the active dataset (e.g.
 * `src/data/datasets/homecoming/pet-entities.ts`). This file re-exports
 * the type definitions and forwards data reads through the active
 * dataset.
 */

import { getActiveDataset } from './dataset';
import type {
  PetDamageEntry,
  PetEffect,
  PetAbility,
  PetUpgradeTier,
  PetEntity,
} from './dataset';

export type { PetDamageEntry, PetEffect, PetAbility, PetUpgradeTier, PetEntity };

const objectProxy = <T extends object>(getter: () => T): T =>
  new Proxy({} as T, {
    get: (_, key) => Reflect.get(getter(), key),
    has: (_, key) => Reflect.has(getter(), key),
    ownKeys: () => Reflect.ownKeys(getter()),
    getOwnPropertyDescriptor: (_, key) => Reflect.getOwnPropertyDescriptor(getter(), key),
  });

export const PET_ENTITIES: Record<string, PetEntity> = objectProxy(
  () => getActiveDataset().petEntities,
);

/**
 * Look up a pet entity, tolerating an un-prefixed name. Some powers' EntCreate
 * P-hash resolves (via `priority_list`) to a bare entity name like "Sleet" /
 * "Liquefy" whose actual PET_ENTITIES key is `Pets_Sleet` / `Pets_Liquefy`.
 * Falls back to the `Pets_`-prefixed key so those summons resolve to their real
 * (complete) pet entity instead of showing nothing. Returns undefined if neither
 * exists (e.g. a generic shell like "Meteor" handled via `resolvedEntities`).
 */
export function getPetEntity(name: string | undefined): PetEntity | undefined {
  if (!name) return undefined;
  return PET_ENTITIES[name] ?? PET_ENTITIES[`Pets_${name}`];
}
