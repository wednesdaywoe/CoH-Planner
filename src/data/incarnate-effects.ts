/**
 * Incarnate Effects Data
 *
 * Curated lookup table for incarnate power effects.
 * These values are extracted from the game data and used to:
 * 1. Display effects in tooltips
 * 2. Apply stat bonuses to the dashboard when powers are toggled active
 *
 * Note: Alpha powers provide "enhancement" bonuses (boost all powers)
 * Destiny/Hybrid provide direct stat bonuses (defense, resistance, damage, etc.)
 * Interface provides proc-based debuffs (not direct player stats)
 * Judgement/Lore are clickable attacks/pets (not passive stats)
 */

import type { IncarnateSlotId } from '@/types';
import {
  GENERATED_ALPHA_EFFECTS,
  GENERATED_DESTINY_EFFECTS,
  GENERATED_HYBRID_EFFECTS,
} from './incarnate-effects-generated';

// ============================================
// TYPES
// ============================================

/**
 * Enhancement bonuses from Alpha slot (boost power effectiveness)
 *
 * Alpha slot abilities provide enhancement bonuses that apply to ALL powers
 * that accept that enhancement type. A portion of these bonuses bypass
 * Enhancement Diversification (ED), with the ratio depending on rarity:
 * - Common: 1/6 (~16.7%) bypasses ED
 * - Uncommon Core/Radial: 1/3 (~33.3%) bypasses ED
 * - Rare (Total/Partial): 1/2 (50%) bypasses ED
 * - Very Rare (Paragon): 2/3 (~66.7%) bypasses ED
 */
export interface AlphaEffects {
  // Enhancement bonuses (percentage as decimal, e.g., 0.45 = 45%)
  damage?: number;
  accuracy?: number;
  recharge?: number;
  enduranceReduction?: number;
  enduranceModification?: number;
  range?: number;
  heal?: number;
  defense?: number;
  resistance?: number;
  hold?: number;
  immobilize?: number;
  stun?: number;
  sleep?: number;
  fear?: number;
  confuse?: number;
  slow?: number;
  toHitDebuff?: number;
  defenseDebuff?: number;
  toHitBuff?: number;
  taunt?: number;
  runSpeed?: number;
  jumpSpeed?: number;
  flySpeed?: number;
  absorb?: number;
  // Special: Level shift
  levelShift?: number;
  // ED bypass ratio (portion of bonus that bypasses Enhancement Diversification)
  // Common: 1/6, Uncommon: 1/3, Rare: 1/2, VeryRare: 2/3
  edBypass?: number;
}

/**
 * Direct stat bonuses from Destiny slot
 * Note: Destiny effects diminish over time; we store initial (peak) values
 */
export interface DestinyEffects {
  // Defense (all positions/types)
  defenseAll?: number;
  // Resistance (all damage types)
  resistanceAll?: number;
  // Healing
  healPercent?: number;
  // Recovery/Regeneration
  recovery?: number;
  regeneration?: number;
  // Max HP/End
  maxHP?: number;
  maxEndurance?: number;
  // Recharge
  recharge?: number;
  // Damage buff
  damage?: number;
  // ToHit buff
  toHit?: number;
  // Mez protection
  mezProtection?: number;
  // Level shift
  levelShift?: number;
  // Duration info
  initialDuration?: number;  // Duration of peak effect
  totalDuration?: number;    // Total duration before recharge
}

/**
 * Stat bonuses from Hybrid slot (toggle powers)
 *
 * Three-layer model:
 * - passive: Always-on just by equipping (stat key → decimal)
 * - frontLoaded: Active when toggle is on, no enemies required (stat key → decimal)
 * - perTarget: Stacks per nearby enemy up to maxTargets (stat key → decimal per enemy)
 *
 * Stat keys use the same names as GlobalBonuses (e.g. 'regeneration', 'resSmashing', 'defMelee')
 */
