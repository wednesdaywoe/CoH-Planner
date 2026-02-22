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
 */
export interface HybridEffects {
  // Assault tree - damage bonuses
  damage?: number;
  damageProc?: number;  // Chance for extra damage
  doublehitChance?: number;  // Chance for double hit

  // Support tree - team buffs
  defense?: number;
  accuracy?: number;

  // Melee tree - defensive bonuses
  regeneration?: number;
  resistanceAll?: number;
  defenseAll?: number;
  statusProtection?: number;

  // Control tree - mez effects (not stats, but for display)
  mezMagnitudeBonus?: number;

  // Duration info
  duration?: number;
  recharge?: number;
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
  dotDamage?: number;
  dotDuration?: number;

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

const ALPHA_EFFECTS: Record<string, AlphaEffects> = {
  // ========== MUSCULATURE ==========
  // Focuses on Damage
  'musculature_boost': {
    damage: 0.20,
    levelShift: 0,
    edBypass: 1/6,  // Common: 1/6 bypasses ED
  },
  'musculature_core_boost': {
    damage: 0.25,
    immobilize: 0.20,
    levelShift: 0,
    edBypass: 1/3,  // Uncommon: 1/3 bypasses ED
  },
  'musculature_radial_boost': {
    damage: 0.25,
    defenseDebuff: 0.20,
    levelShift: 0,
    edBypass: 1/3,  // Uncommon: 1/3 bypasses ED
  },
  'musculature_total_core_revamp': {
    damage: 0.33,
    immobilize: 0.25,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'musculature_partial_core_revamp': {
    damage: 0.33,
    immobilize: 0.25,
    defenseDebuff: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'musculature_partial_radial_revamp': {
    damage: 0.33,
    immobilize: 0.20,
    defenseDebuff: 0.25,
    toHitDebuff: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'musculature_total_radial_revamp': {
    damage: 0.33,
    immobilize: 0.20,
    defenseDebuff: 0.25,
    enduranceReduction: 0.20,  // End modification
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'musculature_core_paragon': {
    damage: 0.45,
    immobilize: 0.33,
    defenseDebuff: 0.33,
    levelShift: 1,
    edBypass: 2/3,  // Very Rare: 2/3 bypasses ED
  },
  'musculature_radial_paragon': {
    damage: 0.45,
    immobilize: 0.33,
    defenseDebuff: 0.33,
    toHitDebuff: 0.20,
    enduranceReduction: 0.20,
    runSpeed: 0.20,
    levelShift: 1,
    edBypass: 2/3,  // Very Rare: 2/3 bypasses ED
  },

  // ========== SPIRITUAL ==========
  // Focuses on Recharge
  'spiritual_boost': {
    recharge: 0.20,
    levelShift: 0,
    edBypass: 1/6,  // Common: 1/6 bypasses ED
  },
  'spiritual_core_boost': {
    recharge: 0.25,
    stun: 0.20,
    levelShift: 0,
    edBypass: 1/3,  // Uncommon: 1/3 bypasses ED
  },
  'spiritual_radial_boost': {
    recharge: 0.25,
    heal: 0.20,
    levelShift: 0,
    edBypass: 1/3,  // Uncommon: 1/3 bypasses ED
  },
  'spiritual_total_core_revamp': {
    recharge: 0.33,
    stun: 0.25,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'spiritual_partial_core_revamp': {
    recharge: 0.33,
    stun: 0.25,
    heal: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'spiritual_partial_radial_revamp': {
    recharge: 0.33,
    stun: 0.20,
    heal: 0.25,
    slow: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'spiritual_total_radial_revamp': {
    recharge: 0.33,
    stun: 0.20,
    heal: 0.25,
    toHitBuff: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'spiritual_core_paragon': {
    recharge: 0.45,
    stun: 0.33,
    heal: 0.33,
    levelShift: 1,
    edBypass: 2/3,  // Very Rare: 2/3 bypasses ED
  },
  'spiritual_radial_paragon': {
    recharge: 0.45,
    stun: 0.33,
    heal: 0.33,
    jumpSpeed: 0.20,
    slow: 0.20,
    toHitBuff: 0.20,
    levelShift: 1,
    edBypass: 2/3,  // Very Rare: 2/3 bypasses ED
  },

  // ========== CARDIAC ==========
  // Focuses on Endurance Reduction
  'cardiac_boost': {
    enduranceReduction: 0.20,
    levelShift: 0,
    edBypass: 1/6,  // Common: 1/6 bypasses ED
  },
  'cardiac_core_boost': {
    enduranceReduction: 0.25,
    range: 0.20,
    levelShift: 0,
    edBypass: 1/3,  // Uncommon: 1/3 bypasses ED
  },
  'cardiac_radial_boost': {
    enduranceReduction: 0.25,
    resistance: 0.20,
    levelShift: 0,
    edBypass: 1/3,  // Uncommon: 1/3 bypasses ED
  },
  'cardiac_total_core_revamp': {
    enduranceReduction: 0.33,
    range: 0.25,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'cardiac_partial_core_revamp': {
    enduranceReduction: 0.33,
    range: 0.25,
    resistance: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'cardiac_partial_radial_revamp': {
    enduranceReduction: 0.33,
    range: 0.20,
    resistance: 0.25,
    fear: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'cardiac_total_radial_revamp': {
    enduranceReduction: 0.33,
    range: 0.20,
    resistance: 0.25,
    sleep: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'cardiac_core_paragon': {
    enduranceReduction: 0.45,
    range: 0.33,
    resistance: 0.33,
    levelShift: 1,
    edBypass: 2/3,  // Very Rare: 2/3 bypasses ED
  },
  'cardiac_radial_paragon': {
    enduranceReduction: 0.45,
    range: 0.33,
    resistance: 0.33,
    sleep: 0.20,
    fear: 0.20,
    absorb: 0.20,
    levelShift: 1,
    edBypass: 2/3,  // Very Rare: 2/3 bypasses ED
  },

  // ========== NERVE ==========
  // Focuses on Accuracy
  'nerve_boost': {
    accuracy: 0.20,
    levelShift: 0,
    edBypass: 1/6,  // Common: 1/6 bypasses ED
  },
  'nerve_core_boost': {
    accuracy: 0.25,
    hold: 0.20,
    levelShift: 0,
    edBypass: 1/3,  // Uncommon: 1/3 bypasses ED
  },
  'nerve_radial_boost': {
    accuracy: 0.25,
    defense: 0.20,
    levelShift: 0,
    edBypass: 1/3,  // Uncommon: 1/3 bypasses ED
  },
  'nerve_total_core_revamp': {
    accuracy: 0.33,
    hold: 0.25,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'nerve_partial_core_revamp': {
    accuracy: 0.33,
    hold: 0.25,
    defense: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'nerve_partial_radial_revamp': {
    accuracy: 0.33,
    hold: 0.20,
    defense: 0.25,
    taunt: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'nerve_total_radial_revamp': {
    accuracy: 0.33,
    hold: 0.20,
    confuse: 0.20,
    defense: 0.25,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'nerve_core_paragon': {
    accuracy: 0.45,
    hold: 0.33,
    defense: 0.33,
    levelShift: 1,
    edBypass: 2/3,  // Very Rare: 2/3 bypasses ED
  },
  'nerve_radial_paragon': {
    accuracy: 0.45,
    hold: 0.33,
    confuse: 0.20,
    defense: 0.33,
    taunt: 0.20,
    flySpeed: 0.20,
    levelShift: 1,
    edBypass: 2/3,  // Very Rare: 2/3 bypasses ED
  },

  // ========== AGILITY ==========
  // Focuses on Endurance Modification (Recovery)
  'agility_boost': {
    enduranceReduction: 0.20,  // End Mod
    levelShift: 0,
    edBypass: 1/6,  // Common: 1/6 bypasses ED
  },
  'agility_core_boost': {
    enduranceReduction: 0.25,
    recharge: 0.20,
    levelShift: 0,
    edBypass: 1/3,  // Uncommon: 1/3 bypasses ED
  },
  'agility_radial_boost': {
    enduranceReduction: 0.25,
    defense: 0.20,
    levelShift: 0,
    edBypass: 1/3,  // Uncommon: 1/3 bypasses ED
  },
  'agility_total_core_revamp': {
    enduranceReduction: 0.33,
    recharge: 0.25,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'agility_partial_core_revamp': {
    enduranceReduction: 0.33,
    recharge: 0.25,
    defense: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'agility_partial_radial_revamp': {
    enduranceReduction: 0.33,
    recharge: 0.20,
    defense: 0.25,
    runSpeed: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'agility_total_radial_revamp': {
    enduranceReduction: 0.33,
    recharge: 0.20,
    defense: 0.25,
    jumpSpeed: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'agility_core_paragon': {
    enduranceReduction: 0.45,
    recharge: 0.33,
    defense: 0.33,
    levelShift: 1,
    edBypass: 2/3,  // Very Rare: 2/3 bypasses ED
  },
  'agility_radial_paragon': {
    enduranceReduction: 0.45,
    recharge: 0.33,
    defense: 0.33,
    jumpSpeed: 0.20,
    runSpeed: 0.20,
    flySpeed: 0.20,
    levelShift: 1,
    edBypass: 2/3,  // Very Rare: 2/3 bypasses ED
  },

  // ========== INTUITION ==========
  // Focuses on Hold Duration
  'intuition_boost': {
    hold: 0.20,
    levelShift: 0,
    edBypass: 1/6,  // Common: 1/6 bypasses ED
  },
  'intuition_core_boost': {
    hold: 0.25,
    defenseDebuff: 0.20,
    levelShift: 0,
    edBypass: 1/3,  // Uncommon: 1/3 bypasses ED
  },
  'intuition_radial_boost': {
    hold: 0.25,
    range: 0.20,
    levelShift: 0,
    edBypass: 1/3,  // Uncommon: 1/3 bypasses ED
  },
  'intuition_total_core_revamp': {
    hold: 0.33,
    defenseDebuff: 0.25,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'intuition_partial_core_revamp': {
    hold: 0.33,
    defenseDebuff: 0.25,
    range: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'intuition_partial_radial_revamp': {
    hold: 0.33,
    defenseDebuff: 0.20,
    range: 0.25,
    damage: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'intuition_total_radial_revamp': {
    hold: 0.33,
    defenseDebuff: 0.20,
    range: 0.25,
    toHitDebuff: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'intuition_core_paragon': {
    hold: 0.45,
    defenseDebuff: 0.33,
    range: 0.33,
    levelShift: 1,
    edBypass: 2/3,  // Very Rare: 2/3 bypasses ED
  },
  'intuition_radial_paragon': {
    hold: 0.45,
    defenseDebuff: 0.33,
    range: 0.33,
    toHitDebuff: 0.20,
    damage: 0.20,
    slow: 0.20,
    levelShift: 1,
    edBypass: 2/3,  // Very Rare: 2/3 bypasses ED
  },

  // ========== RESILIENT ==========
  // Focuses on Damage Resistance
  'resilient_boost': {
    resistance: 0.20,
    levelShift: 0,
    edBypass: 1/6,  // Common: 1/6 bypasses ED
  },
  'resilient_core_boost': {
    resistance: 0.25,
    toHitBuff: 0.20,
    levelShift: 0,
    edBypass: 1/3,  // Uncommon: 1/3 bypasses ED
  },
  'resilient_radial_boost': {
    resistance: 0.25,
    immobilize: 0.20,
    levelShift: 0,
    edBypass: 1/3,  // Uncommon: 1/3 bypasses ED
  },
  'resilient_total_core_revamp': {
    resistance: 0.33,
    toHitBuff: 0.25,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'resilient_partial_core_revamp': {
    resistance: 0.33,
    toHitBuff: 0.25,
    immobilize: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'resilient_partial_radial_revamp': {
    resistance: 0.33,
    toHitBuff: 0.20,
    immobilize: 0.25,
    stun: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'resilient_total_radial_revamp': {
    resistance: 0.33,
    toHitBuff: 0.20,
    immobilize: 0.25,
    absorb: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'resilient_core_paragon': {
    resistance: 0.45,
    toHitBuff: 0.33,
    immobilize: 0.33,
    levelShift: 1,
    edBypass: 2/3,  // Very Rare: 2/3 bypasses ED
  },
  'resilient_radial_paragon': {
    resistance: 0.45,
    taunt: 0.20,
    immobilize: 0.33,
    stun: 0.20,
    toHitBuff: 0.33,
    absorb: 0.20,
    levelShift: 1,
    edBypass: 2/3,  // Very Rare: 2/3 bypasses ED
  },

  // ========== VIGOR ==========
  // Focuses on Healing
  'vigor_boost': {
    heal: 0.20,
    levelShift: 0,
    edBypass: 1/6,  // Common: 1/6 bypasses ED
  },
  'vigor_core_boost': {
    heal: 0.25,
    accuracy: 0.20,
    levelShift: 0,
    edBypass: 1/3,  // Uncommon: 1/3 bypasses ED
  },
  'vigor_radial_boost': {
    heal: 0.25,
    enduranceReduction: 0.20,
    levelShift: 0,
    edBypass: 1/3,  // Uncommon: 1/3 bypasses ED
  },
  'vigor_total_core_revamp': {
    heal: 0.33,
    accuracy: 0.25,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'vigor_partial_core_revamp': {
    heal: 0.33,
    accuracy: 0.25,
    enduranceReduction: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'vigor_partial_radial_revamp': {
    heal: 0.33,
    accuracy: 0.20,
    enduranceReduction: 0.25,
    sleep: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'vigor_total_radial_revamp': {
    heal: 0.33,
    accuracy: 0.20,
    enduranceReduction: 0.25,
    confuse: 0.20,
    levelShift: 1,
    edBypass: 1/2,  // Rare: 1/2 bypasses ED
  },
  'vigor_core_paragon': {
    heal: 0.45,
    accuracy: 0.33,
    enduranceReduction: 0.33,
    levelShift: 1,
    edBypass: 2/3,  // Very Rare: 2/3 bypasses ED
  },
  'vigor_radial_paragon': {
    heal: 0.45,
    accuracy: 0.33,
    enduranceReduction: 0.33,
    confuse: 0.20,
    sleep: 0.20,
    fear: 0.20,
    levelShift: 1,
    edBypass: 2/3,  // Very Rare: 2/3 bypasses ED
  },
};

// ============================================
// DESTINY EFFECTS DATA
// ============================================

const DESTINY_EFFECTS: Record<string, DestinyEffects> = {
  // ========== BARRIER ==========
  // Defense & Resistance buff
  'barrier_genome': {
    defenseAll: 0.25,
    resistanceAll: 0.25,
    initialDuration: 10,
    totalDuration: 120,
  },
  'barrier_core_genome': {
    defenseAll: 0.35,
    resistanceAll: 0.35,
    initialDuration: 10,
    totalDuration: 120,
  },
  'barrier_radial_genome': {
    defenseAll: 0.35,
    resistanceAll: 0.35,
    initialDuration: 10,
    totalDuration: 120,
  },
  'barrier_total_core_invocation': {
    defenseAll: 0.45,
    resistanceAll: 0.45,
    initialDuration: 10,
    totalDuration: 120,
    levelShift: 1,
  },
  'barrier_partial_core_invocation': {
    defenseAll: 0.45,
    resistanceAll: 0.45,
    initialDuration: 10,
    totalDuration: 120,
    levelShift: 1,
  },
  'barrier_partial_radial_invocation': {
    defenseAll: 0.45,
    resistanceAll: 0.45,
    initialDuration: 10,
    totalDuration: 120,
    levelShift: 1,
  },
  'barrier_total_radial_invocation': {
    defenseAll: 0.45,
    resistanceAll: 0.45,
    initialDuration: 10,
    totalDuration: 120,
    levelShift: 1,
  },
  'barrier_core_epiphany': {
    defenseAll: 0.575,
    resistanceAll: 0.575,
    initialDuration: 10,
    totalDuration: 120,
    levelShift: 1,
  },
  'barrier_radial_epiphany': {
    defenseAll: 0.575,
    resistanceAll: 0.575,
    initialDuration: 10,
    totalDuration: 120,
    levelShift: 1,
  },

  // ========== REBIRTH ==========
  // Healing & Regeneration
  'rebirth_genome': {
    healPercent: 0.25,
    regeneration: 1.0,
    initialDuration: 15,
    totalDuration: 120,
  },
  'rebirth_core_genome': {
    healPercent: 0.40,
    regeneration: 2.0,
    initialDuration: 15,
    totalDuration: 120,
  },
  'rebirth_radial_genome': {
    healPercent: 0.40,
    regeneration: 2.0,
    recovery: 0.50,
    initialDuration: 15,
    totalDuration: 120,
  },
  'rebirth_total_core_invocation': {
    healPercent: 0.50,
    regeneration: 3.0,
    initialDuration: 15,
    totalDuration: 120,
    levelShift: 1,
  },
  'rebirth_partial_core_invocation': {
    healPercent: 0.50,
    regeneration: 3.0,
    recovery: 0.50,
    initialDuration: 15,
    totalDuration: 120,
    levelShift: 1,
  },
  'rebirth_partial_radial_invocation': {
    healPercent: 0.50,
    regeneration: 3.0,
    recovery: 0.75,
    initialDuration: 15,
    totalDuration: 120,
    levelShift: 1,
  },
  'rebirth_total_radial_invocation': {
    healPercent: 0.50,
    regeneration: 3.0,
    recovery: 0.75,
    maxEndurance: 0.20,
    initialDuration: 15,
    totalDuration: 120,
    levelShift: 1,
  },
  'rebirth_core_epiphany': {
    healPercent: 0.75,
    regeneration: 5.0,
    recovery: 0.50,
    initialDuration: 15,
    totalDuration: 120,
    levelShift: 1,
  },
  'rebirth_radial_epiphany': {
    healPercent: 0.75,
    regeneration: 5.0,
    recovery: 1.0,
    maxEndurance: 0.30,
    initialDuration: 15,
    totalDuration: 120,
    levelShift: 1,
  },

  // ========== CLARION ==========
  // Mez Protection
  'clarion_genome': {
    mezProtection: 10,
    initialDuration: 60,
    totalDuration: 120,
  },
  'clarion_core_genome': {
    mezProtection: 15,
    initialDuration: 60,
    totalDuration: 120,
  },
  'clarion_radial_genome': {
    mezProtection: 15,
    initialDuration: 60,
    totalDuration: 120,
  },
  'clarion_total_core_invocation': {
    mezProtection: 20,
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },
  'clarion_partial_core_invocation': {
    mezProtection: 20,
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },
  'clarion_partial_radial_invocation': {
    mezProtection: 20,
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },
  'clarion_total_radial_invocation': {
    mezProtection: 20,
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },
  'clarion_core_epiphany': {
    mezProtection: 100,  // Effectively full protection
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },
  'clarion_radial_epiphany': {
    mezProtection: 100,
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },

  // ========== AGELESS ==========
  // Recovery & Recharge
  'ageless_genome': {
    recovery: 1.0,
    recharge: 0.30,
    initialDuration: 60,
    totalDuration: 120,
  },
  'ageless_core_genome': {
    recovery: 1.5,
    recharge: 0.40,
    initialDuration: 60,
    totalDuration: 120,
  },
  'ageless_radial_genome': {
    recovery: 1.5,
    recharge: 0.40,
    initialDuration: 60,
    totalDuration: 120,
  },
  'ageless_total_core_invocation': {
    recovery: 2.0,
    recharge: 0.50,
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },
  'ageless_partial_core_invocation': {
    recovery: 2.0,
    recharge: 0.50,
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },
  'ageless_partial_radial_invocation': {
    recovery: 2.0,
    recharge: 0.50,
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },
  'ageless_total_radial_invocation': {
    recovery: 2.0,
    recharge: 0.50,
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },
  'ageless_core_epiphany': {
    recovery: 3.0,
    recharge: 0.70,
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },
  'ageless_radial_epiphany': {
    recovery: 3.0,
    recharge: 0.70,
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },

  // ========== INCANDESCENCE ==========
  // Damage & ToHit buff
  'incandescence_genome': {
    damage: 0.15,
    toHit: 0.10,
    initialDuration: 60,
    totalDuration: 120,
  },
  'incandescence_core_genome': {
    damage: 0.20,
    toHit: 0.15,
    initialDuration: 60,
    totalDuration: 120,
  },
  'incandescence_radial_genome': {
    damage: 0.20,
    toHit: 0.15,
    initialDuration: 60,
    totalDuration: 120,
  },
  'incandescence_total_core_invocation': {
    damage: 0.25,
    toHit: 0.20,
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },
  'incandescence_partial_core_invocation': {
    damage: 0.25,
    toHit: 0.20,
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },
  'incandescence_partial_radial_invocation': {
    damage: 0.25,
    toHit: 0.20,
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },
  'incandescence_total_radial_invocation': {
    damage: 0.25,
    toHit: 0.20,
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },
  'incandescence_core_epiphany': {
    damage: 0.35,
    toHit: 0.25,
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },
  'incandescence_radial_epiphany': {
    damage: 0.35,
    toHit: 0.25,
    initialDuration: 60,
    totalDuration: 120,
    levelShift: 1,
  },
};

// ============================================
// HYBRID EFFECTS DATA
// ============================================

const HYBRID_EFFECTS: Record<string, HybridEffects> = {
  // ========== ASSAULT ==========
  // Damage bonuses
  'assault_genome': {
    damageProc: 0.10,
    duration: 120,
    recharge: 120,
  },
  'assault_core_genome': {
    damageProc: 0.15,
    duration: 120,
    recharge: 120,
  },
  'assault_radial_genome': {
    doublehitChance: 0.10,
    duration: 120,
    recharge: 120,
  },
  'assault_total_core_graft': {
    damageProc: 0.20,
    duration: 120,
    recharge: 120,
  },
  'assault_partial_core_graft': {
    damageProc: 0.15,
    doublehitChance: 0.10,
    duration: 120,
    recharge: 120,
  },
  'assault_partial_radial_graft': {
    damageProc: 0.10,
    doublehitChance: 0.15,
    duration: 120,
    recharge: 120,
  },
  'assault_total_radial_graft': {
    doublehitChance: 0.20,
    duration: 120,
    recharge: 120,
  },
  'assault_core_embodiment': {
    damageProc: 0.25,
    duration: 120,
    recharge: 120,
  },
  'assault_radial_embodiment': {
    doublehitChance: 0.25,
    duration: 120,
    recharge: 120,
  },

  // ========== SUPPORT ==========
  // Team buffs
  'support_genome': {
    damage: 0.10,
    defense: 0.05,
    duration: 120,
    recharge: 120,
  },
  'support_core_genome': {
    damage: 0.15,
    defense: 0.075,
    duration: 120,
    recharge: 120,
  },
  'support_radial_genome': {
    damage: 0.15,
    accuracy: 0.10,
    defense: 0.075,
    duration: 120,
    recharge: 120,
  },
  'support_total_core_graft': {
    damage: 0.20,
    accuracy: 0.15,
    defense: 0.10,
    duration: 120,
    recharge: 120,
  },
  'support_partial_core_graft': {
    damage: 0.15,
    defense: 0.10,
    duration: 120,
    recharge: 120,
  },
  'support_partial_radial_graft': {
    damage: 0.15,
    accuracy: 0.10,
    defense: 0.075,
    duration: 120,
    recharge: 120,
  },
  'support_total_radial_graft': {
    damage: 0.20,
    accuracy: 0.15,
    defense: 0.10,
    duration: 120,
    recharge: 120,
  },
  'support_core_embodiment': {
    damage: 0.25,
    accuracy: 0.20,
    defense: 0.15,
    duration: 120,
    recharge: 120,
  },
  'support_radial_embodiment': {
    damage: 0.25,
    accuracy: 0.20,
    defense: 0.15,
    duration: 120,
    recharge: 120,
  },

  // ========== MELEE ==========
  // Defensive bonuses
  'melee_genome': {
    regeneration: 1.0,
    duration: 120,
    recharge: 120,
  },
  'melee_core_genome': {
    regeneration: 1.5,
    resistanceAll: 0.05,
    duration: 120,
    recharge: 120,
  },
  'melee_radial_genome': {
    regeneration: 1.5,
    defenseAll: 0.03,
    duration: 120,
    recharge: 120,
  },
  'melee_total_core_graft': {
    regeneration: 2.0,
    resistanceAll: 0.10,
    statusProtection: 3,
    duration: 120,
    recharge: 120,
  },
  'melee_partial_core_graft': {
    regeneration: 1.5,
    resistanceAll: 0.075,
    duration: 120,
    recharge: 120,
  },
  'melee_partial_radial_graft': {
    regeneration: 1.5,
    defenseAll: 0.05,
    duration: 120,
    recharge: 120,
  },
  'melee_total_radial_graft': {
    regeneration: 2.0,
    defenseAll: 0.07,
    statusProtection: 3,
    duration: 120,
    recharge: 120,
  },
  'melee_core_embodiment': {
    regeneration: 2.5,
    resistanceAll: 0.15,
    statusProtection: 5,
    duration: 120,
    recharge: 120,
  },
  'melee_radial_embodiment': {
    regeneration: 2.5,
    defenseAll: 0.10,
    statusProtection: 5,
    duration: 120,
    recharge: 120,
  },

  // ========== CONTROL ==========
  // Mez effects (for display, not dashboard stats)
  'control_genome': {
    mezMagnitudeBonus: 0,
    duration: 120,
    recharge: 120,
  },
  'control_core_genome': {
    mezMagnitudeBonus: 1,
    duration: 120,
    recharge: 120,
  },
  'control_radial_genome': {
    mezMagnitudeBonus: 0,
    duration: 120,
    recharge: 120,
  },
  'control_total_core_graft': {
    mezMagnitudeBonus: 1,
    duration: 120,
    recharge: 120,
  },
  'control_partial_core_graft': {
    mezMagnitudeBonus: 1,
    duration: 120,
    recharge: 120,
  },
  'control_partial_radial_graft': {
    mezMagnitudeBonus: 1,
    duration: 120,
    recharge: 120,
  },
  'control_total_radial_graft': {
    mezMagnitudeBonus: 0,
    duration: 120,
    recharge: 120,
  },
  'control_core_embodiment': {
    mezMagnitudeBonus: 1,
    duration: 120,
    recharge: 120,
  },
  'control_radial_embodiment': {
    mezMagnitudeBonus: 0,
    duration: 120,
    recharge: 120,
  },
};

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
    dotType: 'Toxic',
    dotDamage: 0.20,
    debuffType: '-Resistance',
    debuffMagnitude: 0.05,
    procChance: 0.20,
  },
  'reactive_core_interface': {
    dotType: 'Toxic',
    dotDamage: 0.30,
    debuffType: '-Resistance',
    debuffMagnitude: 0.10,
    procChance: 0.20,
  },
  'reactive_radial_interface': {
    dotType: 'Toxic',
    dotDamage: 0.20,
    debuffType: '-Resistance',
    debuffMagnitude: 0.075,
    procChance: 0.30,
  },
  'reactive_total_core_conversion': {
    dotType: 'Toxic',
    dotDamage: 0.40,
    debuffType: '-Resistance',
    debuffMagnitude: 0.15,
    procChance: 0.20,
  },
  'reactive_partial_core_conversion': {
    dotType: 'Toxic',
    dotDamage: 0.35,
    debuffType: '-Resistance',
    debuffMagnitude: 0.125,
    procChance: 0.25,
  },
  'reactive_partial_radial_conversion': {
    dotType: 'Toxic',
    dotDamage: 0.25,
    debuffType: '-Resistance',
    debuffMagnitude: 0.10,
    procChance: 0.35,
  },
  'reactive_total_radial_conversion': {
    dotType: 'Toxic',
    dotDamage: 0.15,
    debuffType: '-Resistance',
    debuffMagnitude: 0.075,
    procChance: 0.50,
  },
  'reactive_core_flawless_interface': {
    dotType: 'Toxic',
    dotDamage: 0.50,
    debuffType: '-Resistance',
    debuffMagnitude: 0.20,
    procChance: 0.25,
  },
  'reactive_radial_flawless_interface': {
    dotType: 'Toxic',
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
};

// ============================================
// JUDGEMENT EFFECTS DATA
// ============================================

const JUDGEMENT_EFFECTS: Record<string, JudgementEffects> = {
  // ========== CRYONIC ==========
  // Ranged Cone, Cold damage
  'cryonic_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 80, radius: 80, arc: 30,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: [],
  },
  'cryonic_core_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 80, radius: 80, arc: 30,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'cryonic_radial_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 80, radius: 80, arc: 30,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['-Speed', '-Recharge'],
  },
  'cryonic_total_core_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 80, radius: 80, arc: 30,
    maxTargets: 24, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'cryonic_partial_core_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 80, radius: 80, arc: 30,
    maxTargets: 24, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Judgement Critical (20% chance)', '-Speed', '-Recharge'],
  },
  'cryonic_partial_radial_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 120, radius: 120, arc: 45,
    maxTargets: 32, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['-Speed', '-Recharge'],
  },
  'cryonic_total_radial_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 80, radius: 80, arc: 30,
    maxTargets: 24, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['-Speed', '-Recharge', 'Hold (25% chance)'],
  },
  'cryonic_core_final_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 120, radius: 120, arc: 45,
    maxTargets: 32, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'cryonic_radial_final_judgement': {
    damageType: 'Cold', effectArea: 'Cone', range: 120, radius: 120, arc: 45,
    maxTargets: 32, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['-Speed', '-Recharge', 'Hold (25% chance)'],
  },

  // ========== ION ==========
  // Chain Ranged AoE, Energy damage
  'ion_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: [],
  },
  'ion_core_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'ion_radial_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['-Endurance', '-Recovery'],
  },
  'ion_total_core_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'ion_partial_core_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Judgement Critical (20% chance)', '-Endurance', '-Recovery'],
  },
  'ion_partial_radial_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['-Endurance', '-Recovery'],
  },
  'ion_total_radial_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['-Endurance', '-Recovery', 'Hold (25% chance)'],
  },
  'ion_core_final_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'ion_radial_final_judgement': {
    damageType: 'Energy', effectArea: 'Chain', range: 80, radius: 0, arc: 0,
    maxTargets: 0, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['-Endurance', '-Recovery', 'Hold (25% chance)'],
  },

  // ========== MIGHTY ==========
  // PBAoE, Smashing damage
  'mighty_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: [],
  },
  'mighty_core_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'mighty_radial_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Knockup (50% chance)'],
  },
  'mighty_total_core_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'mighty_partial_core_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 50, arc: 0,
    maxTargets: 24, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'mighty_partial_radial_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 50, arc: 0,
    maxTargets: 32, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Knockup (50% chance)'],
  },
  'mighty_total_radial_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Knockup'],
  },
  'mighty_core_final_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 50, arc: 0,
    maxTargets: 24, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'mighty_radial_final_judgement': {
    damageType: 'Smashing', effectArea: 'PBAoE', range: 0, radius: 50, arc: 0,
    maxTargets: 32, activationTime: 2.93, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Knockup'],
  },

  // ========== PYRONIC ==========
  // Targeted Ranged AoE, Fire damage
  'pyronic_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 25, arc: 0,
    maxTargets: 16, activationTime: 1, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: [],
  },
  'pyronic_core_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 25, arc: 0,
    maxTargets: 16, activationTime: 1, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['DoT (Fire)'],
  },
  'pyronic_radial_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 40, arc: 0,
    maxTargets: 24, activationTime: 1, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: [],
  },
  'pyronic_total_core_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 25, arc: 0,
    maxTargets: 16, activationTime: 1, rechargeTime: 90, damageScale: 3.5,
    secondaryEffects: ['Superior DoT (Fire)'],
  },
  'pyronic_partial_core_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 25, arc: 0,
    maxTargets: 16, activationTime: 1, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['DoT (Fire)'],
  },
  'pyronic_partial_radial_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 40, arc: 0,
    maxTargets: 32, activationTime: 1, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: [],
  },
  'pyronic_total_radial_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 40, arc: 0,
    maxTargets: 24, activationTime: 1, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Stun (25% chance)'],
  },
  'pyronic_core_final_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 40, arc: 0,
    maxTargets: 24, activationTime: 1, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['DoT (Fire)'],
  },
  'pyronic_radial_final_judgement': {
    damageType: 'Fire', effectArea: 'Targeted AoE', range: 80, radius: 40, arc: 0,
    maxTargets: 32, activationTime: 1, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Stun (25% chance)'],
  },

  // ========== VOID ==========
  // PBAoE, Negative Energy damage
  'void_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: [],
  },
  'void_core_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'void_radial_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['-Damage'],
  },
  'void_total_core_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'void_partial_core_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Judgement Critical (20% chance)', 'Knockback'],
  },
  'void_partial_radial_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 30, arc: 0,
    maxTargets: 16, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['-Damage', 'Knockback'],
  },
  'void_total_radial_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 50, arc: 0,
    maxTargets: 24, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['-Damage'],
  },
  'void_core_final_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 50, arc: 0,
    maxTargets: 24, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Judgement Critical (20% chance)'],
  },
  'void_radial_final_judgement': {
    damageType: 'Negative Energy', effectArea: 'PBAoE', range: 0, radius: 50, arc: 0,
    maxTargets: 32, activationTime: 2, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['-Damage'],
  },

  // ========== VORPAL ==========
  // Self-Targeted Cone, Smashing damage (+ Lethal DoT on core path)
  'vorpal_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 80, radius: 80, arc: 80,
    maxTargets: 20, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: [],
  },
  'vorpal_core_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 80, radius: 80, arc: 80,
    maxTargets: 20, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['DoT (Lethal)'],
  },
  'vorpal_radial_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 80, radius: 80, arc: 120,
    maxTargets: 30, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: [],
  },
  'vorpal_total_core_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 120, radius: 120, arc: 80,
    maxTargets: 20, activationTime: 2.5, rechargeTime: 90, damageScale: 3.5,
    secondaryEffects: ['Superior DoT (Lethal)'],
  },
  'vorpal_partial_core_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 120, radius: 120, arc: 80,
    maxTargets: 20, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['DoT (Lethal)'],
  },
  'vorpal_partial_radial_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 80, radius: 80, arc: 120,
    maxTargets: 40, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: [],
  },
  'vorpal_total_radial_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 80, radius: 80, arc: 120,
    maxTargets: 30, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['Self +Defense (All)'],
  },
  'vorpal_core_final_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 120, radius: 120, arc: 120,
    maxTargets: 30, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0,
    secondaryEffects: ['DoT (Lethal)'],
  },
  'vorpal_radial_final_judgement': {
    damageType: 'Smashing', effectArea: 'Self Cone', range: 120, radius: 120, arc: 120,
    maxTargets: 40, activationTime: 2.5, rechargeTime: 90, damageScale: 4.0,
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
