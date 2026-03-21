/**
 * Granted Powers - maps parent powers to their automatically granted sub-powers
 *
 * Some powers in City of Heroes grant additional powers when taken.
 * For example:
 * - Adaptation grants Defensive, Efficient, and Offensive Adaptation toggles
 * - Fly grants Afterburner
 * - Super Speed grants Speed Phase
 *
 * Detection methods:
 * 1. Power Pools: Use the `requires` field to detect parent-child relationships
 *    - Sub-powers have `available: -1` and `requires: "Pool.<PoolName>.<ParentPowerName>"`
 * 2. Archetype Powersets: Manual curation (no `requires` field in data)
 *    - Sub-powers have `available: -1` but no way to automatically link to parent
 *
 * All keys and power names use internalName format (underscores, no spaces).
 */

export interface GrantedPowerGroup {
  /** The parent power that grants sub-powers (internalName) */
  parentPower: string;
  /** List of power internalNames that are granted */
  grantedPowers: string[];
  /** Whether the granted powers are mutually exclusive (only one can be active) */
  mutuallyExclusive: boolean;
  /** Description of the granted powers group */
  description?: string;
  /** If true, sub-powers accept enhancement slots and are added as full SelectedPower entries (e.g., Kheldian form sub-powers) */
  slottable?: boolean;
}

// ============================================
// CURATED LIST - Archetype Powersets
// These require manual curation because they don't have a `requires` field
// ============================================

/**
 * Curated list of powers that grant sub-powers
 * Key is the parent power internalName, value describes the granted powers
 *
 * Note: Power pool granted powers (like Afterburner from Fly) are detected
 * automatically using the `requires` field in the power data.
 */
