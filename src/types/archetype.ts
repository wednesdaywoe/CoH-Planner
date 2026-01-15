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
  | 'stalker';

// ============================================
// ARCHETYPE REGISTRY
// ============================================

export type ArchetypeRegistry = Record<ArchetypeId, Archetype>;
