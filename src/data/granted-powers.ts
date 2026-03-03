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
 */

export interface GrantedPowerGroup {
  /** The parent power that grants sub-powers */
  parentPower: string;
  /** List of power names that are granted */
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
 * Key is the parent power name, value describes the granted powers
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
    grantedPowers: ['Defensive Adaptation', 'Efficient Adaptation', 'Offensive Adaptation'],
    mutuallyExclusive: true,
    description: 'Bio Armor stances - only one can be active at a time',
  },

  // ============================================
  // DUAL PISTOLS - Ammunition types
  // ============================================
  'Swap Ammo': {
    parentPower: 'Swap Ammo',
    grantedPowers: ['Chemical Ammunition', 'Cryo Ammunition', 'Incendiary Ammunition'],
    mutuallyExclusive: true,
    description: 'Ammunition types - only one can be active at a time',
  },

  // ============================================
  // BROAD SWORD - Slice variants
  // ============================================
  'Slice': {
    parentPower: 'Slice',
    grantedPowers: ['Boomerang Slice'],
    mutuallyExclusive: true,
    description: 'Broad Sword cone variants - choose Slice or Boomerang Slice',
  },

  // ============================================
  // STAFF FIGHTING - Form stances
  // ============================================
  'Form of the Body': {
    parentPower: 'Form of the Body',
    grantedPowers: [],
    mutuallyExclusive: false,
  },
  'Form of the Mind': {
    parentPower: 'Form of the Mind',
    grantedPowers: [],
    mutuallyExclusive: false,
  },
  'Form of the Soul': {
    parentPower: 'Form of the Soul',
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
  'Super Jump': {
    parentPower: 'Super Jump',
    grantedPowers: ['Double Jump'],
    mutuallyExclusive: false,
    description: 'Double Jump available while Super Jump is active',
  },
  // Also Long Jump grants Double Jump
  'Long Jump': {
    parentPower: 'Long Jump',
    grantedPowers: ['Double Jump'],
    mutuallyExclusive: false,
    description: 'Double Jump available while Long Jump is active',
  },

  // Speed Pool
  'Super Speed': {
    parentPower: 'Super Speed',
    grantedPowers: ['Speed Phase'],
    mutuallyExclusive: false,
    description: 'Speed Phase available while Super Speed is active',
  },

  // Sorcery Pool
  'Mystic Flight': {
    parentPower: 'Mystic Flight',
    grantedPowers: ['Translocation'],
    mutuallyExclusive: false,
    description: 'Translocation teleport available while Mystic Flight is active',
  },
  // Arcane Bolt grants Arcane Power
  'Arcane Bolt': {
    parentPower: 'Arcane Bolt',
    grantedPowers: ['Arcane Power'],
    mutuallyExclusive: false,
    description: 'Arcane Power buff after using Arcane Bolt',
  },

  // Experimentation Pool
  'Speed of Sound': {
    parentPower: 'Speed of Sound',
    grantedPowers: ['Jaunt'],
    mutuallyExclusive: false,
    description: 'Jaunt teleport available while Speed of Sound is active',
  },

  // Force of Will Pool
  'Mighty Leap': {
    parentPower: 'Mighty Leap',
    grantedPowers: ['Takeoff'],
    mutuallyExclusive: false,
    description: 'Takeoff ground pound available with Mighty Leap',
  },

  // ============================================
  // KHELDIAN FORM POWERS (slottable sub-powers)
  // ============================================

  // Peacebringer - Bright Nova (offensive form, level 3)
  'Bright Nova': {
    parentPower: 'Bright Nova',
    grantedPowers: ['Bright Nova Bolt', 'Bright Nova Blast', 'Bright Nova Scatter', 'Bright Nova Detonation'],
    mutuallyExclusive: false,
    slottable: true,
    description: 'Bright Nova form attack powers',
  },

  // Peacebringer - White Dwarf (defensive form, level 19)
  'White Dwarf': {
    parentPower: 'White Dwarf',
    grantedPowers: ['White Dwarf Strike', 'White Dwarf Smite', 'White Dwarf Flare', 'White Dwarf Sublimation', 'White Dwarf Step', 'White Dwarf Antagonize'],
    mutuallyExclusive: false,
    slottable: true,
    description: 'White Dwarf form powers',
  },

  // Warshade - Dark Nova (offensive form, level 3)
  'Dark Nova': {
    parentPower: 'Dark Nova',
    grantedPowers: ['Dark Nova Bolt', 'Dark Nova Blast', 'Dark Nova Emanation', 'Dark Nova Detonation'],
    mutuallyExclusive: false,
    slottable: true,
    description: 'Dark Nova form attack powers',
  },

  // Warshade - Black Dwarf (defensive form, level 19)
  'Black Dwarf': {
    parentPower: 'Black Dwarf',
    grantedPowers: ['Black Dwarf Strike', 'Black Dwarf Smite', 'Black Dwarf Drain', 'Black Dwarf Mire', 'Black Dwarf Step', 'Black Dwarf Antagonize'],
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

