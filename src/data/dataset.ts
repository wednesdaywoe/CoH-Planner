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

import type { ArchetypeId, ArchetypeRegistry, Archetype, Powerset } from '@/types';
import type { LegacyIOSetRegistry } from './io-sets';
import type { LegacyEpicPoolRegistry } from './epic-pools';
import type { IncarnateEffectsRaw } from './incarnate-effects';
import type { LegacyPowerPoolRegistry } from './power-pools';
// The canonical EnhancementCurvesData shape is authored by the SW3 converter
// (scripts/convert-enhancement-curves.cjs) into every dataset's generated
// module; the homecoming copy is imported type-only as the contract's
// reference declaration.
import type { EnhancementCurvesData } from './datasets/homecoming/generated/enhancement-curves';

export type { EnhancementCurvesData } from './datasets/homecoming/generated/enhancement-curves';

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
  /** Sibling powers (internalNames) that must ALSO be selected in the same
   *  pool/powerset for the grant to fire (conjunctive grants, e.g. Rebirth's
   *  Group Fly needs both Aerobatics and Fly). See the granted-powers modules. */
  alsoRequires?: readonly string[];
  damageConversion?: Record<string, { from: string; to: string }>;
}

/** Pet damage / effect data for damage calculation. */
export interface PetDamageEntry {
  damageType: string;
  scale: number;
  table: string;
  /** Sub-1.0 hit chance from the effect group (Trip Mine's third Fire template
   *  lands 50% of the time). Absent = guaranteed. Damage layers weight by this;
   *  summing at face value overstates the power. */
  chance?: number;
}

export interface PetEffect {
  type: string;
  magnitude?: number;
  chance?: number;
  scale?: number;
  table?: string;
  /** Ally-buff auras (buff-pets like Force Field Generator / Barrier Reef).
   *  A DefenseBuff/ResistanceBuff aura buffs every listed sub-type at the same
   *  scale/table; absorbAspect records the source aspect (Maximum/Absolute) for
   *  provenance. Folded into character totals when the summon's buff-pet toggle
   *  is enabled. See src/utils/calculations/buff-pet-auras.ts. */
  defenseTypes?: string[];
  resistanceTypes?: string[];
  absorbAspect?: string;
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
  /** This pet detonates ONCE: its own bundled Self_Destruct destroys it the
   *  moment it fires (trip mines, time bombs, seeker drones, Photon Seekers).
   *  Its attack's recharge is therefore not a repeat cadence — damage layers cap
   *  fires-per-spawn at 1 rather than dividing the summon window by cycle time.
   *  Stamped by `scripts/convert-pet-entities.cjs`. */
  oneShot?: boolean;
  upgradeTiers?: PetUpgradeTier[];
}

// ============================================
// INHERENT POWER RULES (per-server)
// ============================================

/**
 * Per-server overrides applied to the shared inherent powers list.
 *
 * The four Fitness powers (Swift, Hurdle, Health, Stamina) plus Brawl,
 * Sprint, and Rest are universal across servers, but availability
 * level and auto-granted enhancement slots vary:
 *
 *   - HC:      Fitness available at L1, no auto-granted slots.
 *   - Rebirth: Fitness available at L2, Health gets +1 slot at L8 / L16,
 *              Stamina +1 at L12 / L22.
 *   - Future servers will hook in here with their own variations.
 *
 * Keys are inherent power `internalName`s. Anything not listed inherits
 * the InherentPowerDef defaults baked into the shared list.
 */
export interface InherentRules {
  /**
   * `available` field override (0-indexed: -1 = L1, 0 = L1, 1 = L2, ...).
   * Use -1 for "always granted at L1" (the default for HC). Apply only
   * to powers whose grant level genuinely differs from the shared default.
   */
  availabilityOverrides: Record<string, number>;

  /**
   * Levels at which the named inherent power receives auto-granted
   * enhancement slots, in slot order. These slots come outside the
   * 67-slot user budget — they're freebies. Empty array (or absent
   * key) means no auto-grants.
   */
  autoGrantedSlotLevels: Record<string, readonly number[]>;

