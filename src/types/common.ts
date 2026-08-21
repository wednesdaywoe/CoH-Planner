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

export type PowerType = 'Click' | 'Toggle' | 'Auto' | 'Passive' | 'Global Enhancement';

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
  | 'Chain'
  // Whole-map reach, which the export states outright. Rare on a player power and
  // absent from `EFFECT_AREA_MAP`, so the converter passes it through unmapped —
  // Time Bomb's remote-detonation branch is the case. Carried rather than dropped:
  // the alternative is a form whose area silently reads as its base record's.
  | 'Map';

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

/**
 * Every slot-category heading the three forks state, verbatim.
 *
 * This is `BoostSet.GroupName` — the field the client itself groups a power's
 * "AllowedBoostCategories" tooltip by, and the field both sides of a slotting match
 * now read (`_boostsets.py::_resolve_category`). The forks rename three of them, so
 * both spellings are members: Homecoming says "Melee AoE Damage", "Ranged AoE Damage"
 * and "Threat Duration" where Rebirth and Thunderspy say "PBAoE Damage", "Targeted
 * AoE Damage" and "Taunt". Homecoming ships 47 headings, Rebirth 49, Thunderspy 45.
 *
 * Kept as a `const` array, not a bare union, so the list survives to runtime and
 * `io-set-slotting-reach.test.ts` can hold the shipped data against it — every set's
 * `type` and every power's `allowedSetCategories`, on all three forks. A bare union
 * is a compile-time claim no fixture can grade.
 */
export const IO_SET_CATEGORIES = [
  // Damage
  'Ranged Damage',
  'Melee Damage',
  'Ranged AoE Damage',
  'Targeted AoE Damage',
  'Melee AoE Damage',
  'PBAoE Damage',
  'Universal Damage Sets',
  'Sniper Attacks',
  'Pet Damage',
  'Recharge Intensive Pets',
  // Defense / Resistance
  'Defense Sets',
  'Resist Damage',
  // Control (Mez)
  'Holds',
  'Stuns',
  'Immobilize',
  'Sleep',
  'Confuse',
  'Fear',
  'Knockback',
  // Support / Debuff
  'Healing',
  'Endurance Modification',
  'To Hit Buff',
  'To Hit Debuff',
  'Defense Debuff',
  'Slow Movement',
  'Threat Duration',
  'Taunt',
  'Accurate Defense Debuff',
  'Accurate Healing',
  'Accurate To-Hit Debuff',
  // Travel. Homecoming splits the two Sprint-slottable pools into their own
  // headings; the forks state one heading each and slot Sprint under it.
  'Running',
  'Running & Sprints',
  'Leaping',
  'Leaping & Sprints',
  'Flight',
  'Teleport',
  'Universal Travel',
  // Archetype. One heading per AT covers both the ATO and its Superior tier.
  'Blaster Archetype Sets',
  'Brute Archetype Sets',
  'Controller Archetype Sets',
  'Corruptor Archetype Sets',
  'Defender Archetype Sets',
  'Dominator Archetype Sets',
  'Mastermind Archetype Sets',
  'Scrapper Archetype Sets',
  'Stalker Archetype Sets',
  'Tanker Archetype Sets',
  'Sentinel Archetype Sets',
  'Kheldian Archetype Sets',
  'Soldiers of Arachnos Archetype Sets',
  'Guardian Archetype Sets',
  'Primalist Archetype Sets',
  // Event and challenge-reward sets, all Rebirth-only bar the Primalist ATOs above.
  'Universal Control Duration Sets',
  'Rest Buff',
  'Universal Debuff',
  'Rez Sets',
] as const;

export type IOSetCategory = (typeof IO_SET_CATEGORIES)[number];

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

/** Presentation metadata for a TO/DO/SO tier. Enhancement values are
 * per-aspect data from the dataset's enhancement curves (`getOriginTierValue`),
 * not a tier property. */
export interface OriginTierInfo {
  name: string;
  short: EnhancementTier;
  description: string;
}

// ============================================
// PROGRESSION MODE
// ============================================

export type ProgressionMode = 'auto' | 'freeform';
