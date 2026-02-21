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
  SpecialEnhancementRegistry,
} from '@/types';

// ============================================
// HAMIDON ORIGIN ENHANCEMENTS
// ============================================

export const HAMIDON_ENHANCEMENTS: HamidonRegistry = {
  nucleolus: {
    name: 'Nucleolus Exposure',
    aspects: [
      { stat: 'Accuracy', value: 33.33 },
      { stat: 'Damage', value: 33.33 },
    ],
  },
  centriole: {
    name: 'Centriole Exposure',
    aspects: [
      { stat: 'Damage', value: 33.33 },
      { stat: 'Range', value: 20 },
    ],
  },
  enzyme: {
    name: 'Enzyme Exposure',
    aspects: [
      { stat: 'Defense Debuff', value: 33.33 },
      { stat: 'EnduranceReduction', value: 33.33 },
      { stat: 'ToHit Debuff', value: 20 },
    ],
  },
  lysosome: {
    name: 'Lysosome Exposure',
    aspects: [
      { stat: 'Accuracy', value: 33.33 },
      { stat: 'Defense Debuff', value: 33.33 },
      { stat: 'ToHit Debuff', value: 20 },
    ],
  },
  membrane: {
    name: 'Membrane Exposure',
    aspects: [
      { stat: 'ToHit', value: 20 },
      { stat: 'Defense', value: 20 },
      { stat: 'Recharge', value: 33.33 },
    ],
  },
  peroxisome: {
    name: 'Peroxisome Exposure',
    aspects: [
      { stat: 'Damage', value: 33.33 },
      { stat: 'Confuse', value: 33.33 },
      { stat: 'Stun', value: 33.33 },
      { stat: 'Fear', value: 33.33 },
      { stat: 'Hold', value: 33.33 },
      { stat: 'Immobilize', value: 33.33 },
      { stat: 'Sleep', value: 33.33 },
    ],
  },
  ribosome: {
    name: 'Ribosome Exposure',
    aspects: [
      { stat: 'Resistance', value: 20 },
      { stat: 'EnduranceReduction', value: 33.33 },
    ],
  },
  golgi: {
    name: 'Golgi Exposure',
    aspects: [
      { stat: 'Healing', value: 33.33 },
      { stat: 'EnduranceReduction', value: 33.33 },
    ],
  },
  endoplasm: {
    name: 'Endoplasm Exposure',
    aspects: [
      { stat: 'Accuracy', value: 33.33 },
      { stat: 'Confuse', value: 33.33 },
      { stat: 'Stun', value: 33.33 },
      { stat: 'Fear', value: 33.33 },
      { stat: 'Hold', value: 33.33 },
      { stat: 'Immobilize', value: 33.33 },
      { stat: 'Sleep', value: 33.33 },
    ],
  },
  cytoskeleton: {
    name: 'Cytoskeleton Exposure',
    aspects: [
      { stat: 'Defense', value: 20 },
      { stat: 'EnduranceReduction', value: 33.33 },
      { stat: 'ToHit', value: 20 },
    ],
  },
  microfilament: {
    name: 'Microfilament Exposure',
    aspects: [
      { stat: 'Fly', value: 33.33 },
      { stat: 'Jump', value: 33.33 },
      { stat: 'Run Speed', value: 33.33 },
      { stat: 'EnduranceReduction', value: 33.33 },
    ],
  },
};

// ============================================
// TITAN ORIGIN ENHANCEMENTS
// ============================================