export interface HybridEffects {
  tree: string;
  /** Passive bonuses — always-on just by equipping (stat → decimal) */
  passive: Record<string, number>;
  /** Front-loaded bonuses — active when toggle is on, no enemies required (stat → decimal) */
  frontLoaded: Record<string, number>;
  /** Per-target bonuses — stacks per nearby enemy (stat → decimal per enemy) */
  perTarget: Record<string, number>;
  /** Maximum enemies for per-target stacking */
  maxTargets: number;
  duration: number;
  recharge: number;
}

/**
 * Interface proc effects (for display only, not dashboard stats)
 */
export interface InterfaceEffects {
  // Debuff type and magnitude
  debuffType?: string;  // e.g., "-Resistance", "-Defense", "-Regen"
  debuffMagnitude?: number;
  debuffDuration?: number;

  // DoT type and damage
  dotType?: string;  // e.g., "Fire", "Cold", "Toxic"
  dotDamage?: number;       // damage scale value
  dotDuration?: number;
  dotTableName?: string;    // AT table for DoT calc (e.g., "Melee_Tempdamage")

  // Proc chance
  procChance?: number;
}

/**
 * Judgement click attack effects (for display, not dashboard stats)
 */
export interface JudgementEffects {
  damageType: string;        // e.g., "Cold", "Energy", "Smashing", "Fire", "Negative Energy"
  effectArea: string;        // e.g., "Cone", "Chain", "PBAoE", "Targeted AoE", "Self Cone"
  range: number;             // in feet
  radius: number;            // in feet (0 for chain)
  arc: number;               // in degrees (0 for non-cones)
  maxTargets: number;        // 0 for chain powers
  activationTime: number;    // seconds
  rechargeTime: number;      // seconds (always 90)
  damageScale: number;       // usually 4.0
  tableName: string;         // AT table for damage calc (e.g., "Ranged_Tempdamage")
  secondaryEffects: string[];  // descriptive strings for display
}

/**
 * Lore pet summoning effects (for display, not dashboard stats)
 */
export interface LoreEffects {
  faction: string;           // display name e.g., "Arachnos"
  pets: string[];            // e.g., ['Boss', 'Support (Protected)']
  duration: number;          // pet duration in seconds
  rechargeTime: number;      // seconds (900 or 600)
}

/**
 * Combined incarnate power effects
 */
export interface IncarnatePowerEffects {
  powerName: string;
  displayName: string;
  slotId: IncarnateSlotId;
  alpha?: AlphaEffects;
  destiny?: DestinyEffects;
  hybrid?: HybridEffects;
  interface?: InterfaceEffects;
  judgement?: JudgementEffects;
  lore?: LoreEffects;
}

// ============================================
// ALPHA EFFECTS DATA
// ============================================

// Alpha data auto-generated — see scripts/convert-incarnate-effects.cjs
const ALPHA_EFFECTS: Record<string, AlphaEffects> = GENERATED_ALPHA_EFFECTS as Record<string, AlphaEffects>;

// ============================================
// DESTINY EFFECTS DATA
// ============================================

// Destiny data auto-generated — see scripts/convert-incarnate-effects.cjs
const DESTINY_EFFECTS: Record<string, DestinyEffects> = GENERATED_DESTINY_EFFECTS as Record<string, DestinyEffects>;

// ============================================
// HYBRID EFFECTS DATA
// ============================================

// Hybrid data auto-generated — see scripts/convert-incarnate-effects.cjs
const HYBRID_EFFECTS: Record<string, HybridEffects> = GENERATED_HYBRID_EFFECTS as unknown as Record<string, HybridEffects>;

// ============================================
// INTERFACE EFFECTS DATA
// ============================================

