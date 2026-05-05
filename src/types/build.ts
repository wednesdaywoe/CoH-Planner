/**
 * Build type definitions - represents a complete character build
 */

import type { Origin, ProgressionMode } from './common';
import type { Archetype, ArchetypeId } from './archetype';
import type { SelectedPower } from './power';
import type { IncarnateBuildState, CraftingChecklistState } from './incarnate';
import { createEmptyIncarnateBuildState, createEmptyCraftingChecklistState } from './incarnate';

// ============================================
// POWERSET SELECTION
// ============================================

export interface PowersetSelection {
  /** Powerset ID (e.g., "blaster/fire-blast") */
  id: string | null;
  /** Display name */
  name: string;
  /** Selected powers from this set */
  powers: SelectedPower[];
}

// ============================================
// POOL SELECTION
// ============================================

export interface PoolSelection {
  /** Pool ID (e.g., "speed") */
  id: string;
  /** Display name */
  name: string;
  /** Selected powers from this pool */
  powers: SelectedPower[];
}

// ============================================
// ACCOLADE
// ============================================

export interface Accolade {
  /** Accolade ID */
  id: string;
  /** Display name */
  name: string;
  /** Description */
  description: string;
  /** Icon filename */
  icon: string;
  /** Stat bonuses granted */
  bonuses: AccoladeBonus[];
  /** ID of the mutually exclusive counterpart (hero/villain pair) */
  excludes?: string;
}

export interface AccoladeBonus {
  stat: string;
  value: number;
}

// ============================================
// BUILD SETTINGS
// ============================================

export interface BuildSettings {
  /** Global IO level for calculations (10-53) */
  globalIOLevel: number;
  /** Character origin */
  origin: Origin;
}

// ============================================
// SET TRACKING
// ============================================

export interface SetTracking {
  /** Number of pieces slotted from this set */
  count: number;
  /** Which piece numbers are slotted */
  pieces: Set<number>;
}

// ============================================
// ARCHETYPE SELECTION (in build)
// ============================================

export interface ArchetypeSelection {
  /** Archetype ID */
  id: ArchetypeId | null;
  /** Display name */
  name: string;
  /** Full archetype stats (if selected) */
  stats: Archetype['stats'] | null;
  /** Inherent power info */
  inherent: Archetype['inherent'] | null;
}

// ============================================
// MAIN BUILD TYPE
// ============================================

export interface Build {
  /** Build name */
  name: string;

  /**
   * Identifier of the dataset (CoH server) this build targets.
   * Determines which powerset/AT/IO-set definitions are loaded for the
   * build. Older builds without this field migrate to `'homecoming'`.
   * See `src/data/dataset.ts` and `MULTI_DATASET_PLAN.md`.
   */
  serverId: 'homecoming' | 'rebirth';

  /** Selected archetype */
  archetype: ArchetypeSelection;

  /** Current character level (1-50) */
  level: number;

  /** Exemplar level (null = not exemplared) */
  exemplarLevel: number | null;

  /** Progression mode */
  progressionMode: ProgressionMode;

  /** Primary powerset */
  primary: PowersetSelection;

  /** Secondary powerset */
  secondary: PowersetSelection;

  /** Power pools (up to 4) */
  pools: PoolSelection[];

  /** Epic/Patron pool */
  epicPool: PoolSelection | null;

  /** Inherent powers */
  inherents: SelectedPower[];

  /** Selected accolades */
  accolades: Accolade[];

  /** Build settings */
  settings: BuildSettings;

  /** IO set tracking for bonus calculations */
  sets: Record<string, SetTracking>;

  /** Incarnate powers (level 50+) */
  incarnates: IncarnateBuildState;

  /** Incarnate crafting checklist progress */
  craftingChecklist: CraftingChecklistState;

  /** Shopping list: count of salvage items marked as acquired across all incarnate slots */
  shoppingListAcquired: Record<string, number>;

  /** Chronological order of slot additions for leveling mode.
   *  Each entry = one extra slot added (slot index 1+ on a power).
   *  Empty = respec mode (slot levels computed by power-pick order).
   *  `category` disambiguates powers with the same internalName across categories
   *  (e.g., "Conserve_Power" in both secondary and epic). Optional for backward compat. */
  slotOrder: { powerName: string; slotIndex: number; category?: string }[];

  /**
   * Active form for Kheldian (Peacebringer / Warshade) builds. Used by
   * the damage/info display to show the right variant of redirect-style
   * powers (Gleaming_Bolt → Bright_Nova_Bolt in Nova form, etc.). Has
   * no effect on slot allocation — slots stay on the human-form base
   * power regardless. Defaults to 'human' for non-Kheldian ATs.
   */
  kheldianForm?: 'human' | 'nova' | 'dwarf';
}

// ============================================
// DEFAULT BUILD FACTORY
// ============================================

export function createEmptyBuild(): Build {
  return {
    name: 'Untitled Build',
    serverId: 'homecoming',
    archetype: {
      id: null,
      name: '',
      stats: null,
      inherent: null,
    },
    level: 1,
    exemplarLevel: null,
    progressionMode: 'auto',
    primary: {
      id: null,
      name: '',
      powers: [],
    },
    secondary: {
      id: null,
      name: '',
      powers: [],
    },
    pools: [],
    epicPool: null,
    inherents: [],
    accolades: [],
    settings: {
      globalIOLevel: 50,
      origin: 'Natural',
    },
    sets: {},
    incarnates: createEmptyIncarnateBuildState(),
    craftingChecklist: createEmptyCraftingChecklistState(),
    shoppingListAcquired: {},
    slotOrder: [],
  };
}

// ============================================
// BUILD EXPORT FORMAT (for JSON serialization)
// ============================================

export interface BuildExportV1 {
  /** Schema version */
  version: 1;
  /** Full build data (legacy) */
  build: Omit<Build, 'sets'> & {
    /** Sets with pieces as array instead of Set */
    sets: Record<string, { count: number; pieces: number[] }>;
  };
  /** Optional metadata */
  meta?: BuildExportMeta;
}

export interface BuildExportV2 {
  /** Schema version */
  version: 2;
  /** Slim build data — identity + build-specific fields, power definitions stripped */
  build: SlimBuildData;
  /** Optional metadata */
  meta?: BuildExportMeta;
}

/** Shape of the slim build data in v2 exports */
export interface SlimBuildData {
  name: string;
  /** Dataset / server identifier. Optional for backward compat — older
   * exports predate multi-dataset support and default to `'homecoming'`. */
  serverId?: 'homecoming' | 'rebirth';
  archetype: { id: string | null; name: string };
  level: number;
  primary: { id: string | null; name: string; powers: { name: string; level: number; slots: unknown[] }[] };
  secondary: { id: string | null; name: string; powers: { name: string; level: number; slots: unknown[] }[] };
  pools: { id: string; name: string; powers: { name: string; level: number; slots: unknown[] }[] }[];
  epicPool: { id: string; name: string; powers: { name: string; level: number; slots: unknown[] }[] } | null;
  [key: string]: unknown;
}

export interface BuildExportMeta {
  exportedAt: string;
  authorName?: string;
  authorServer?: string;
}

/** Union of all export versions */
export type BuildExport = BuildExportV1 | BuildExportV2;