export const TITAN_ENHANCEMENTS: SpecialEnhancementRegistry = {
  amethyst: {
    name: 'Titan Amethyst Shard',
    aspects: [
      { stat: 'Damage', value: 25 },
      { stat: 'Sleep', value: 25 },
      { stat: 'Stun', value: 25 },
      { stat: 'Immobilize', value: 25 },
      { stat: 'Hold', value: 25 },
      { stat: 'Confuse', value: 25 },
      { stat: 'Fear', value: 25 },
    ],
  },
  calcite: {
    name: 'Titan Calcite Shard',
    aspects: [
      { stat: 'Accuracy', value: 25 },
      { stat: 'Sleep', value: 25 },
      { stat: 'Stun', value: 25 },
      { stat: 'Immobilize', value: 25 },
      { stat: 'Hold', value: 25 },
      { stat: 'Confuse', value: 25 },
      { stat: 'Fear', value: 25 },
    ],
  },
  citrine: {
    name: 'Titan Citrine Shard',
    aspects: [
      { stat: 'ToHit', value: 15 },
      { stat: 'Defense', value: 15 },
      { stat: 'Recharge', value: 25 },
    ],
  },
  diamond: {
    name: 'Titan Diamond Shard',
    aspects: [
      { stat: 'Damage', value: 25 },
      { stat: 'Accuracy', value: 25 },
    ],
  },
  gypsum: {
    name: 'Titan Gypsum Shard',
    aspects: [
      { stat: 'Accuracy', value: 25 },
      { stat: 'ToHit Debuff', value: 15 },
      { stat: 'Defense Debuff', value: 25 },
    ],
  },
  kyanite: {
    name: 'Titan Kyanite Shard',
    aspects: [
      { stat: 'Healing', value: 25 },
      { stat: 'EnduranceReduction', value: 25 },
    ],
  },
  peridont: {
    name: 'Titan Peridont Shard',
    aspects: [
      { stat: 'Resistance', value: 15 },
      { stat: 'EnduranceReduction', value: 25 },
    ],
  },
  quartz: {
    name: 'Titan Quartz Shard',
    aspects: [
      { stat: 'Damage', value: 25 },
      { stat: 'Range', value: 15 },
    ],
  },
  selenite: {
    name: 'Titan Selenite Shard',
    aspects: [
      { stat: 'Fly', value: 25 },
      { stat: 'Jump', value: 25 },
      { stat: 'Run Speed', value: 25 },
      { stat: 'EnduranceReduction', value: 25 },
    ],
  },
  tanzanite: {
    name: 'Titan Tanzanite Shard',
    aspects: [
      { stat: 'ToHit', value: 15 },
      { stat: 'Defense', value: 15 },
      { stat: 'EnduranceReduction', value: 25 },
    ],
  },
  zeolite: {
    name: 'Titan Zeolite Shard',
    aspects: [
      { stat: 'ToHit Debuff', value: 15 },
      { stat: 'Defense Debuff', value: 25 },
      { stat: 'EnduranceReduction', value: 25 },
    ],
  },
};

// ============================================
// HYDRA ORIGIN ENHANCEMENTS
// ============================================

export const HYDRA_ENHANCEMENTS: SpecialEnhancementRegistry = {
  antiproton: {
    name: 'Anti Proton Exposure',
    aspects: [
      { stat: 'ToHit Debuff', value: 15 },
      { stat: 'Defense Debuff', value: 25 },
      { stat: 'EnduranceReduction', value: 25 },
    ],
  },
  delta: {
    name: 'Delta Particle Exposure',
    aspects: [
      { stat: 'Accuracy', value: 25 },
      { stat: 'ToHit Debuff', value: 15 },
      { stat: 'Defense Debuff', value: 25 },
    ],
  },
  electron: {
    name: 'Electron Exposure',
    aspects: [
      { stat: 'Resistance', value: 15 },
      { stat: 'EnduranceReduction', value: 25 },
    ],
  },
  gluon: {
    name: 'Gluon Exposure',
    aspects: [
      { stat: 'Damage', value: 25 },
      { stat: 'Sleep', value: 25 },
      { stat: 'Stun', value: 25 },
      { stat: 'Immobilize', value: 25 },
      { stat: 'Hold', value: 25 },
      { stat: 'Confuse', value: 25 },
      { stat: 'Fear', value: 25 },
    ],
  },
  graviton: {
    name: 'Graviton Exposure',
    aspects: [
      { stat: 'Accuracy', value: 25 },
      { stat: 'Sleep', value: 25 },
      { stat: 'Stun', value: 25 },
      { stat: 'Immobilize', value: 25 },
      { stat: 'Hold', value: 25 },
      { stat: 'Confuse', value: 25 },
      { stat: 'Fear', value: 25 },
    ],
  },
  neutrino: {
    name: 'Neutrino Exposure',
    aspects: [
      { stat: 'Accuracy', value: 25 },
      { stat: 'Damage', value: 25 },
    ],
  },
  neutron: {
    name: 'Neutron Exposure',
    aspects: [
      { stat: 'Damage', value: 25 },
      { stat: 'Range', value: 15 },
    ],
  },
  positron: {
    name: 'Positron Exposure',
    aspects: [
      { stat: 'Healing', value: 25 },
      { stat: 'EnduranceReduction', value: 25 },
    ],
  },
  proton: {
    name: 'Proton Exposure',
    aspects: [
      { stat: 'ToHit', value: 15 },
      { stat: 'Defense', value: 15 },
      { stat: 'EnduranceReduction', value: 25 },
    ],
  },
  quark: {
    name: 'Quark Particle Exposure',
    aspects: [
      { stat: 'ToHit', value: 15 },
      { stat: 'Defense', value: 15 },
      { stat: 'Recharge', value: 25 },
    ],
  },
  theta: {
    name: 'Theta Exposure',
    aspects: [
      { stat: 'Fly', value: 25 },
      { stat: 'Jump', value: 25 },
      { stat: 'Run Speed', value: 25 },
      { stat: 'EnduranceReduction', value: 25 },
    ],
  },
};