const INTERFACE_EFFECTS: Record<string, InterfaceEffects> = {
  // ========== DIAMAGNETIC ==========
  // -ToHit, -Regen
  'diamagnetic_interface': {
    debuffType: '-ToHit, -Regen',
    debuffMagnitude: 0.05,
    procChance: 0.20,
  },
  'diamagnetic_core_interface': {
    debuffType: '-ToHit, -Regen',
    debuffMagnitude: 0.10,
    procChance: 0.20,
  },
  'diamagnetic_radial_interface': {
    debuffType: '-ToHit, -Regen',
    debuffMagnitude: 0.075,
    procChance: 0.30,
  },
  'diamagnetic_total_core_conversion': {
    debuffType: '-ToHit, -Regen',
    debuffMagnitude: 0.15,
    procChance: 0.20,
  },
  'diamagnetic_partial_core_conversion': {
    debuffType: '-ToHit, -Regen',
    debuffMagnitude: 0.125,
    procChance: 0.25,
  },
  'diamagnetic_partial_radial_conversion': {
    debuffType: '-ToHit, -Regen',
    debuffMagnitude: 0.10,
    procChance: 0.35,
  },
  'diamagnetic_total_radial_conversion': {
    debuffType: '-ToHit, -Regen',
    debuffMagnitude: 0.075,
    procChance: 0.50,
  },
  'diamagnetic_core_flawless_interface': {
    debuffType: '-ToHit, -Regen',
    debuffMagnitude: 0.20,
    procChance: 0.25,
  },
  'diamagnetic_radial_flawless_interface': {
    debuffType: '-ToHit, -Regen',
    debuffMagnitude: 0.125,
    procChance: 0.50,
  },

  // ========== REACTIVE ==========
  // DoT + -Resistance
  'reactive_interface': {
    dotType: 'Toxic', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.20,
    debuffType: '-Resistance',
    debuffMagnitude: 0.05,
    procChance: 0.20,
  },
  'reactive_core_interface': {
    dotType: 'Toxic', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.30,
    debuffType: '-Resistance',
    debuffMagnitude: 0.10,
    procChance: 0.20,
  },
  'reactive_radial_interface': {
    dotType: 'Toxic', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.20,
    debuffType: '-Resistance',
    debuffMagnitude: 0.075,
    procChance: 0.30,
  },
  'reactive_total_core_conversion': {
    dotType: 'Toxic', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.40,
    debuffType: '-Resistance',
    debuffMagnitude: 0.15,
    procChance: 0.20,
  },
  'reactive_partial_core_conversion': {
    dotType: 'Toxic', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.35,
    debuffType: '-Resistance',
    debuffMagnitude: 0.125,
    procChance: 0.25,
  },
  'reactive_partial_radial_conversion': {
    dotType: 'Toxic', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.25,
    debuffType: '-Resistance',
    debuffMagnitude: 0.10,
    procChance: 0.35,
  },
  'reactive_total_radial_conversion': {
    dotType: 'Toxic', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.15,
    debuffType: '-Resistance',
    debuffMagnitude: 0.075,
    procChance: 0.50,
  },
  'reactive_core_flawless_interface': {
    dotType: 'Toxic', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.50,
    debuffType: '-Resistance',
    debuffMagnitude: 0.20,
    procChance: 0.25,
  },
  'reactive_radial_flawless_interface': {
    dotType: 'Toxic', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.25,
    debuffType: '-Resistance',
    debuffMagnitude: 0.125,
    procChance: 0.50,
  },

  // ========== DEGENERATIVE ==========
  // -Max HP
  'degenerative_interface': {
    debuffType: '-Max HP',
    debuffMagnitude: 0.02,
    procChance: 0.20,
  },
  'degenerative_core_interface': {
    debuffType: '-Max HP',
    debuffMagnitude: 0.04,
    procChance: 0.20,
  },
  'degenerative_radial_interface': {
    debuffType: '-Max HP',
    debuffMagnitude: 0.03,
    procChance: 0.30,
  },
  'degenerative_total_core_conversion': {
    debuffType: '-Max HP',
    debuffMagnitude: 0.06,
    procChance: 0.20,
  },
  'degenerative_partial_core_conversion': {
    debuffType: '-Max HP',
    debuffMagnitude: 0.05,
    procChance: 0.25,
  },
  'degenerative_partial_radial_conversion': {
    debuffType: '-Max HP',
    debuffMagnitude: 0.04,
    procChance: 0.35,
  },
  'degenerative_total_radial_conversion': {
    debuffType: '-Max HP',
    debuffMagnitude: 0.03,
    procChance: 0.50,
  },
  'degenerative_core_flawless_interface': {
    debuffType: '-Max HP',
    debuffMagnitude: 0.08,
    procChance: 0.25,
  },
  'degenerative_radial_flawless_interface': {
    debuffType: '-Max HP',
    debuffMagnitude: 0.05,
    procChance: 0.50,
  },

  // ========== GRAVITIC ==========
  // -Speed, -Recharge
  'gravitic_interface': {
    debuffType: '-Speed, -Recharge',
    debuffMagnitude: 0.10,
    procChance: 0.20,
  },
  'gravitic_core_interface': {
    debuffType: '-Speed, -Recharge',
    debuffMagnitude: 0.20,
    procChance: 0.20,
  },
  'gravitic_radial_interface': {
    debuffType: '-Speed, -Recharge',
    debuffMagnitude: 0.15,
    procChance: 0.30,
  },
  'gravitic_total_core_conversion': {
    debuffType: '-Speed, -Recharge',
    debuffMagnitude: 0.30,
    procChance: 0.20,
  },
  'gravitic_partial_core_conversion': {
    debuffType: '-Speed, -Recharge',
    debuffMagnitude: 0.25,
    procChance: 0.25,
  },
  'gravitic_partial_radial_conversion': {
    debuffType: '-Speed, -Recharge',
    debuffMagnitude: 0.20,
    procChance: 0.35,
  },
  'gravitic_total_radial_conversion': {
    debuffType: '-Speed, -Recharge',
    debuffMagnitude: 0.15,
    procChance: 0.50,
  },
  'gravitic_core_flawless_interface': {
    debuffType: '-Speed, -Recharge',
    debuffMagnitude: 0.40,
    procChance: 0.25,
  },
  'gravitic_radial_flawless_interface': {
    debuffType: '-Speed, -Recharge',
    debuffMagnitude: 0.25,
    procChance: 0.50,
  },

  // ========== SPECTRAL ==========
  // -Defense
  'spectral_interface': {
    debuffType: '-Defense',
    debuffMagnitude: 0.025,
    procChance: 0.20,
  },
  'spectral_core_interface': {
    debuffType: '-Defense',
    debuffMagnitude: 0.05,
    procChance: 0.20,
  },
  'spectral_radial_interface': {
    debuffType: '-Defense',
    debuffMagnitude: 0.0375,
    procChance: 0.30,
  },
  'spectral_total_core_conversion': {
    debuffType: '-Defense',
    debuffMagnitude: 0.075,
    procChance: 0.20,
  },
  'spectral_partial_core_conversion': {
    debuffType: '-Defense',
    debuffMagnitude: 0.0625,
    procChance: 0.25,
  },
  'spectral_partial_radial_conversion': {
    debuffType: '-Defense',
    debuffMagnitude: 0.05,
    procChance: 0.35,
  },
  'spectral_total_radial_conversion': {
    debuffType: '-Defense',
    debuffMagnitude: 0.0375,
    procChance: 0.50,
  },
  'spectral_core_flawless_interface': {
    debuffType: '-Defense',
    debuffMagnitude: 0.10,
    procChance: 0.25,
  },
  'spectral_radial_flawless_interface': {
    debuffType: '-Defense',
    debuffMagnitude: 0.0625,
    procChance: 0.50,
  },

  // ========== PARALYTIC ==========
  // -End, -Recovery
  'paralytic_interface': {
    debuffType: '-End, -Recovery',
    debuffMagnitude: 0.05,
    procChance: 0.20,
  },
  'paralytic_core_interface': {
    debuffType: '-End, -Recovery',
    debuffMagnitude: 0.10,
    procChance: 0.20,
  },
  'paralytic_radial_interface': {
    debuffType: '-End, -Recovery',
    debuffMagnitude: 0.075,
    procChance: 0.30,
  },
  'paralytic_total_core_conversion': {
    debuffType: '-End, -Recovery',
    debuffMagnitude: 0.15,
    procChance: 0.20,
  },
  'paralytic_partial_core_conversion': {
    debuffType: '-End, -Recovery',
    debuffMagnitude: 0.125,
    procChance: 0.25,
  },
  'paralytic_partial_radial_conversion': {
    debuffType: '-End, -Recovery',
    debuffMagnitude: 0.10,
    procChance: 0.35,
  },
  'paralytic_total_radial_conversion': {
    debuffType: '-End, -Recovery',
    debuffMagnitude: 0.075,
    procChance: 0.50,
  },
  'paralytic_core_flawless_interface': {
    debuffType: '-End, -Recovery',
    debuffMagnitude: 0.20,
    procChance: 0.25,
  },
  'paralytic_radial_flawless_interface': {
    debuffType: '-End, -Recovery',
    debuffMagnitude: 0.125,
    procChance: 0.50,
  },

  // ========== COGNITIVE ==========
  // Confuse proc; Radial adds Psionic DoT
  'cognitive_interface': {
    debuffType: 'Confuse',
    procChance: 0.08,
  },
  'cognitive_core_interface': {
    debuffType: 'Confuse',
    procChance: 0.12,
  },
  'cognitive_radial_interface': {
    debuffType: 'Confuse',
    procChance: 0.08,
    dotType: 'Psionic', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.25,
  },
  'cognitive_total_core_conversion': {
    debuffType: 'Confuse',
    procChance: 0.16,
  },
  'cognitive_partial_core_conversion': {
    debuffType: 'Confuse',
    procChance: 0.12,
    dotType: 'Psionic', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.25,
  },
  'cognitive_partial_radial_conversion': {
    debuffType: 'Confuse',
    procChance: 0.08,
    dotType: 'Psionic', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.50,
  },
  'cognitive_total_radial_conversion': {
    debuffType: 'Confuse',
    procChance: 0.04,
    dotType: 'Psionic', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.75,
  },
  'cognitive_core_flawless_interface': {
    debuffType: 'Confuse',
    procChance: 0.20,
    dotType: 'Psionic', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.25,
  },
  'cognitive_radial_flawless_interface': {
    debuffType: 'Confuse',
    procChance: 0.12,
    dotType: 'Psionic', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.75,
  },

  // ========== PREEMPTIVE ==========
  // -End drain, -Recovery proc; Radial adds Energy DoT
  'preemptive_interface': {
    debuffType: '-End, -Recovery',
    procChance: 0.25,
  },
  'preemptive_core_interface': {
    debuffType: '-End, -Recovery',
    procChance: 0.50,
  },
  'preemptive_radial_interface': {
    debuffType: '-End, -Recovery',
    procChance: 0.25,
    dotType: 'Energy', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.25,
  },
  'preemptive_total_core_conversion': {
    debuffType: '-End, -Recovery',
    procChance: 0.75,
  },
  'preemptive_partial_core_conversion': {
    debuffType: '-End, -Recovery',
    procChance: 0.50,
    dotType: 'Energy', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.25,
  },
  'preemptive_partial_radial_conversion': {
    debuffType: '-End, -Recovery',
    procChance: 0.25,
    dotType: 'Energy', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.50,
  },
  'preemptive_total_radial_conversion': {
    dotType: 'Energy', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.75,
  },
  'preemptive_core_flawless_interface': {
    debuffType: '-End, -Recovery',
    procChance: 0.75,
    dotType: 'Energy', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.25,
  },
  'preemptive_radial_flawless_interface': {
    debuffType: '-End, -Recovery',
    procChance: 0.25,
    dotType: 'Energy', dotTableName: 'Melee_Tempdamage',
    dotDamage: 0.75,
  },
};

