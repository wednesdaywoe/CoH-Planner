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
