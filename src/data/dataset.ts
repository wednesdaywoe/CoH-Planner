/**
 * Dataset plumbing — the single point of indirection that lets the planner
 * support multiple CoH server datasets (Homecoming, Rebirth, …).
 *
 * Each dataset folder under `src/data/datasets/<id>/` ships a `Dataset`
 * object as its default export. Exactly one dataset is "active" at a
 * time. App boot calls `loadDataset()` to choose the active one based on
 * the current build's `serverId`; data files at `src/data/*.ts` are thin
 * facades that read from `getActiveDataset()`, so every consumer keeps
 * its existing import paths and the active dataset transparently swaps
 * at runtime.
 *
 * See MULTI_DATASET_PLAN.md for the broader plan.
 */

import type { ArchetypeId, ArchetypeRegistry, Archetype } from '@/types';

// ============================================
// DATA SHAPES SHARED ACROSS DATASETS
// ============================================
// Defined here (not in a per-dataset file) because they're part of the
// `Dataset` interface contract — every dataset implementation must satisfy
// the same shape, and consumer code reads through that shape.

export interface ATTableData {
  primaryCategory: string;
  secondaryCategory: string;
  tables: Record<string, number[]>;
}

export interface PetTableData {
  tables: Record<string, number[]>;
}

/** Shape for granted-power groups (parent → auto-granted children). */
export interface GrantedPowerGroup {
  parentPower: string;
  grantedPowers: string[];
  mutuallyExclusive: boolean;
  description?: string;
  slottable?: boolean;
  damageConversion?: Record<string, { from: string; to: string }>;
}

/** Pet damage / effect data for damage calculation. */
export interface PetDamageEntry {
  damageType: string;
  scale: number;
  table: string;
}

export interface PetEffect {
  type: string;
  magnitude?: number;
  chance?: number;
  scale?: number;
  table?: string;
}

export interface PetAbility {
  name: string;
  displayName: string;
  type: 'Click' | 'Auto' | 'Toggle';
  damage: PetDamageEntry[];
  effects?: PetEffect[];
  recharge: number;
  castTime: number;
  activatePeriod?: number;
  effectArea: string;
  range?: number;
  radius?: number;
  maxTargets?: number;
  attackTypes?: string[];
  rechargeUnaffected?: boolean;
}

export interface PetUpgradeTier {
  tier: number;
  abilities: PetAbility[];
}

export interface PetEntity {
  name: string;
  displayName: string;
  characterClass: string;
  commandable: boolean;
  copyCreatorMods: boolean;
  abilities: PetAbility[];
  upgradeTiers?: PetUpgradeTier[];
}

// ============================================
// DATASET INTERFACE
// ============================================

export type DatasetId = 'homecoming' | 'rebirth';

export interface Dataset {
  id: DatasetId;
  displayName: string;

  archetypes: {
    registry: ArchetypeRegistry;
    epicIds: readonly ArchetypeId[];
    standardIds: readonly ArchetypeId[];
  };

  atTables: {
    archetypes: Record<string, ATTableData>;
    pets: Record<string, PetTableData>;
  };

  // Purple patch — combat scaling tables for level differences (damage,
  // base ToHit). Scoped to the dataset because values are tunable per
  // server even though HC's are the de-facto standard.
  purplePatch: {
    getBaseToHit: (levelDiff: number) => number;
    getCombatModifier: (levelDiff: number) => number;
  };

  // Granted powers — parent → auto-granted children mappings (e.g.
  // Adaptation stances, Fly → Afterburner, Dual Pistols ammo swap).
  // Curated per server; sub-power names are server-specific data.
  grantedPowerGroups: Record<string, GrantedPowerGroup>;

  // Pet entities — pet abilities + upgrade tiers used for pet damage
  // calculation (Mastermind summons, Voltaic Sentinel, Lore pets, etc.).
  petEntities: Record<string, PetEntity>;