  /**
   * Inherent power `internalName`s that this server does NOT grant, so they
   * are filtered out of the shared inherent list. The shared list is sourced
   * from HC; servers that lack one of those powers (e.g. Rebirth has no
   * Prestige Athletic Run — it ships `Pool.Utility_Belt.Athletics` instead)
   * list it here. Absent/empty → nothing removed.
   */
  excludeInherents?: readonly string[];
}

// ============================================
// DATASET INTERFACE
// ============================================

export type DatasetId = 'homecoming' | 'rebirth' | 'thunderspy';

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
    getDefenseSoftcap: (
      levelDiff: number,
      contentMode?: 'standard' | 'incarnate',
    ) => number;
  };

  // Granted powers — parent → auto-granted children mappings (e.g.
  // Adaptation stances, Fly → Afterburner, Dual Pistols ammo swap).
  // Curated per server; sub-power names are server-specific data.
  grantedPowerGroups: Record<string, GrantedPowerGroup>;

  // Inherent power rules — per-server overrides for the universal inherent
  // powers (Swift, Hurdle, Health, Stamina, Brawl, Sprint, Rest, etc.).
  // Each server tunes Fitness differently: HC grants the four Fitness
  // powers at L1; Rebirth shifts them to L2 and adds auto-granted
  // enhancement slots at fixed levels. Future datasets (Thunderspy,
  // Unity, etc.) will plug in their own variations through this hook
  // rather than hard-coding each new wrinkle in the planner.
  inherentRules: InherentRules;

  // Pet entities — pet abilities + upgrade tiers used for pet damage
  // calculation (Mastermind summons, Voltaic Sentinel, Lore pets, etc.).
  petEntities: Record<string, PetEntity>;

  // Enhancement curves — ED thresholds, boost-type→schedule assignment,
  // per-boost-level strength curves, multi-aspect scale, relative-level
  // attenuation, and the exemplar magnitude handicaps, all generated from the
  // dataset's binary export (SOURCE-1 SW3). Read through
  // `src/data/enhancement-curves.ts`.
  enhancementCurves: EnhancementCurvesData;

  // Raw powerset registry (INCLUDES dormant sets). Lives on the dataset —
  // and therefore in this dataset's dynamic chunk — so only the active
  // server's ~13-20 MB of powerset data loads, instead of all three being
  // welded into the eager entry bundle by a static cross-dataset import.
  // The `powersets` facade filters dormant sets lazily per active dataset;
  // the raw is kept whole for a possible future "show unreleased sets" toggle.
  powersetsRaw: Record<string, Powerset>;

  // Raw (untransformed) IO-set registry. Same rationale as `powersetsRaw`:
  // lives on the dataset so only the active server's set data loads. The
  // `io-sets` facade transforms it to the runtime `IOSetRegistry` lazily.
  ioSetsRaw: LegacyIOSetRegistry;

  // Raw epic-pool registry. Same rationale as `powersetsRaw`/`ioSetsRaw`. The
  // per-dataset generated literal is structurally looser than the facade's
  // `LegacyEpicPoolRegistry`, so each dataset asserts the type at assignment
  // (the cast that formerly lived in the epic-pools facade).
  epicPoolsRaw: LegacyEpicPoolRegistry;

  // Raw incarnate effect tables (alpha/destiny/hybrid/interface/judgement/lore/
  // genesis + destiny timeline & boosts) for this server. Same rationale as the
  // other `*Raw` fields — keeps all three servers' incarnate data out of the
  // eager bundle. The `incarnate-effects` facade reads each slot on demand.
  incarnateEffectsRaw: IncarnateEffectsRaw;

  // Raw power-pool registry (INCLUDES dormant pools). Same rationale/shape as
  // `epicPoolsRaw`; the `power-pools` facade drops dormant pools and transforms
  // lazily per active dataset. The generated literal is structurally looser than
  // `LegacyPowerPoolRegistry`, so each dataset asserts the type at assignment.
  powerPoolsRaw: LegacyPowerPoolRegistry;

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
        case 'thunderspy':
          return (await import('./datasets/thunderspy')).default;
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
    { id: 'thunderspy', displayName: 'Thunderspy' },
  ];
}