// ============================================
// JUDGEMENT EFFECTS DATA
// ============================================

const JUDGEMENT_EFFECTS: Record<string, JudgementEffects> = {
  // ========== CRYONIC ==========
  // Ranged Cone, Cold damage
  'cryonic_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 80, radius: 80, arc: 30,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: [],
  },
  'cryonic_core_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 80, radius: 80, arc: 30,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'cryonic_radial_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 80, radius: 80, arc: 30,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['-Speed', '-Recharge'],
  },
  'cryonic_total_core_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 80, radius: 80, arc: 30,
    maxTargets: 24, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'cryonic_partial_core_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 80, radius: 80, arc: 30,
    maxTargets: 24, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Judgement Critical (20% chance)', '-Speed', '-Recharge'],
  },
  'cryonic_partial_radial_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 120, radius: 120, arc: 45,
    maxTargets: 32, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['-Speed', '-Recharge'],
  },
  'cryonic_total_radial_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 80, radius: 80, arc: 30,
    maxTargets: 24, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['-Speed', '-Recharge', 'Hold (25% chance)'],
  },
  'cryonic_core_final_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 120, radius: 120, arc: 45,
    maxTargets: 32, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'cryonic_radial_final_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 120, radius: 120, arc: 45,
    maxTargets: 32, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['-Speed', '-Recharge', 'Hold (25% chance)'],
  },

  // ========== ION ==========
  // Chain Ranged AoE, Energy damage
  'ion_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: [],
  },
  'ion_core_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'ion_radial_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['-Endurance', '-Recovery'],
  },
  'ion_total_core_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'ion_partial_core_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Judgement Critical (20% chance)', '-Endurance', '-Recovery'],
  },
  'ion_partial_radial_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['-Endurance', '-Recovery'],
  },
  'ion_total_radial_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['-Endurance', '-Recovery', 'Hold (25% chance)'],
  },
  'ion_core_final_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'ion_radial_final_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['-Endurance', '-Recovery', 'Hold (25% chance)'],
  },

  // ========== MIGHTY ==========
  // PBAoE, Smashing damage
  'mighty_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: [],
  },
  'mighty_core_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'mighty_radial_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Knockup (50% chance)'],
  },
  'mighty_total_core_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'mighty_partial_core_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 50, arc: 0,
    maxTargets: 24, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'mighty_partial_radial_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 50, arc: 0,
    maxTargets: 32, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Knockup (50% chance)'],
  },
  'mighty_total_radial_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Knockup'],
  },
  'mighty_core_final_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 50, arc: 0,
    maxTargets: 24, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'mighty_radial_final_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 50, arc: 0,
    maxTargets: 32, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Knockup'],
  },

  // ========== PYRONIC ==========
  // Targeted Ranged AoE, Fire damage
  'pyronic_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 25, arc: 0,
    maxTargets: 16, activationTime: 1, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: [],
  },
  'pyronic_core_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 25, arc: 0,
    maxTargets: 16, activationTime: 1, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['DoT (Fire)'],
  },
  'pyronic_radial_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 40, arc: 0,
    maxTargets: 24, activationTime: 1, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: [],
  },
  'pyronic_total_core_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 25, arc: 0,
    maxTargets: 16, activationTime: 1, rechargeTime: 90, damageScale: 3.5, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Superior DoT (Fire)'],
  },
  'pyronic_partial_core_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 25, arc: 0,
    maxTargets: 16, activationTime: 1, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['DoT (Fire)'],
  },
  'pyronic_partial_radial_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 40, arc: 0,
    maxTargets: 32, activationTime: 1, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: [],
  },
  'pyronic_total_radial_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 40, arc: 0,
    maxTargets: 24, activationTime: 1, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Stun (25% chance)'],
  },
  'pyronic_core_final_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 40, arc: 0,
    maxTargets: 24, activationTime: 1, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['DoT (Fire)'],
  },
  'pyronic_radial_final_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 40, arc: 0,
    maxTargets: 32, activationTime: 1, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Stun (25% chance)'],
  },

  // ========== VOID ==========
  // PBAoE, Negative Energy damage
  'void_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: [],
  },
  'void_core_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'void_radial_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['-Damage'],
  },
  'void_total_core_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'void_partial_core_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Judgement Critical (20% chance)', 'Knockback'],
  },
  'void_partial_radial_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['-Damage', 'Knockback'],
  },
  'void_total_radial_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 50, arc: 0,
    maxTargets: 24, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['-Damage'],
  },
  'void_core_final_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 50, arc: 0,
    maxTargets: 24, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'void_radial_final_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 50, arc: 0,
    maxTargets: 32, activationTime: 2, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['-Damage'],
  },

  // ========== VORPAL ==========
  // Self-Targeted Cone, Smashing damage (+ Lethal DoT on core path)
  'vorpal_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 80, radius: 80, arc: 80,
    maxTargets: 20, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: [],
  },
  'vorpal_core_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 80, radius: 80, arc: 80,
    maxTargets: 20, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['DoT (Lethal)'],
  },
  'vorpal_radial_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 80, radius: 80, arc: 120,
    maxTargets: 30, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: [],
  },
  'vorpal_total_core_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 120, radius: 120, arc: 80,
    maxTargets: 20, activationTime: 2.5, rechargeTime: 90, damageScale: 3.5, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Superior DoT (Lethal)'],
  },
  'vorpal_partial_core_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 120, radius: 120, arc: 80,
    maxTargets: 20, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['DoT (Lethal)'],
  },
  'vorpal_partial_radial_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 80, radius: 80, arc: 120,
    maxTargets: 40, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: [],
  },
  'vorpal_total_radial_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 80, radius: 80, arc: 120,
    maxTargets: 30, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Self +Defense (All)'],
  },
  'vorpal_core_final_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 120, radius: 120, arc: 120,
    maxTargets: 30, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['DoT (Lethal)'],
  },
  'vorpal_radial_final_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 120, radius: 120, arc: 120,
    maxTargets: 40, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0, tableName: 'Ranged_Tempdamage',
    secondaryEffects: ['Self +Defense (All)'],
  },
};