  // Helpers closed over this dataset's own data records.
  getTableValue: (archetype: string, tableName: string, level: number) => number | undefined;
  calculateEffectValue: (archetype: string, tableName: string, scale: number, level?: number) => number | undefined;
  calculateIncarnateDamage: (scale: number, tableName: string, archetype: string, level?: number) => number | null;
  getPetTableValue: (petClass: string, tableName: string, level: number) => number | undefined;

  getArchetype: (id: ArchetypeId) => Archetype | undefined;
}

// ============================================
// ACTIVE DATASET STATE
// ============================================

let active: Dataset | null = null;
const cache = new Map<DatasetId, Promise<Dataset>>();

/**
 * Synchronous accessor used by every data-layer facade. Throws if no
 * dataset has been loaded yet — app boot must `await loadDataset(...)`
 * before mounting the React tree.
 */
export function getActiveDataset(): Dataset {
  if (!active) {
    throw new Error(
      'No dataset loaded. Call `await loadDataset(id)` before any data access ' +
      '(e.g. before mounting the React tree).',
    );
  }
  return active;
}

/**
 * Sanity-check archetype data for known footgun patterns. Runs once per
 * dataset on first load. Throws (in dev) or warns (in prod) so the bug
 * surfaces early rather than as a baffling user-facing symptom.
 *
 * Currently checks:
 * - **Branch primary === secondary**: a branch whose `secondarySet` ID
 *   equals its `primarySet` is always a bug. It surfaces in the UI as
 *   "the secondary picker shows primary powers" — exactly what
 *   triggered the 2026-05-05 Rebirth Arachnos Soldier bug
 *   ([REBIRTH_ARACHNOS_SOLDIER_BUG.md](../../REBIRTH_ARACHNOS_SOLDIER_BUG.md)).
 *   Almost always means the secondary powerset wasn't extracted and
 *   was filled in with placeholder data.
 */
function validateDataset(ds: Dataset): void {
  const errors: string[] = [];
  for (const [atId, at] of Object.entries(ds.archetypes.registry)) {
    if (!at.branches) continue;
    for (const [branchId, branch] of Object.entries(at.branches)) {
      if (!branch) continue;
      if (branch.primarySet === branch.secondarySet) {
        errors.push(
          `Archetype "${atId}" branch "${branchId}" has primarySet === secondarySet ` +
          `("${branch.primarySet}"). This is always a bug — the secondary powerset ` +
          `is likely missing from extracted data.`,
        );
      }
    }
  }
  if (errors.length === 0) return;
  const message = `Dataset "${ds.id}" failed validation:\n  - ${errors.join('\n  - ')}`;
  if (import.meta.env?.DEV) {
    throw new Error(message);
  }
  // In prod, log loudly but don't crash the app — the user can still
  // use ATs that aren't affected.
  console.error(message);
}

/**
 * Lazy-loads a dataset (each lives in its own chunk via dynamic import)
 * and sets it as active. Idempotent per id — repeated calls return the
 * cached promise.
 */
export async function loadDataset(id: DatasetId): Promise<Dataset> {
  let promise = cache.get(id);
  if (!promise) {
    promise = (async () => {
      switch (id) {
        case 'homecoming':
          return (await import('./datasets/homecoming')).default;
        case 'rebirth':
          return (await import('./datasets/rebirth')).default;
        default: {
          const _exhaustive: never = id;
          throw new Error(`Unknown dataset: ${_exhaustive}`);
        }
      }
    })();
    cache.set(id, promise);
  }
  const ds = await promise;
  validateDataset(ds);
  active = ds;
  return ds;
}

/**
 * Static metadata for all known datasets. Does not force any dataset to
 * load — safe to call from boot/UI code that needs to render a picker
 * before committing to a dataset.
 */
export function getAllDatasetMetadata(): Array<{ id: DatasetId; displayName: string }> {
  return [
    { id: 'homecoming', displayName: 'Homecoming' },
    { id: 'rebirth', displayName: 'Rebirth' },
  ];
}
