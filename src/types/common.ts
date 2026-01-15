/**
 * Common types and enums used throughout the application
 */

// ============================================
// DAMAGE TYPES
// ============================================

export type DamageType =
  | 'Smashing'
  | 'Lethal'
  | 'Fire'
  | 'Cold'
  | 'Energy'
  | 'Negative'
  | 'Psionic'
  | 'Toxic';

// ============================================
// DEFENSE/RESISTANCE TYPES
// ============================================

export type DefenseType =
  | 'Smashing'
  | 'Lethal'
  | 'Fire'
  | 'Cold'
  | 'Energy'
  | 'Negative'
  | 'Psionic'
  | 'Melee'
  | 'Ranged'
  | 'AoE';

// ============================================
// ENHANCEMENT STAT TYPES
// ============================================

export type EnhancementStatType =
  | 'Damage'
  | 'Accuracy'
  | 'Recharge'
  | 'EnduranceReduction'
  | 'Range'
  | 'Defense'
  | 'Resistance'
  | 'Healing'
  | 'ToHit'
  | 'ToHit Debuff'
  | 'Defense Debuff'
  | 'Hold'
  | 'Stun'
  | 'Immobilize'
  | 'Sleep'
  | 'Confuse'
  | 'Fear'
  | 'Knockback'
  | 'Run Speed'
  | 'Jump'
  | 'Fly'
  | 'Mez Duration'
  | 'Taunt'
  | 'Slow'
  | 'Intangible';

// ============================================
// POWER TYPES
// ============================================

export type PowerType = 'Click' | 'Toggle' | 'Auto' | 'Passive';

export type TargetType =
  | 'Self'
  | 'Foe (Alive)'
  | 'Foe (Dead)'
  | 'Friend (Alive)'
  | 'Friend (Dead)'
  | 'Location'
  | 'Any';

export type EffectArea =
  | 'SingleTarget'
  | 'AoE'
  | 'Cone'
  | 'Location'
  | 'Chain';

// ============================================
// CHARACTER ORIGIN
// ============================================

export type Origin =
  | 'Magic'
  | 'Mutation'
  | 'Natural'
  | 'Science'
  | 'Technology';

// ============================================
// FACTION
// ============================================

export type Faction = 'hero' | 'villain';

// ============================================
// IO SET CATEGORIES
// ============================================

export type IOSetCategory =
  // Standard categories
  | 'Ranged Damage'
  | 'Melee Damage'
  | 'Ranged AoE Damage'
  | 'Melee AoE Damage'
  | 'PBAoE Damage'
  | 'Targeted AoE Damage'
  | 'Universal Damage Sets'
  // Defense/Resistance
  | 'Defense'
  | 'Resistance'
  // Control
  | 'Hold'
  | 'Stuns'
  | 'Immobilize'
  | 'Sleep'
  | 'Confuse'
  | 'Fear'
  // Support
  | 'Healing'
  | 'Endurance Modification'
  | 'ToHit Buff'
  | 'ToHit Debuff'
  | 'Defense Debuff'
  | 'Knockback'
  | 'Slow'
  | 'Taunt'
  // Travel
  | 'Running'
  | 'Running & Sprints'
  | 'Jumping'
  | 'Flight'
  | 'Universal Travel'
  | 'Teleportation'
  // Pets
  | 'Pet Damage'
  | 'Pet Defense'
  | 'Pet Resistance'
  // Archetype-specific
  | 'Blaster Archetype Sets'
  | 'Brute Archetype Sets'
  | 'Controller Archetype Sets'
  | 'Corruptor Archetype Sets'
  | 'Defender Archetype Sets'
  | 'Dominator Archetype Sets'
  | 'Mastermind Archetype Sets'
  | 'Scrapper Archetype Sets'
  | 'Stalker Archetype Sets'
  | 'Tanker Archetype Sets'
  | 'Sentinel Archetype Sets';

// ============================================
// IO SET RARITY
// ============================================

export type IOSetRarity =
  | 'io-set'      // Standard IO sets
  | 'uncommon'    // Uncommon IO sets
  | 'rare'        // Rare IO sets
  | 'very-rare'   // Very rare (including some ATOs)
  | 'purple'      // Purple sets (very rare)
  | 'pvp'         // PvP IO sets
  | 'event'       // Winter/Event IOs
  | 'archetype';  // Archetype-specific sets

// ============================================
// ENHANCEMENT TIER (SO/DO/TO)
// ============================================

export type EnhancementTier = 'TO' | 'DO' | 'SO';

export interface OriginTierInfo {
  name: string;
  short: EnhancementTier;
  value: number;
  description: string;
}

// ============================================
// PROGRESSION MODE
// ============================================

export type ProgressionMode = 'auto' | 'freeform';