// ============================================
// D-SYNC ORIGIN ENHANCEMENTS
// ============================================

export const DSYNC_ENHANCEMENTS: SpecialEnhancementRegistry = {
  acceleration: {
    name: 'D-Sync Acceleration',
    aspects: [
      { stat: 'Fly', value: 38.3 },
      { stat: 'Jump', value: 38.3 },
      { stat: 'Run Speed', value: 38.3 },
      { stat: 'EnduranceReduction', value: 38.3 },
    ],
  },
  binding: {
    name: 'D-Sync Binding',
    aspects: [
      { stat: 'Accuracy', value: 38.3 },
      { stat: 'Sleep', value: 38.3 },
      { stat: 'Stun', value: 38.3 },
      { stat: 'Immobilize', value: 38.3 },
      { stat: 'Hold', value: 38.3 },
      { stat: 'Confuse', value: 38.3 },
      { stat: 'Fear', value: 38.3 },
    ],
  },
  conduit: {
    name: 'D-Sync Conduit',
    aspects: [
      { stat: 'EnduranceModification', value: 38.3 },
      { stat: 'Recharge', value: 38.3 },
    ],
  },
  containment: {
    name: 'D-Sync Containment',
    aspects: [
      { stat: 'Damage', value: 38.3 },
      { stat: 'Sleep', value: 38.3 },
      { stat: 'Stun', value: 38.3 },
      { stat: 'Immobilize', value: 38.3 },
      { stat: 'Hold', value: 38.3 },
      { stat: 'Confuse', value: 38.3 },
      { stat: 'Fear', value: 38.3 },
    ],
  },
  deceleration: {
    name: 'D-Sync Deceleration',
    aspects: [
      { stat: 'Slow', value: 38.3 },
      { stat: 'Recharge', value: 38.3 },
      { stat: 'EnduranceReduction', value: 38.3 },
    ],
  },
  drain: {
    name: 'D-Sync Drain',
    aspects: [
      { stat: 'EnduranceModification', value: 38.3 },
      { stat: 'Accuracy', value: 38.3 },
    ],
  },
  efficiency: {
    name: 'D-Sync Efficiency',
    aspects: [
      { stat: 'Damage', value: 38.3 },
      { stat: 'EnduranceReduction', value: 38.3 },
    ],
  },
  elusivity: {
    name: 'D-Sync Elusivity',
    aspects: [
      { stat: 'ToHit', value: 23.0 },
      { stat: 'Defense', value: 23.0 },
      { stat: 'EnduranceReduction', value: 38.3 },
    ],
  },
  empowerment: {
    name: 'D-Sync Empowerment',
    aspects: [
      { stat: 'Accuracy', value: 38.3 },
      { stat: 'Damage', value: 38.3 },
    ],
  },
  extension: {
    name: 'D-Sync Extension',
    aspects: [
      { stat: 'Damage', value: 38.3 },
      { stat: 'Range', value: 23.0 },
    ],
  },
  fortification: {
    name: 'D-Sync Fortification',
    aspects: [
      { stat: 'Resistance', value: 23.0 },
      { stat: 'EnduranceReduction', value: 38.3 },
    ],
  },
  guidance: {
    name: 'D-Sync Guidance',
    aspects: [
      { stat: 'Accuracy', value: 38.3 },
      { stat: 'Range', value: 23.0 },
    ],
  },
  marginalization: {
    name: 'D-Sync Marginalization',
    aspects: [
      { stat: 'ToHit Debuff', value: 23.0 },
      { stat: 'Defense Debuff', value: 38.3 },
      { stat: 'EnduranceReduction', value: 38.3 },
    ],
  },
  obfuscation: {
    name: 'D-Sync Obfuscation',
    aspects: [
      { stat: 'Accuracy', value: 38.3 },
      { stat: 'ToHit Debuff', value: 23.0 },
      { stat: 'Defense Debuff', value: 38.3 },
    ],
  },
  optimization: {
    name: 'D-Sync Optimization',
    aspects: [
      { stat: 'Damage', value: 38.3 },
      { stat: 'Recharge', value: 38.3 },
    ],
  },
  provocation: {
    name: 'D-Sync Provocation',
    aspects: [
      { stat: 'Taunt', value: 38.3 },
      { stat: 'Accuracy', value: 38.3 },
      { stat: 'Recharge', value: 38.3 },
    ],
  },
  reconstitution: {
    name: 'D-Sync Reconstitution',
    aspects: [
      { stat: 'Healing', value: 38.3 },
      { stat: 'Absorb', value: 38.3 },
      { stat: 'EnduranceReduction', value: 38.3 },
    ],
  },
  reconstruction: {
    name: 'D-Sync Reconstruction',
    aspects: [
      { stat: 'Healing', value: 38.3 },
      { stat: 'Absorb', value: 38.3 },
      { stat: 'Recharge', value: 38.3 },
    ],
  },
  shifting: {
    name: 'D-Sync Shifting',
    aspects: [
      { stat: 'ToHit', value: 23.0 },
      { stat: 'Defense', value: 23.0 },
      { stat: 'Recharge', value: 38.3 },
    ],
  },
  siphon: {
    name: 'D-Sync Siphon',
    aspects: [
      { stat: 'Healing', value: 38.3 },
      { stat: 'Absorb', value: 38.3 },
      { stat: 'Accuracy', value: 38.3 },
    ],
  },
};

