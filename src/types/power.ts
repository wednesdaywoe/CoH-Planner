/**
 * Power and Powerset type definitions
 */

import type {
  DamageType,
  PowerType,
  TargetType,
  EffectArea,
  EnhancementStatType,
  IOSetCategory,
} from './common';

// ============================================
// DAMAGE EFFECT
// ============================================

export interface DamageEffect {
  /** Damage type (Fire, Smashing, etc.) */
  type: DamageType;
  /** Damage scale value */
  scale: number;
  /** Optional: damage table reference */
  table?: string;
}

export interface MultiDamageEffect {
  /** Multiple damage types */
  types: DamageEffect[];
  /** Combined scale */
  scale: number;
}

// ============================================
// DOT (DAMAGE OVER TIME) EFFECT
// ============================================

export interface DotEffect {
  /** Damage type */
  type: DamageType;
  /** Damage scale per tick */
  scale: number;
  /** Number of ticks */
  ticks: number;
}

// ============================================
// PROTECTION EFFECTS
// ============================================

export interface ProtectionEffects {
  stun?: number;
  hold?: number;
  immobilize?: number;
  sleep?: number;
  confuse?: number;
  fear?: number;
  knockback?: number;
}

// ============================================
// MOVEMENT EFFECTS
// ============================================

export interface MovementEffect {
  scale: number;
  table?: string;
}

// ============================================
// POWER EFFECTS
// ============================================

export interface PowerEffects {
  /** Base accuracy modifier */
  accuracy?: number;
  /** Range in feet (0 for melee/self) */
  range?: number;
  /** Recharge time in seconds */
  recharge?: number;
  /** Endurance cost (legacy: 'endurance', new: 'enduranceCost') */
  enduranceCost?: number;
  /** Cast/activation time in seconds */
  castTime?: number;
  /** Effect area type */
  effectArea?: EffectArea;
  /** Radius for AoE powers */
  radius?: number;
  /** Arc for cone powers */
  arc?: number;
  /** Max targets for AoE */
  maxTargets?: number;
  /** Direct damage (single or multi-type) */
  damage?: DamageEffect | MultiDamageEffect;
  /** Damage over time */
  dot?: DotEffect;
  /** Duration of buffs/debuffs */
  buffDuration?: number;
  /** ToHit buff value */
  tohitBuff?: number;
  /** Damage buff value */
  damageBuff?: number;
  /** Protection values granted */
  protection?: ProtectionEffects;
  /** Run speed effect */
  runSpeed?: MovementEffect;
  /** Jump height effect */
  jumpHeight?: MovementEffect;
  /** Jump speed effect */
  jumpSpeed?: MovementEffect;
  /** Fly speed effect */
  flySpeed?: MovementEffect;
}

// ============================================
// POWER DEFINITION
// ============================================

export interface Power {
  /** Power name */
  name: string;
  /** Full internal name (e.g., "Pool.Speed.Hasten") */
  fullName?: string;
  /** Level available (0 = level 1, -1 = unlocked by prerequisite) */
  available: number;
  /** Tier within the powerset */
  tier?: number;
  /** Rank within a pool */
  rank?: number;
  /** Maximum enhancement slots */
  maxSlots: number;
  /** Allowed single enhancement types */
  allowedEnhancements: EnhancementStatType[];
  /** Allowed IO set categories */
  allowedSetCategories: IOSetCategory[];
  /** Full description */
  description: string;
  /** Short help text shown in UI */
  shortHelp?: string;
  /** Icon filename */
  icon?: string;
  /** Click, Toggle, Auto, or Passive */
  powerType: PowerType;
  /** Target type */
  targetType?: TargetType;
  /** Effect area */
  effectArea?: EffectArea;
  /** Max targets for AoE */
  maxTargets?: number;
  /** Prerequisite power(s) - logical expression */
  requires?: string;
  /** All effects of this power */
  effects: PowerEffects;
}

// ============================================
// POWERSET DEFINITION
// ============================================

export interface Powerset {
  /** Internal ID (e.g., "blaster/fire-blast") */
  id?: string;
  /** Display name (e.g., "Fire Blast") */
  name: string;
  /** Display name (alternative) */
  displayName?: string;
  /** Category (Primary/Secondary) */
  category?: string;
  /** Description of the powerset */
  description: string;
  /** Icon filename */
  icon: string;
  /** Powers in this set */
  powers: Power[];
}

// ============================================
// POWER POOL DEFINITION
// ============================================

export interface PowerPool extends Powerset {
  /** Pool ID (e.g., "speed") */
  id: string;
  /** Prerequisite expression */
  requires?: string;
}

// ============================================
// SELECTED POWER (in a build)
// ============================================

import type { Enhancement } from './enhancement';

export interface SelectedPower extends Power {
  /** The powerset this power belongs to */
  powerSet: string;
  /** Level the power was taken at */
  level: number;
  /** Enhancement slots (null = empty slot) */
  slots: (Enhancement | null)[];
}