export const GRANTED_POWER_GROUPS: Record<string, GrantedPowerGroup> = {
  // ============================================
  // BIO ARMOR - Adaptation stances
  // ============================================
  'Adaptation': {
    parentPower: 'Adaptation',
    grantedPowers: ['Defensive_Adaptation', 'Efficient_Adaptation', 'Offensive_Adaptation'],
    mutuallyExclusive: true,
    description: 'Bio Armor stances - only one can be active at a time',
  },

  // ============================================
  // DUAL PISTOLS - Ammunition types
  // ============================================
  'Swap_Ammo': {
    parentPower: 'Swap_Ammo',
    grantedPowers: ['Chemical_Ammunition', 'Cryo_Ammunition', 'Incendiary_Ammunition'],
    mutuallyExclusive: true,
    description: 'Ammunition types - only one can be active at a time',
  },

  // ============================================
  // BROAD SWORD - Slice variants
  // ============================================
  'Slice': {
    parentPower: 'Slice',
    grantedPowers: ['Boomerang_Slice'],
    mutuallyExclusive: true,
    description: 'Broad Sword cone variants - choose Slice or Boomerang Slice',
  },

  // ============================================
  // STAFF FIGHTING - Form stances
  // ============================================
  'Form_of_the_Body': {
    parentPower: 'Form_of_the_Body',
    grantedPowers: [],
    mutuallyExclusive: false,
  },
  'Form_of_the_Mind': {
    parentPower: 'Form_of_the_Mind',
    grantedPowers: [],
    mutuallyExclusive: false,
  },
  'Form_of_the_Soul': {
    parentPower: 'Form_of_the_Soul',
    grantedPowers: [],
    mutuallyExclusive: false,
  },

  // ============================================
  // POWER POOLS - Travel Powers
  // These are auto-detected but listed here as fallback/documentation
  // ============================================

  // Flight Pool
  'Fly': {
    parentPower: 'Fly',
    grantedPowers: ['Afterburner'],
    mutuallyExclusive: false,
    description: 'Afterburner boost available while Fly is active',
  },

  // Leaping Pool
  'Super_Jump': {
    parentPower: 'Super_Jump',
    grantedPowers: ['Double_Jump'],
    mutuallyExclusive: false,
    description: 'Double Jump available while Super Jump is active',
  },
  // Also Long Jump grants Double Jump
  'Long_Jump': {
    parentPower: 'Long_Jump',
    grantedPowers: ['Double_Jump'],
    mutuallyExclusive: false,
    description: 'Double Jump available while Long Jump is active',
  },

  // Speed Pool
  'Super_Speed': {
    parentPower: 'Super_Speed',
    grantedPowers: ['Speed_Phase'],
    mutuallyExclusive: false,
    description: 'Speed Phase available while Super Speed is active',
  },

  // Sorcery Pool
  'Mystic_Flight': {
    parentPower: 'Mystic_Flight',
    grantedPowers: ['Translocation'],
    mutuallyExclusive: false,
    description: 'Translocation teleport available while Mystic Flight is active',
  },
  // Arcane Bolt grants Arcane Power
  'Arcane_Bolt': {
    parentPower: 'Arcane_Bolt',
    grantedPowers: ['Arcane_Power'],
    mutuallyExclusive: false,
    description: 'Arcane Power buff after using Arcane Bolt',
  },

  // Experimentation Pool
  'Speed_Of_Sound': {
    parentPower: 'Speed_Of_Sound',
    grantedPowers: ['Jaunt'],
    mutuallyExclusive: false,
    description: 'Jaunt teleport available while Speed of Sound is active',
  },

  // Force of Will Pool
  'Mighty_Leap': {
    parentPower: 'Mighty_Leap',
    grantedPowers: ['Takeoff'],
    mutuallyExclusive: false,
    description: 'Takeoff ground pound available with Mighty Leap',
  },

  // ============================================
  // KHELDIAN FORM POWERS (slottable sub-powers)
  // ============================================

  // Peacebringer - Bright Nova (offensive form, level 3)
  'Bright_Nova': {
    parentPower: 'Bright_Nova',
    grantedPowers: ['Bright_Nova_Bolt', 'Bright_Nova_Blast', 'Bright_Nova_Scatter', 'Bright_Nova_Detonation'],
    mutuallyExclusive: false,
    slottable: true,
    description: 'Bright Nova form attack powers',
  },

  // Peacebringer - White Dwarf (defensive form, level 19)
  'White_Dwarf': {
    parentPower: 'White_Dwarf',
    grantedPowers: ['White_Dwarf_Strike', 'White_Dwarf_Smite', 'White_Dwarf_Flare', 'White_Dwarf_Sublimation', 'White_Dwarf_Step', 'White_Dwarf_Antagonize'],
    mutuallyExclusive: false,
    slottable: true,
    description: 'White Dwarf form powers',
  },

  // Warshade - Dark Nova (offensive form, level 3)
  'Dark_Nova': {
    parentPower: 'Dark_Nova',
    grantedPowers: ['Dark_Nova_Bolt', 'Dark_Nova_Blast', 'Dark_Nova_Emanation', 'Dark_Nova_Detonation'],
    mutuallyExclusive: false,
    slottable: true,
    description: 'Dark Nova form attack powers',
  },

  // Warshade - Black Dwarf (defensive form, level 19)
  'Black_Dwarf': {
    parentPower: 'Black_Dwarf',
    grantedPowers: ['Black_Dwarf_Strike', 'Black_Dwarf_Smite', 'Black_Dwarf_Drain', 'Black_Dwarf_Mire', 'Black_Dwarf_Step', 'Black_Dwarf_Antagonize'],
    mutuallyExclusive: false,
    slottable: true,
    description: 'Black Dwarf form powers',
  },
};

// ============================================
// ACCESSOR FUNCTIONS
// ============================================

/**
 * Check if a power grants sub-powers (curated list only)
 */
export function hasGrantedPowers(powerName: string): boolean {
  return powerName in GRANTED_POWER_GROUPS &&
         GRANTED_POWER_GROUPS[powerName].grantedPowers.length > 0;
}

/**
 * Get the granted power group for a parent power
 */
export function getGrantedPowerGroup(powerName: string): GrantedPowerGroup | null {
  return GRANTED_POWER_GROUPS[powerName] || null;
}
