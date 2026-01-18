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
// PROTECTION EFFECTS (mez protection magnitude)
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
// DEFENSE/RESISTANCE BY DAMAGE TYPE
// ============================================

export interface DefenseByType {
  smashing?: number;
  lethal?: number;
  fire?: number;
  cold?: number;
  energy?: number;
  negative?: number;
  psionic?: number;
  toxic?: number;
  melee?: number;
  ranged?: number;
  aoe?: number;
}

export interface ResistanceByType {
  smashing?: number;
  lethal?: number;
  fire?: number;
  cold?: number;
  energy?: number;
  negative?: number;
  psionic?: number;
  toxic?: number;
}

// ============================================
// HEALING EFFECT
// ============================================

export interface HealingEffect {
  scale: number;
  perTarget?: boolean;
}

// ============================================
// DEBUFF RESISTANCE
// ============================================

export interface DebuffResistance {
  defense?: number;
  recharge?: number;
  movement?: number;
  tohit?: number;
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

  // === BUFF EFFECTS ===
  /** ToHit buff value */
  tohitBuff?: number;
  /** Damage buff value */
  damageBuff?: number;
  /** Defense buff by damage type */
  defenseBuff?: number;

  // === DEBUFF EFFECTS ===
  /** ToHit debuff value */
  tohitDebuff?: number;
  /** Defense debuff value */
  defenseDebuff?: number;
  /** Resistance debuff value */
  resistanceDebuff?: number;

  // === DEFENSE & RESISTANCE (armor sets) ===
  /** Defense values by damage type */
  defense?: DefenseByType;
  /** Resistance values by damage type */
  resistance?: ResistanceByType;
  /** Debuff resistance */
  debuffResistance?: DebuffResistance;

  // === HEALING ===
  /** Healing effect */
  healing?: HealingEffect;

  // === MEZ EFFECTS (control/stuns) ===
  /** Stun magnitude */
  stun?: number;
  /** Stun duration in seconds */
  stunDuration?: number;
  /** Hold magnitude */
  hold?: number;
  /** Hold duration in seconds */
  holdDuration?: number;
  /** Immobilize magnitude */
  immobilize?: number;
  /** Immobilize duration in seconds */
  immobilizeDuration?: number;
  /** Sleep magnitude */
  sleep?: number;
  /** Sleep duration in seconds */
  sleepDuration?: number;
  /** Fear magnitude */
  fear?: number;
  /** Fear duration in seconds */
  fearDuration?: number;
  /** Confuse magnitude */
  confuse?: number;
  /** Confuse duration in seconds */
  confuseDuration?: number;
  /** Knockback magnitude */
  knockback?: number;
  /** Knockback duration */
  knockbackDuration?: number;

  // === PROTECTION (mez protection for armors) ===
  /** Protection values granted */
  protection?: ProtectionEffects;

  // === MOVEMENT ===
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
  /** If true, this power cannot be removed by the user (inherent powers) */
  isLocked?: boolean;
  /** Category for inherent powers (fitness, basic, prestige, archetype) */
  inherentCategory?: 'fitness' | 'basic' | 'prestige' | 'archetype';
}
