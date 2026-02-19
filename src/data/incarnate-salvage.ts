/**
 * Incarnate Salvage Registry
 *
 * Master catalog of all incarnate salvage items with rarity classification
 * and currency costs. Ported from CoH-Incarnate-Calculator/js/incarnate-component-helper.js.
 */

import type { SalvageId, SalvageRarity } from '@/types';

// ============================================
// SALVAGE DEFINITIONS
// ============================================

export interface SalvageDefinition {
  id: SalvageId;
  displayName: string;
  rarity: SalvageRarity;
  /** Cost to purchase via conversion: threads (for common/uncommon) or empyrean (for rare/very-rare) */
  cost: { threads: number; empyrean: number };
}

export const SALVAGE_REGISTRY: Record<SalvageId, SalvageDefinition> = {
  // Common (20 threads each)
  ArcaneCantrip:         { id: 'ArcaneCantrip',         displayName: 'Arcane Cantrip',           rarity: 'common',    cost: { threads: 20, empyrean: 0 } },
  BiomorphicGoo:         { id: 'BiomorphicGoo',         displayName: 'Biomorphic Goo',           rarity: 'common',    cost: { threads: 20, empyrean: 0 } },
  DetailedReports:       { id: 'DetailedReports',       displayName: 'Detailed Reports',         rarity: 'common',    cost: { threads: 20, empyrean: 0 } },
  EnchantedSand:         { id: 'EnchantedSand',         displayName: 'Enchanted Sand',           rarity: 'common',    cost: { threads: 20, empyrean: 0 } },
  GenomicAnalysis:       { id: 'GenomicAnalysis',       displayName: 'Genomic Analysis',         rarity: 'common',    cost: { threads: 20, empyrean: 0 } },
  MeditationTechniques:  { id: 'MeditationTechniques',  displayName: 'Meditation Techniques',    rarity: 'common',    cost: { threads: 20, empyrean: 0 } },
  NanotechGrowthMedium:  { id: 'NanotechGrowthMedium',  displayName: 'Nanotech Growth Medium',   rarity: 'common',    cost: { threads: 20, empyrean: 0 } },
  SuperchargedCapacitor: { id: 'SuperchargedCapacitor', displayName: 'Supercharged Capacitor',   rarity: 'common',    cost: { threads: 20, empyrean: 0 } },
  // Uncommon (60 threads each)
  CytoliticInfusion:     { id: 'CytoliticInfusion',     displayName: 'Cytolitic Infusion',       rarity: 'uncommon',  cost: { threads: 60, empyrean: 0 } },
  DimensionalPocket:     { id: 'DimensionalPocket',     displayName: 'Dimensional Pocket',       rarity: 'uncommon',  cost: { threads: 60, empyrean: 0 } },
  GluonCompound:         { id: 'GluonCompound',         displayName: 'Gluon Compound',           rarity: 'uncommon',  cost: { threads: 60, empyrean: 0 } },
  WornSpellbook:         { id: 'WornSpellbook',         displayName: 'Worn Spellbook',           rarity: 'uncommon',  cost: { threads: 60, empyrean: 0 } },
  // Rare (8 empyrean each)
  AncientTexts:          { id: 'AncientTexts',          displayName: 'Ancient Texts',            rarity: 'rare',      cost: { threads: 0, empyrean: 8 } },
  ExoticIsotope:         { id: 'ExoticIsotope',         displayName: 'Exotic Isotope',           rarity: 'rare',      cost: { threads: 0, empyrean: 8 } },
  SemiConsciousEnergy:   { id: 'SemiConsciousEnergy',   displayName: 'Semi-Conscious Energy',    rarity: 'rare',      cost: { threads: 0, empyrean: 8 } },
  SuperconductiveMembrane: { id: 'SuperconductiveMembrane', displayName: 'Superconductive Membrane', rarity: 'rare', cost: { threads: 0, empyrean: 8 } },
  // Very Rare (30 empyrean each)
  FavoroftheWell:        { id: 'FavoroftheWell',        displayName: 'Favor of the Well',        rarity: 'very-rare', cost: { threads: 0, empyrean: 30 } },
  ForbiddenTechnique:    { id: 'ForbiddenTechnique',    displayName: 'Forbidden Technique',      rarity: 'very-rare', cost: { threads: 0, empyrean: 30 } },
  InfiniteTessellation:  { id: 'InfiniteTessellation',  displayName: 'Infinite Tessellation',    rarity: 'very-rare', cost: { threads: 0, empyrean: 30 } },
  LivingRelic:           { id: 'LivingRelic',           displayName: 'Living Relic',             rarity: 'very-rare', cost: { threads: 0, empyrean: 30 } },
  SelfEvolvingAlloy:     { id: 'SelfEvolvingAlloy',     displayName: 'Self-Evolving Alloy',      rarity: 'very-rare', cost: { threads: 0, empyrean: 30 } },
  ThaumicResonator:      { id: 'ThaumicResonator',      displayName: 'Thaumic Resonator',        rarity: 'very-rare', cost: { threads: 0, empyrean: 30 } },
};

// ============================================
// RARITY DISPLAY CONFIG
// ============================================

export const SALVAGE_RARITY_COLORS: Record<SalvageRarity, string> = {
  'common':    '#FFFFFF',
  'uncommon':  '#FBBF24',
  'rare':      '#F97316',
  'very-rare': '#A855F7',
};

// ============================================
// ACCESSOR FUNCTIONS
// ============================================

export function getSalvageDefinition(id: SalvageId): SalvageDefinition {
  return SALVAGE_REGISTRY[id];
}

export function getSalvageDisplayName(id: SalvageId): string {
  return SALVAGE_REGISTRY[id].displayName;
}

export function getSalvageRarity(id: SalvageId): SalvageRarity {
  return SALVAGE_REGISTRY[id].rarity;
}

export function getSalvageRarityColor(id: SalvageId): string {
  return SALVAGE_RARITY_COLORS[SALVAGE_REGISTRY[id].rarity];
}

export function getSalvageCost(id: SalvageId): { threads: number; empyrean: number } {
  return SALVAGE_REGISTRY[id].cost;
}

/**
 * Parse a raw salvage string like "2x ArcaneCantrip" into a typed SalvageRequirement
 */
export function parseSalvageString(raw: string): { salvageId: SalvageId; quantity: number } {
  const match = raw.match(/^(\d+)x\s+(.+)$/);
  if (match) {
    return { salvageId: match[2] as SalvageId, quantity: parseInt(match[1], 10) };
  }
  return { salvageId: raw as SalvageId, quantity: 1 };
}
