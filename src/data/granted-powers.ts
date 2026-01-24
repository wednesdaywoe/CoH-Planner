/**
 * Granted Powers - maps parent powers to their automatically granted sub-powers
 *
 * Some powers in City of Heroes grant additional powers when taken.
 * For example:
 * - Adaptation grants Defensive, Efficient, and Offensive Adaptation toggles
 * - Swap Ammo grants Chemical, Cryo, and Incendiary Ammunition toggles
 *
 * These granted powers typically:
 * - Have available: -1 in the data (meaning they can't be selected directly)
 * - Have maxSlots: 0 (can't be enhanced)
 * - May be mutually exclusive toggles (only one active at a time)
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
}

/**
 * Curated list of powers that grant sub-powers
 * Key is the parent power name, value describes the granted powers
 */
export const GRANTED_POWER_GROUPS: Record<string, GrantedPowerGroup> = {
  // Bio Armor - Adaptation
  'Adaptation': {
    parentPower: 'Adaptation',
    grantedPowers: ['Defensive Adaptation', 'Efficient Adaptation', 'Offensive Adaptation'],
    mutuallyExclusive: true,
    description: 'Bio Armor stances - only one can be active at a time',
  },

  // Dual Pistols - Swap Ammo
  'Swap Ammo': {
    parentPower: 'Swap Ammo',
    grantedPowers: ['Chemical Ammunition', 'Cryo Ammunition', 'Incendiary Ammunition'],
    mutuallyExclusive: true,
    description: 'Ammunition types - only one can be active at a time',
  },

  // Staff Fighting - Form of the Body/Mind/Soul
  'Form of the Body': {
    parentPower: 'Form of the Body',
    grantedPowers: [],
    mutuallyExclusive: false,
  },

  // Water Blast - Tidal Forces (if it grants sub-powers)
  // Add more as needed...
};

/**
 * Check if a power grants sub-powers
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

/**
 * Get list of granted power names for a parent power
 */
export function getGrantedPowerNames(powerName: string): string[] {
  return GRANTED_POWER_GROUPS[powerName]?.grantedPowers || [];
}

/**
 * Check if granted powers are mutually exclusive
 */
export function arePowersMutuallyExclusive(powerName: string): boolean {
  return GRANTED_POWER_GROUPS[powerName]?.mutuallyExclusive ?? false;
}

/**
 * Get the parent power for a granted sub-power
 */
export function getParentPower(subPowerName: string): string | null {
  for (const [parentName, group] of Object.entries(GRANTED_POWER_GROUPS)) {
    if (group.grantedPowers.includes(subPowerName)) {
      return parentName;
    }
  }
  return null;
}

/**
 * Check if a power is a granted sub-power
 */
export function isGrantedSubPower(powerName: string): boolean {
  return getParentPower(powerName) !== null;
}

/**
 * Get sibling granted powers (other powers in the same group)
 */
export function getSiblingPowers(subPowerName: string): string[] {
  const parentName = getParentPower(subPowerName);
  if (!parentName) return [];

  const group = GRANTED_POWER_GROUPS[parentName];
  return group.grantedPowers.filter(name => name !== subPowerName);
}