// ============================================
// LORE EFFECTS DATA
// ============================================

// All 21 factions share identical tier structures — only faction name and entity names differ.
// Generated programmatically to avoid 189 manual entries.

const LORE_FACTION_NAMES: Record<string, string> = {
  'arachnos': 'Arachnos',
  'banished_pantheon': 'Banished Pantheon',
  'carnival': 'Carnival',
  'cimeroran': 'Cimeroran',
  'clockwork': 'Clockwork',
  'demons': 'Demons',
  'idf': 'IDF',
  'knives_of_vengeance': 'Knives of Vengeance',
  'longbow': 'Longbow',
  'nemesis': 'Nemesis',
  'phantom': 'Phantom',
  'polar_lights': 'Polar Lights',
  'rikti': 'Rikti',
  'robotic_drones': 'Robotic Drones',
  'rularuu': 'Rularuu',
  'seers': 'Seers',
  'storm_elemental': 'Storm Elemental',
  'talons_of_vengeance': 'Talons of Vengeance',
  'tsoo': 'Tsoo',
  'vanguard': 'Vanguard',
  'warworks': 'Warworks',
};

// Tier templates: suffix, pets summoned, duration (s), recharge (s)
const LORE_TIER_TEMPLATES: { suffix: string; pets: string[]; duration: number; recharge: number }[] = [
  // T1 Common
  { suffix: '_ally', pets: ['Lieutenant'], duration: 300, recharge: 900 },
  // T2 Uncommon
  { suffix: '_core_ally', pets: ['Boss'], duration: 300, recharge: 900 },
  { suffix: '_radial_ally', pets: ['Lieutenant', 'Support'], duration: 300, recharge: 900 },
  // T3 Rare
  { suffix: '_total_core_improved_ally', pets: ['Boss', 'Lieutenant'], duration: 300, recharge: 900 },
  { suffix: '_partial_core_improved_ally', pets: ['Boss', 'Support'], duration: 300, recharge: 900 },
  { suffix: '_partial_radial_improved_ally', pets: ['Lieutenant', 'Support (Attacks)'], duration: 300, recharge: 600 },
  { suffix: '_total_radial_improved_ally', pets: ['Lieutenant', 'Support (Protected)'], duration: 300, recharge: 900 },
  // T4 Very Rare
  { suffix: '_core_superior_ally', pets: ['Boss (Buffed)', 'Lieutenant (Buffed)'], duration: 300, recharge: 900 },
  { suffix: '_radial_superior_ally', pets: ['Boss', 'Support (Protected)'], duration: 200, recharge: 600 },
];

