/**
 * Build type definitions - represents a complete character build
 */

import type { Origin, ProgressionMode } from './common';
import type { Archetype, ArchetypeId } from './archetype';
import type { SelectedPower } from './power';
import type { IncarnateBuildState } from './incarnate';
import { createEmptyIncarnateBuildState } from './incarnate';

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
}

// ============================================
// DEFAULT BUILD FACTORY
// ============================================

export function createEmptyBuild(): Build {
  return {
    name: 'Untitled Build',
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
  };
}

// ============================================
// BUILD EXPORT FORMAT (for JSON serialization)
// ============================================

export interface BuildExport {
  /** Schema version for future compatibility */
  version: number;
  /** Build data */
  build: Omit<Build, 'sets'> & {
    /** Sets with pieces as array instead of Set */
    sets: Record<string, { count: number; pieces: number[] }>;
  };
  /** Optional metadata */
  meta?: {
    exportedAt: string;
    authorName?: string;
    authorServer?: string;
  };
}
