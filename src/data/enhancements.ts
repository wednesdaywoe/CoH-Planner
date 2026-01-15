/**
 * Non-IO set enhancement data
 * Migrated from legacy/js/data/enhancements.js
 */

import type {
  EnhancementStatType,
  Origin,
  EnhancementTier,
  OriginTierInfo,
  HamidonRegistry,
} from '@/types';

// ============================================
// HAMIDON ORIGIN ENHANCEMENTS
// ============================================

export const HAMIDON_ENHANCEMENTS: HamidonRegistry = {
  nucleolus: {
    name: 'Nucleolus Exposure',
    aspects: ['Damage', 'Accuracy'],
    value: 50, // +50% to each aspect
  },
  centriole: {
    name: 'Centriole Exposure',
    aspects: ['Damage', 'Range'],
    value: 50,
  },
  enzyme: {
    name: 'Enzyme Exposure',
    aspects: ['ToHit Debuff', 'Defense Debuff'],
    value: 50,
  },
  lysosome: {
    name: 'Lysosome Exposure',
    aspects: ['Accuracy', 'ToHit Debuff'],
    value: 50,
  },
  membrane: {
    name: 'Membrane Exposure',
    aspects: ['ToHit Debuff', 'Recharge'],
    value: 50,
  },
  peroxisome: {
    name: 'Peroxisome Exposure',
    aspects: ['Damage', 'Mez Duration'],
    value: 50,
  },
  ribosome: {
    name: 'Ribosome Exposure',
    aspects: ['Resistance', 'Endurance'],
    value: 50,
  },
  golgi: {
    name: 'Golgi Exposure',
    aspects: ['Healing', 'Endurance'],
    value: 50,
  },
  endoplasm: {
    name: 'Endoplasm Exposure',
    aspects: ['Defense', 'Endurance'],
    value: 50,
  },
  cytoskeleton: {
    name: 'Cytoskeleton Exposure',
    aspects: ['Recharge', 'Endurance'],
    value: 50,
  },
};

// ============================================
// COMMON IO CALCULATION
// ============================================

/**
 * Calculate Common IO enhancement value based on level
 * @param level - IO level (10-53)
 * @returns Enhancement value as percentage
 */
export function calculateCommonIOValue(level: number): number {
  const baseValue = 0.256; // Level 25 base
  const levelBonus = (level - 25) * 0.004;
  return (baseValue + levelBonus) * 100;
}

/**
 * Get common IO value at a specific level
 * Common IOs range from level 10-50 (or 53 with boosters)
 */
export function getCommonIOValueAtLevel(level: number): number {
  // Clamp level to valid range
  const clampedLevel = Math.max(10, Math.min(53, level));
  return calculateCommonIOValue(clampedLevel);
}

// ============================================
// COMMON IO TYPES
// ============================================

export const COMMON_IO_TYPES: EnhancementStatType[] = [
  'Damage',
  'Accuracy',
  'Recharge',
  'EnduranceReduction',
  'Range',
  'Defense',
  'Resistance',
  'Healing',
  'ToHit',
  'Hold',
  'Stun',
  'Immobilize',
  'Sleep',
  'Confuse',
  'Fear',
  'Knockback',
  'Run Speed',
  'Jump',
  'Fly',
];

// ============================================
// TO/DO/SO TIERS
// ============================================

export const ORIGIN_TIERS: OriginTierInfo[] = [
  {
    name: 'Training Origin',
    short: 'TO',
    value: 8.3,
    description: 'These are the least potent of all Enhancements.',
  },
  {
    name: 'Dual Origin',
    short: 'DO',
    value: 16.7,
    description: 'These are twice as potent as TO Enhancements. Limited to 2 specific Origins.',
  },
  {
    name: 'Single Origin',
    short: 'SO',
    value: 33.3,
    description: 'These are twice as potent as DO Enhancements. Limited to a single Origin.',
  },
];

/**
 * Get tier info by short name
 */
export function getOriginTier(tier: EnhancementTier): OriginTierInfo | undefined {
  return ORIGIN_TIERS.find((t) => t.short === tier);
}

/**
 * Get enhancement value for a tier
 */
export function getOriginTierValue(tier: EnhancementTier): number {
  const tierInfo = getOriginTier(tier);
  return tierInfo?.value ?? 0;
}

// ============================================
// ORIGINS
// ============================================

export const ORIGINS: Origin[] = [
  'Magic',
  'Mutation',
  'Natural',
  'Science',
  'Technology',
];

// ============================================
// DUAL ORIGIN COMBINATIONS
// ============================================

export interface DualOriginCombo {
  name: string;
  origins: [Origin, Origin];
}

export const DUAL_ORIGIN_COMBOS: DualOriginCombo[] = [
  { name: 'Genetic Alteration', origins: ['Mutation', 'Science'] },
  { name: 'Mystical Artifact', origins: ['Magic', 'Technology'] },
  { name: 'Mutant Gene', origins: ['Mutation', 'Natural'] },
  { name: 'Technical Upgrade', origins: ['Natural', 'Technology'] },
  { name: 'Enchanted Weapon', origins: ['Magic', 'Natural'] },
  { name: 'Experimental Tech', origins: ['Science', 'Technology'] },
  { name: 'Arcane Mutation', origins: ['Magic', 'Mutation'] },
  { name: 'Scientific Discipline', origins: ['Natural', 'Science'] },
  { name: 'Technological Sorcery', origins: ['Magic', 'Science'] },
  { name: 'Evolved Mutation', origins: ['Mutation', 'Technology'] },
];

/**
 * Check if a dual origin enhancement is valid for a given origin
 */
export function isDualOriginValidForOrigin(combo: DualOriginCombo, origin: Origin): boolean {
  return combo.origins.includes(origin);
}

// ============================================
// ENHANCEMENT TYPE CATEGORIES
// ============================================

export interface EnhancementCategory {
  id: string;
  name: string;
  types: EnhancementStatType[];
}

export const ENHANCEMENT_CATEGORIES: EnhancementCategory[] = [
  {
    id: 'damage',
    name: 'Damage',
    types: ['Damage'],
  },
  {
    id: 'accuracy',
    name: 'Accuracy',
    types: ['Accuracy', 'ToHit'],
  },
  {
    id: 'recharge',
    name: 'Recharge',
    types: ['Recharge'],
  },
  {
    id: 'endurance',
    name: 'Endurance',
    types: ['EnduranceReduction'],
  },
  {
    id: 'defense',
    name: 'Defense',
    types: ['Defense'],
  },
  {
    id: 'resistance',
    name: 'Resistance',
    types: ['Resistance'],
  },
  {
    id: 'healing',
    name: 'Healing',
    types: ['Healing'],
  },
  {
    id: 'mez',
    name: 'Mez',
    types: ['Hold', 'Stun', 'Immobilize', 'Sleep', 'Confuse', 'Fear'],
  },
  {
    id: 'debuff',
    name: 'Debuff',
    types: ['ToHit Debuff', 'Defense Debuff', 'Slow'],
  },
  {
    id: 'travel',
    name: 'Travel',
    types: ['Run Speed', 'Jump', 'Fly'],
  },
  {
    id: 'utility',
    name: 'Utility',
    types: ['Range', 'Knockback', 'Taunt', 'Intangible'],
  },
];