// Generate all lore effects from faction × tier templates
const LORE_EFFECTS: Record<string, LoreEffects> = {};
for (const [factionKey, factionName] of Object.entries(LORE_FACTION_NAMES)) {
  for (const template of LORE_TIER_TEMPLATES) {
    LORE_EFFECTS[`${factionKey}${template.suffix}`] = {
      faction: factionName,
      pets: template.pets,
      duration: template.duration,
      rechargeTime: template.recharge,
    };
  }
}

// ============================================
// LOOKUP FUNCTIONS
// ============================================

/**
 * Normalize power ID for lookup (remove slot prefix, convert to lowercase with underscores)
 */
function normalizePowerId(powerId: string): string {
  // Remove common prefixes
  let normalized = powerId
    .toLowerCase()
    .replace(/^incarnate\.(alpha|judgement|interface|destiny|lore|hybrid)\./, '')
    .replace(/[.\s-]/g, '_');

  return normalized;
}

/**
 * Get Alpha effects for a power
 */
export function getAlphaEffects(powerId: string): AlphaEffects | null {
  const normalized = normalizePowerId(powerId);
  return ALPHA_EFFECTS[normalized] || null;
}

/**
 * Get Destiny effects for a power
 */
export function getDestinyEffects(powerId: string): DestinyEffects | null {
  const normalized = normalizePowerId(powerId);
  return DESTINY_EFFECTS[normalized] || null;
}

