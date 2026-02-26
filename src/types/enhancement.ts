/**
 * Enhancement type definitions
 */

import type {
  EnhancementStatType,
  EnhancementTier,
  Origin,
  IOSetRarity,
} from './common';

// ============================================
// ENHANCEMENT TYPE DISCRIMINATOR
// ============================================

export type EnhancementType =
  | 'io-set'      // IO set enhancement
  | 'io-generic'  // Generic (common) IO
  | 'special'     // Hamidon, Titan, etc.
  | 'origin';     // SO/DO/TO

// ============================================
// BASE ENHANCEMENT
// ============================================

export interface BaseEnhancement {
  /** Discriminator for enhancement type */
  type: EnhancementType;
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Icon filename */
  icon: string;
  /** Level of the enhancement (if applicable) */
  level?: number;
  /** Whether it's attuned (level-agnostic) */
  attuned?: boolean;
  /** Level boost from Enhancement Boosters (0-5, each adds 5% multiplier) */
  boost?: number;
  /** Timestamp when added (for ordering) */
  addedAt?: number;
}

// ============================================
// IO SET ENHANCEMENT
// ============================================

export interface IOSetEnhancement extends BaseEnhancement {
  type: 'io-set';
  /** ID of the set this belongs to */
  setId: string;
  /** Name of the set */
  setName: string;
  /** Piece number within the set (1-6) */
  pieceNum: number;
  /** Enhancement aspects (Damage, Accuracy, etc.) */
  aspects: EnhancementStatType[];
  /** Whether this is a proc (special effect, not stat boost) */
  isProc: boolean;
  /** Whether this piece is unique (only 1 per build) */
  isUnique: boolean;
}

// ============================================
// GENERIC IO ENHANCEMENT
// ============================================

export interface GenericIOEnhancement extends BaseEnhancement {
  type: 'io-generic';
  /** The stat this enhances */
  stat: EnhancementStatType;
  /** Enhancement value at current level */
  value: number;
}

// ============================================
// SPECIAL ENHANCEMENT (Hamidon, Titan, etc.)
// ============================================

export interface SpecialEnhancement extends BaseEnhancement {
  type: 'special';
  /** Category (hamidon, titan, hydra, etc.) */
  category: 'hamidon' | 'titan' | 'hydra' | 'd-sync';
  /** Aspects this enhances, each with its own value (percentage) */
  aspects: Array<{ stat: EnhancementStatType; value: number }>;
}

// ============================================
// ORIGIN ENHANCEMENT (SO/DO/TO)
// ============================================

export interface OriginEnhancement extends BaseEnhancement {
  type: 'origin';
  /** TO, DO, or SO */
  tier: EnhancementTier;
  /** Origin requirement (for DO/SO) */
  origin?: Origin;
  /** Secondary origin (for DO) */
  secondaryOrigin?: Origin;
  /** The stat this enhances */
  stat: EnhancementStatType;
  /** Enhancement value */
  value: number;
}

// ============================================
// UNION TYPE FOR ALL ENHANCEMENTS
// ============================================

export type Enhancement =
  | IOSetEnhancement
  | GenericIOEnhancement
  | SpecialEnhancement
  | OriginEnhancement;

// ============================================
// IO SET DEFINITION
// ============================================

export interface SetBonusEffect {
  /** Stat affected */
  stat: string;
  /** Bonus value */
  value: number;
  /** Description text */
  desc: string;
  /** True if this effect only applies in PvP zones */
  pvp?: boolean;
}

export interface SetBonus {
  /** Number of pieces required */
  pieces: number;
  /** Effects granted at this level */
  effects: SetBonusEffect[];
}

export interface IOSetPiece {
  /** Piece number (1-6) */
  num: number;
  /** Piece name */
  name: string;
  /** Aspects this piece enhances */
  aspects: string[];
  /** Is this a proc? */
  proc: boolean;
  /** Is this unique? */
  unique: boolean;
}

export interface IOSet {
  /** Internal ID */
  id?: string;
  /** Display name */
  name: string;
  /** Rarity/category */
  category: IOSetRarity;
  /** Power type this set enhances (e.g., "Ranged Damage", "Stuns") */
  type: string;
  /** Minimum level */
  minLevel: number;
  /** Maximum level */
  maxLevel: number;
  /** Set bonuses by piece count */
  bonuses: SetBonus[];
  /** Individual pieces in the set */
  pieces: IOSetPiece[];
  /** Icon filename */
  icon: string;
}

// ============================================
// IO SET REGISTRY
// ============================================

export type IOSetRegistry = Record<string, IOSet>;

// ============================================
// HAMIDON ENHANCEMENT DEFINITION
// ============================================

export interface SpecialEnhancementDef {
  name: string;
  aspects: Array<{ stat: string; value: number }>;
}

/** @deprecated Use SpecialEnhancementDef */
export type HamidonEnhancementDef = SpecialEnhancementDef;
/** @deprecated Use SpecialEnhancementRegistry */
export type HamidonRegistry = Record<string, SpecialEnhancementDef>;

export type SpecialEnhancementRegistry = Record<string, SpecialEnhancementDef>;
