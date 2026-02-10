/**
 * Incarnate System Type Definitions
 *
 * The Incarnate System is available at level 50 and provides 6 special slots
 * with craftable powers organized in trees with 4 tiers.
 */

// ============================================
// CORE TYPES
// ============================================

/**
 * The 6 main incarnate slots
 */
export type IncarnateSlotId = 'alpha' | 'judgement' | 'interface' | 'destiny' | 'lore' | 'hybrid';

/**
 * Power rarity tiers (Common -> Very Rare)
 */
export type IncarnateTier = 'common' | 'uncommon' | 'rare' | 'veryrare';

/**
 * Power branch (core vs radial, or base for tier 1)
 */
export type IncarnateBranch = 'base' | 'core' | 'radial';

// ============================================
// SLOT & TREE DEFINITIONS
// ============================================

/**
 * Definition for an incarnate slot (Alpha, Judgement, etc.)
 */
export interface IncarnateSlotDefinition {
  id: IncarnateSlotId;
  name: string;
  displayName: string;
  icon: string;
  color: string; // UI color for the slot
  trees: IncarnateTree[];
}

/**
 * A tree within a slot (e.g., Musculature, Cardiac for Alpha)
 */
export interface IncarnateTree {
  id: string;           // e.g., "musculature", "cardiac"
  name: string;         // e.g., "Musculature", "Cardiac"
  description: string;  // What this tree focuses on
  powers: IncarnatePower[];
}

// ============================================
// POWER DEFINITIONS
// ============================================

/**
 * An individual incarnate power
 */
export interface IncarnatePower {
  id: string;           // e.g., "musculature_core_paragon"
  fullName: string;     // e.g., "Incarnate.Alpha.Musculature_Core_Paragon"
  displayName: string;  // e.g., "Musculature Core Paragon"
  shortHelp: string;    // Brief description
  displayHelp: string;  // Full description (may contain HTML)
  icon: string;         // Icon filename
  tier: IncarnateTier;
  branch: IncarnateBranch;
  treeId: string;       // Parent tree id
  slotId: IncarnateSlotId;
  powerType: string;    // 'Auto', 'Click', 'Toggle', etc.
}

// ============================================
// BUILD STATE
// ============================================

/**
 * Selected incarnate power in a build
 */
export interface SelectedIncarnatePower {
  slotId: IncarnateSlotId;
  powerId: string;
  powerName: string;
  displayName: string;
  icon: string;
  tier: IncarnateTier;
  treeId: string;
  treeName: string;
}

/**
 * Incarnate state within a build
 */
export interface IncarnateBuildState {
  alpha: SelectedIncarnatePower | null;
  judgement: SelectedIncarnatePower | null;
  interface: SelectedIncarnatePower | null;
  destiny: SelectedIncarnatePower | null;
  lore: SelectedIncarnatePower | null;
  hybrid: SelectedIncarnatePower | null;
}

/**
 * Active state for incarnate slots that provide stat bonuses
 * Alpha, Destiny, Hybrid, Interface can be toggled on/off for dashboard calculations
 */
export interface IncarnateActiveState {
  alpha: boolean;
  destiny: boolean;
  hybrid: boolean;
  interface: boolean;
}

/**
 * Slots that can be toggled for stat calculations
 */
export type ToggleableIncarnateSlot = 'alpha' | 'destiny' | 'hybrid' | 'interface';

// ============================================
// CONSTANTS
// ============================================

/**
 * Ordered list of incarnate slots
 */
export const INCARNATE_SLOT_ORDER: IncarnateSlotId[] = [
  'alpha',
  'judgement',
  'interface',
  'destiny',
  'lore',
  'hybrid',
];

/**
 * Tier progression order
 */
export const INCARNATE_TIER_ORDER: IncarnateTier[] = [
  'common',
  'uncommon',
  'rare',
  'veryrare',
];

/**
 * Level required for incarnate powers
 */
export const INCARNATE_REQUIRED_LEVEL = 50;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create empty incarnate build state
 */
export function createEmptyIncarnateBuildState(): IncarnateBuildState {
  return {
    alpha: null,
    judgement: null,
    interface: null,
    destiny: null,
    lore: null,
    hybrid: null,
  };
}

/**
 * Create default incarnate active state (all enabled by default)
 */
export function createDefaultIncarnateActiveState(): IncarnateActiveState {
  return {
    alpha: true,
    destiny: true,
    hybrid: true,
    interface: true,
  };
}

/**
 * Infer tier from power name patterns
 *
 * Incarnate powers follow these naming patterns by slot:
 * - Alpha: Boost (common), Core/Radial Boost (uncommon), Total/Partial Revamp (rare), Paragon (very rare)
 * - Judgement: Judgement (common), Core/Radial Judgement (uncommon), Total/Partial Judgement (rare), Final Judgement (very rare)
 * - Interface: Interface (common), Core/Radial Interface (uncommon), Total/Partial Conversion (rare), Flawless Interface (very rare)
 * - Destiny: varies by tree
 * - Lore: Ally (common), Core/Radial Ally (uncommon), Total/Partial Improved Ally (rare), Superior Ally (very rare)
 * - Hybrid: varies by tree
 */
export function inferTierFromPowerName(powerName: string): IncarnateTier {
  const lowerName = powerName.toLowerCase();

  // Very Rare (Tier 4): Check for all very rare keywords across all slots
  // Alpha: Paragon | Judgement: Final | Interface: Flawless | Lore: Superior | Destiny/Hybrid: Epiphany, Genesis, Embodiment
  if (lowerName.includes('paragon') ||
      lowerName.includes('final') ||
      lowerName.includes('flawless') ||
      lowerName.includes('superior') ||
      lowerName.includes('epiphany') ||
      lowerName.includes('genesis') ||
      lowerName.includes('embodiment')) {
    return 'veryrare';
  }

  // Rare (Tier 3): Total/Partial variants
  if (lowerName.includes('total') || lowerName.includes('partial')) {
    return 'rare';
  }

  // Uncommon (Tier 2): Has Core/Radial but not the very rare or rare keywords
  if (lowerName.includes('core') || lowerName.includes('radial')) {
    return 'uncommon';
  }

  // Common (Tier 1): Base power without Core/Radial modifier
  return 'common';
}

/**
 * Infer branch from power name
 */
export function inferBranchFromPowerName(powerName: string): IncarnateBranch {
  const lowerName = powerName.toLowerCase();

  if (lowerName.includes('radial')) return 'radial';
  if (lowerName.includes('core')) return 'core';
  return 'base';
}
