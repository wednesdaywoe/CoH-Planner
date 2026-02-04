/**
 * Archetype type definitions
 */

import type { Faction } from './common';

// ============================================
// DAMAGE MODIFIERS
// ============================================

export interface DamageModifiers {
  melee: number;
  ranged: number;
  aoe: number;
}

// ============================================
// ARCHETYPE STATS
// ============================================

export interface ArchetypeStats {
  /** Base HP at level 1 */
  baseHP: number;
  /** Maximum HP at level 50 */
  maxHP: number;
  /** Base endurance pool */
  baseEndurance: number;
  /** Base endurance recovery rate */
  baseRecovery: number;
  /** Base threat level (aggro generation) */
  baseThreat: number;
  /** Damage modifiers by attack type */
  damageModifier: DamageModifiers;
  /** Buff/debuff effectiveness modifier */
  buffDebuffModifier: number;
}

// ============================================
// INHERENT POWER
// ============================================

export interface InherentPower {
  /** Display name of the inherent */
  name: string;
  /** Description of what it does */
  description: string;
}

// ============================================
// ARCHETYPE BRANCHES (For Epic ATs like Arachnos)
// ============================================

export interface ArchetypeBranch {
  /** Display name of the branch (e.g., "Bane Spider", "Fortunata") */
  name: string;
  /** Level at which this branch becomes available */
  level: number;
  /** Additional primary powerset for this branch (optional) */
  primarySet?: string;
  /** Additional secondary powerset for this branch */
  secondarySet: string;
}

export type ArchetypeBranchId =
  | 'bane-spider'
  | 'crab-spider'
  | 'night-widow'
  | 'fortunata';

// ============================================
// ARCHETYPE DEFINITION
// ============================================

export interface Archetype {
  /** Display name (e.g., "Blaster") */
  name: string;
  /** Hero or villain */
  side: Faction;
  /** Short description of the archetype's role */
  description: string;
  /** The archetype's inherent power */
  inherent: InherentPower;
  /** Base stats and modifiers */
  stats: ArchetypeStats;
  /** Available primary powerset IDs (e.g., "blaster/fire-blast") */
  primarySets: string[];
  /** Available secondary powerset IDs */
  secondarySets: string[];
  /** Branching specializations (for Arachnos Epic ATs) */
  branches?: Partial<Record<ArchetypeBranchId, ArchetypeBranch>>;
}

// ============================================
// ARCHETYPE ID
// ============================================

export type ArchetypeId =
  // Heroes
  | 'blaster'
  | 'controller'
  | 'defender'
  | 'scrapper'
  | 'tanker'
  | 'sentinel'
  // Villains
  | 'brute'
  | 'corruptor'
  | 'dominator'
  | 'mastermind'
  | 'stalker'
  // Epic Archetypes - Kheldians (Hero)
  | 'peacebringer'
  | 'warshade'
  // Epic Archetypes - Arachnos (Villain)
  | 'arachnos-soldier'
  | 'arachnos-widow';

// ============================================
// ARCHETYPE REGISTRY
// ============================================

export type ArchetypeRegistry = Record<ArchetypeId, Archetype>;