/**
 * Get Hybrid effects for a power
 */
export function getHybridEffects(powerId: string): HybridEffects | null {
  const normalized = normalizePowerId(powerId);
  return HYBRID_EFFECTS[normalized] || null;
}

/**
 * Get Interface effects for a power
 */
export function getInterfaceEffects(powerId: string): InterfaceEffects | null {
  const normalized = normalizePowerId(powerId);
  return INTERFACE_EFFECTS[normalized] || null;
}

/**
 * Get Judgement effects for a power
 */
export function getJudgementEffects(powerId: string): JudgementEffects | null {
  const normalized = normalizePowerId(powerId);
  return JUDGEMENT_EFFECTS[normalized] || null;
}

/**
 * Get Lore effects for a power
 */
export function getLoreEffects(powerId: string): LoreEffects | null {
  const normalized = normalizePowerId(powerId);
  return LORE_EFFECTS[normalized] || null;
}

/**
 * Get effects for any incarnate power based on its slot
 */
export function getIncarnateEffects(
  slotId: IncarnateSlotId,
  powerId: string
): AlphaEffects | DestinyEffects | HybridEffects | InterfaceEffects | JudgementEffects | LoreEffects | null {
  switch (slotId) {
    case 'alpha':
      return getAlphaEffects(powerId);
    case 'destiny':
      return getDestinyEffects(powerId);
    case 'hybrid':
      return getHybridEffects(powerId);
    case 'interface':
      return getInterfaceEffects(powerId);
    case 'judgement':
      return getJudgementEffects(powerId);
    case 'lore':
      return getLoreEffects(powerId);
    default:
      return null;
  }
}

/**
 * Format effect value as percentage string
 */
export function formatEffectPercent(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

/**
 * Format effect value with sign
 */
export function formatEffectValue(value: number, isPercent = true): string {
  const sign = value >= 0 ? '+' : '';
  if (isPercent) {
    return `${sign}${(value * 100).toFixed(1)}%`;
  }
  return `${sign}${value.toFixed(2)}`;
}