// ============================================
// COMMON IO CALCULATION
// ============================================

/**
 * Common IO enhancement values by level (Schedule A)
 * Based on Homecoming "Level-Based IO Effectiveness" table
 * These are the actual game values for single-aspect IOs
 */
const COMMON_IO_VALUES: Record<number, number> = {
  10: 11.7,
  15: 19.2,
  20: 25.6,
  25: 32.0,
  30: 34.8,
  35: 36.7,
  40: 38.6,
  45: 40.5,
  50: 42.4,
  53: 43.5,
};

/**
 * Calculate Common IO enhancement value based on level
 * @param level - IO level (10-53)
 * @returns Enhancement value as percentage
 */
export function calculateCommonIOValue(level: number): number {
  const clampedLevel = Math.max(10, Math.min(53, level));

  // If exact level exists, return it
  if (COMMON_IO_VALUES[clampedLevel]) {
    return COMMON_IO_VALUES[clampedLevel];
  }

  // Otherwise interpolate between levels
  const levels = [10, 15, 20, 25, 30, 35, 40, 45, 50, 53];
  let lowerLevel = levels[0];
  let upperLevel = levels[1];

  for (let i = 0; i < levels.length - 1; i++) {
    if (levels[i] <= clampedLevel && levels[i + 1] > clampedLevel) {
      lowerLevel = levels[i];
      upperLevel = levels[i + 1];
      break;
    }
  }

  const ratio = (clampedLevel - lowerLevel) / (upperLevel - lowerLevel);
  return COMMON_IO_VALUES[lowerLevel] + (COMMON_IO_VALUES[upperLevel] - COMMON_IO_VALUES[lowerLevel]) * ratio;
}

/**
 * Get common IO value at a specific level
 * Common IOs range from level 10-50 (or 53 with boosters)
 */
export function getCommonIOValueAtLevel(level: number): number {
  return calculateCommonIOValue(level);
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
  'Defense Debuff',
  'Resistance',
  'Healing',
  'ToHit',
  'ToHit Debuff',
  'Slow',
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
  'Taunt',
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
