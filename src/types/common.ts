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
  | 'Intangible'
  | 'EnduranceModification'
  | 'Interrupt'
  | 'Absorb';

// ============================================
// POWER TYPES
// ============================================

export type PowerType = 'Click' | 'Toggle' | 'Auto' | 'Passive';

export type TargetType =
  | 'Self'
  | 'Foe'
  | 'Foe (Alive)'
  | 'Foe (Dead)'
  | 'Friend'
  | 'Friend (Alive)'
  | 'Friend (Dead)'
  | 'Ally'
  | 'Ally (Alive)'
  | 'Own Pet (Alive)'
  | 'Teammate'
  | 'Teammate (Alive)'
  | 'Teammate (Dead)'
  | 'DeadFoe'
  | 'DeadOrAlive Teammate'
  | 'Dead Teammate'
  | 'Player Ally (Dead)'
  | 'Leaguemate (Dead)'
  | 'Location'
  | 'Location (Teleport)'
  | 'Teleport'
  | 'Any'
  | 'Any (Alive)';

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
  // Damage categories
  | 'Ranged Damage'
  | 'Melee Damage'
  | 'Ranged AoE Damage'
  | 'Melee AoE Damage'
  | 'Universal Damage Sets'
  | 'Sniper Attacks'
  | 'Pet Damage'
  | 'Recharge Intensive Pets'
  // Defense/Resistance
  | 'Defense Sets'
  | 'Resist Damage'
  // Control (Mez)
  | 'Holds'
  | 'Stuns'
  | 'Immobilize'
  | 'Sleep'
  | 'Confuse'
  | 'Fear'
  | 'Knockback'
  // Support/Debuff
  | 'Healing'
  | 'Endurance Modification'
  | 'To Hit Buff'
  | 'To Hit Debuff'
  | 'Defense Debuff'
  | 'Slow Movement'
  | 'Threat Duration'
  | 'Accurate Defense Debuff'
  | 'Accurate Healing'
  | 'Accurate To-Hit Debuff'
  // Travel
  | 'Running'
  | 'Running & Sprints'
  | 'Leaping'
  | 'Leaping & Sprints'
  | 'Flight'
  | 'Teleport'
  | 'Universal Travel'
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
  | 'Sentinel Archetype Sets'
  | 'Kheldian Archetype Sets'
  | 'Soldiers of Arachnos Archetype Sets';

// ============================================
// IO SET RARITY
// ============================================

export type IOSetRarity =
  | 'uncommon'  // Uncommon IO sets
  | 'rare'      // Rare IO sets
  | 'purple'    // Purple sets (very rare level 50)
  | 'ato'       // Archetype Origin sets (from Super Packs)
  | 'pvp'       // PvP IO sets
  | 'event';    // Winter/Event IOs

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
