/**
 * City of Heroes - Damage Calculation System
 *
 * Converts damage scales to actual damage points based on:
 * - Character level
 * - Archetype damage modifiers
 * - Power damage scale
 * - Enhancement bonuses
 * - Active buffs
 */

import type { DamageType, ArchetypeId } from '@/types';
import { getArchetype } from '@/data';

// ============================================
// DAMAGE TABLES
// ============================================

/**
 * Base damage tables by level
 * These are the base damage values for a scale 1.0 attack at each level
 * Separate tables for melee and ranged (ranged is slightly lower)
 */
const DAMAGE_TABLES = {
  melee: {
    1: 5.0,
    2: 5.72,
    3: 6.44,
    4: 7.16,
    5: 7.89,
    6: 8.61,
    7: 9.33,
    8: 10.06,
    9: 10.78,
    10: 11.5,
    11: 12.22,
    12: 12.94,
    13: 13.67,
    14: 14.39,
    15: 15.11,
    16: 15.83,
    17: 16.56,
    18: 17.28,
    19: 18.0,
    20: 18.72,
    21: 19.44,
    22: 20.17,
    23: 20.89,
    24: 21.61,
    25: 22.33,
    26: 23.06,
    27: 23.78,
    28: 24.5,
    29: 25.22,
    30: 25.94,
    31: 26.67,
    32: 27.39,
    33: 28.11,
    34: 28.83,
    35: 29.56,
    36: 30.28,
    37: 31.0,
    38: 31.72,
    39: 32.44,
    40: 33.17,
    41: 35.0,
    42: 36.11,
    43: 37.22,
    44: 38.33,
    45: 39.44,
    46: 40.56,
    47: 41.67,
    48: 42.78,
    49: 43.89,
    50: 45.0,
    51: 46.11,
    52: 47.22,
    53: 48.33,
  } as Record<number, number>,

  ranged: {
    1: 4.5,
    2: 5.15,
    3: 5.8,
    4: 6.44,
    5: 7.09,
    6: 7.74,
    7: 8.39,
    8: 9.04,
    9: 9.69,
    10: 10.34,
    11: 11.0,
    12: 11.65,
    13: 12.3,
    14: 12.95,
    15: 13.6,
    16: 14.25,
    17: 14.9,
    18: 15.55,
    19: 16.2,
    20: 16.85,
    21: 17.5,
    22: 18.15,
    23: 18.8,
    24: 19.45,
    25: 20.1,
    26: 20.75,
    27: 21.4,
    28: 22.05,
    29: 22.7,
    30: 23.35,
    31: 24.0,
    32: 24.65,
    33: 25.3,
    34: 25.95,
    35: 26.6,
    36: 27.25,
    37: 27.9,
    38: 28.55,
    39: 29.2,
    40: 29.85,
    41: 31.5,
    42: 32.5,
    43: 33.5,
    44: 34.5,
    45: 35.5,
    46: 36.5,
    47: 37.5,
    48: 38.5,
    49: 39.5,
    50: 40.5,
    51: 41.5,
    52: 42.5,
    53: 43.5,
  } as Record<number, number>,
} as const;

export type DamageTableType = 'melee' | 'ranged';

// ============================================
// BASE DAMAGE LOOKUP
// ============================================

/**
 * Get base damage for a given level and attack type
 */
export function getBaseDamage(level: number, damageType: DamageTableType = 'melee'): number {
  const clampedLevel = Math.max(1, Math.min(53, level));
  const table = DAMAGE_TABLES[damageType] || DAMAGE_TABLES.melee;
  return table[clampedLevel] || table[50];
}

// ============================================
// DAMAGE CALCULATION
// ============================================

export interface DamageCalculationOptions {
  /** Power's damage scale */
  scale: number;
  /** Power's damage type ('melee', 'ranged', or 'aoe') */
  damageType?: DamageTableType | 'aoe';
  /** Character level */
  level?: number;
  /** Archetype ID */
  archetypeId?: ArchetypeId;
  /** Total enhancement bonus (0.95 for 95%, etc.) */
  enhancementBonus?: number;
  /** Active damage buffs (0.50 for +50%, etc.) */
  damageBuffs?: number;
}

/**
 * Calculate actual damage for a power
 */
export function calculateActualDamage(options: DamageCalculationOptions): number {
  const {
    scale,
    damageType = 'melee',
    level = 50,
    archetypeId,
    enhancementBonus = 0,
    damageBuffs = 0,
  } = options;

  if (!scale || scale === 0) return 0;

  // Get archetype damage modifier for this damage type
  let atModifier = 1.0;
  if (archetypeId) {
    const archetype = getArchetype(archetypeId);
    if (archetype?.stats?.damageModifier) {
      const dmgMod = archetype.stats.damageModifier;
      if (damageType === 'aoe' && 'aoe' in dmgMod) {
        atModifier = dmgMod.aoe as number;
      } else if (damageType === 'ranged' && 'ranged' in dmgMod) {
        atModifier = dmgMod.ranged as number;
      } else if ('melee' in dmgMod) {
        atModifier = dmgMod.melee as number;
      }
    }
  }

  // Get base damage for this level and type
  // For AoE, use the base damage type (melee or ranged) from the table
  const tableType: DamageTableType = damageType === 'aoe' ? 'melee' : damageType;
  const baseDamage = getBaseDamage(level, tableType);

  // Calculate: Base × AT Modifier × Scale × (1 + Enhancements) × (1 + Buffs)
  const actualDamage = baseDamage * atModifier * scale * (1 + enhancementBonus) * (1 + damageBuffs);

  return actualDamage;
}

// ============================================
// POWER DAMAGE CALCULATION
// ============================================

export interface PowerDamageResult {
  /** Base damage without enhancements */
  base: number;
  /** Enhanced damage with slot enhancements */
  enhanced: number;
  /** Final damage with global buffs */
  final: number;
  /** Damage type name for display */
  type: string;
  /** Flag indicating scale is unknown (redirect/pseudo-pet powers) */
  unknown?: boolean;
  /** Conditional Fiery Embrace damage (if detected) */
  fieryEmbraceDamage?: {
    base: number;
    enhanced: number;
    final: number;
    type: 'Fire';
  };
}

export interface DamageEffect {
  type?: DamageType;
  scale: number;
  types?: Array<{ type: DamageType; scale: number }>;
}

export interface PowerWithDamage {
  name: string;
  effects?: {
    damage?: DamageEffect | number;
    dotDamage?: DamageEffect | string;
    range?: number;
    radius?: number;
    maxTargets?: number;
  };
  shortHelp?: string;
}

export interface BuildContext {
  level: number;
  archetypeId?: ArchetypeId;
  primaryName?: string;
  secondaryName?: string;
  primaryCategory?: string;
  secondaryCategory?: string;
}

/** Threshold for detecting Fiery Embrace bonus damage (Fire must be less than this % of total) */
const FIERY_EMBRACE_THRESHOLD = 0.20; // 20%

/**
 * Calculate damage for a power from build
 */
export function calculatePowerDamage(
  basePower: PowerWithDamage,
  buildContext: BuildContext,
  enhancementBonuses: { damage?: number } = {},
  globalDamageBonus = 0,
  activeBuffs = 0
): PowerDamageResult | null {
  if (!basePower.effects?.damage) {
    return null;
  }

  const damageEffect = basePower.effects.damage;

  // Extract scale - handle both old and new formats
  let scale: number;
  let damageTypeName: string;
  let fieryEmbraceScale: number | null = null;

  if (typeof damageEffect === 'number') {
    scale = damageEffect;
    damageTypeName = 'Unknown';
  } else if (typeof damageEffect === 'object') {
    if (damageEffect.types) {
      const totalScale = damageEffect.scale || damageEffect.types.reduce((sum, t) => sum + t.scale, 0);

      // Check for Fiery Embrace pattern: Fire is minority damage in a non-Fire power
      const fireType = damageEffect.types.find(t => t.type === 'Fire');
      const nonFireTypes = damageEffect.types.filter(t => t.type !== 'Fire');

      if (fireType && nonFireTypes.length > 0) {
        const fireRatio = fireType.scale / totalScale;
        const dominantNonFire = nonFireTypes.reduce((max, t) => t.scale > max.scale ? t : max, nonFireTypes[0]);

        // If Fire is < 20% of total AND there's a larger non-Fire type, it's Fiery Embrace
        if (fireRatio < FIERY_EMBRACE_THRESHOLD && dominantNonFire.scale > fireType.scale) {
          // Separate Fiery Embrace damage from primary damage
          fieryEmbraceScale = fireType.scale;
          scale = totalScale - fieryEmbraceScale;
          damageTypeName = nonFireTypes.map(t => t.type).join('/');
        } else {
          // Fire is dominant or significant - treat normally
          scale = totalScale;
          damageTypeName = damageEffect.types.map((t) => t.type).join('/');
        }
      } else {
        // No Fire type or no non-Fire types - treat normally
        scale = totalScale;
        damageTypeName = damageEffect.types.map((t) => t.type).join('/');
      }
    } else {
      scale = damageEffect.scale;
      damageTypeName = damageEffect.type || 'Unknown';
    }
  } else {
    return null;
  }

  if (!scale || scale === 0) {
    if (damageTypeName && damageTypeName !== 'Unknown') {
      return {
        base: 0,
        enhanced: 0,
        final: 0,
        type: damageTypeName,
        unknown: true,
      };
    }
    return null;
  }

  // Infer damage type from power/powerset name if unknown
  if (damageTypeName === 'Unknown') {
    damageTypeName = inferDamageType(basePower.name, buildContext);
  }

  // Handle DoT type display
  if (basePower.effects?.dotDamage) {
    const dotTypeName = extractDotType(basePower.effects.dotDamage);
    if (dotTypeName && !damageTypeName.includes(dotTypeName)) {
      damageTypeName = `${damageTypeName} + DoT(${dotTypeName})`;
    }
  }

  // Determine damage type (melee, ranged, or aoe)
  const damageType = determineDamageType(basePower, buildContext);

  const { level, archetypeId } = buildContext;

  // Base damage (no enhancements)
  const baseDamage = calculateActualDamage({
    scale,
    damageType,
    level,
    archetypeId,
    enhancementBonus: 0,
    damageBuffs: 0,
  });

  // Enhanced damage (with slot enhancements)
  const enhancementBonus = enhancementBonuses.damage || 0;
  const enhancedDamage = calculateActualDamage({
    scale,
    damageType,
    level,
    archetypeId,
    enhancementBonus,
    damageBuffs: 0,
  });

  // Final damage (with global buffs from active powers)
  const finalDamage = calculateActualDamage({
    scale,
    damageType,
    level,
    archetypeId,
    enhancementBonus,
    damageBuffs: globalDamageBonus + activeBuffs,
  });

  const result: PowerDamageResult = {
    base: baseDamage,
    enhanced: enhancedDamage,
    final: finalDamage,
    type: damageTypeName,
  };

  // Calculate Fiery Embrace damage separately if detected
  if (fieryEmbraceScale !== null && fieryEmbraceScale > 0) {
    const feBaseDamage = calculateActualDamage({
      scale: fieryEmbraceScale,
      damageType,
      level,
      archetypeId,
      enhancementBonus: 0,
      damageBuffs: 0,
    });

    const feEnhancedDamage = calculateActualDamage({
      scale: fieryEmbraceScale,
      damageType,
      level,
      archetypeId,
      enhancementBonus,
      damageBuffs: 0,
    });

    const feFinalDamage = calculateActualDamage({
      scale: fieryEmbraceScale,
      damageType,
      level,
      archetypeId,
      enhancementBonus,
      damageBuffs: globalDamageBonus + activeBuffs,
    });

    result.fieryEmbraceDamage = {
      base: feBaseDamage,
      enhanced: feEnhancedDamage,
      final: feFinalDamage,
      type: 'Fire',
    };
  }

  return result;
}

/**
 * Infer damage type from power/powerset name
 */
function inferDamageType(powerName: string, context: BuildContext): string {
  const name = powerName.toLowerCase();
  const powersetName = (context.primaryName || context.secondaryName || '').toLowerCase();

  const typeInferenceRules: Array<{ keywords: string[]; type: string }> = [
    { keywords: ['fire', 'fiery'], type: 'Fire' },
    { keywords: ['ice', 'frost', 'cold'], type: 'Cold' },
    { keywords: ['dark'], type: 'Negative' },
    { keywords: ['electric', 'lightning'], type: 'Energy' },
    { keywords: ['radiation', 'rad'], type: 'Energy' },
    { keywords: ['psychic', 'mental'], type: 'Psionic' },
    { keywords: ['sonic'], type: 'Energy' },
    { keywords: ['toxic', 'poison'], type: 'Toxic' },
    { keywords: ['arrow', 'archery'], type: 'Lethal' },
    { keywords: ['rifle', 'bullet'], type: 'Lethal' },
    { keywords: ['smash', 'punch', 'kick'], type: 'Smashing' },
    { keywords: ['slash', 'sword', 'blade'], type: 'Lethal' },
  ];

  for (const rule of typeInferenceRules) {
    for (const keyword of rule.keywords) {
      if (name.includes(keyword) || powersetName.includes(keyword)) {
        return rule.type;
      }
    }
  }

  return 'Unknown';
}

/**
 * Extract DoT type from dotDamage effect
 */
function extractDotType(dotDamage: DamageEffect | string): string {
  if (typeof dotDamage === 'string') {
    return dotDamage;
  }
  if (typeof dotDamage === 'object') {
    if (dotDamage.types) {
      return dotDamage.types.map((t) => t.type).join('/');
    }
    if (dotDamage.type) {
      return dotDamage.type;
    }
  }
  return '';
}

/**
 * Determine if power is melee, ranged, or AoE
 */
function determineDamageType(
  power: PowerWithDamage,
  context: BuildContext
): DamageTableType | 'aoe' {
  const powersetName = (context.primaryName || context.secondaryName || '').toLowerCase();

  // Check if ranged based on powerset name
  const isRangedSet =
    powersetName.includes('blast') ||
    powersetName.includes('assault') ||
    powersetName.includes('archery') ||
    powersetName.includes('rifle');

  // Check if ranged from powerset category or range
  if (
    context.primaryCategory?.includes('RANGED') ||
    context.secondaryCategory?.includes('RANGED') ||
    power.shortHelp?.toLowerCase().includes('ranged') ||
    isRangedSet ||
    (power.effects?.range && power.effects.range > 20)
  ) {
    // Check if it's AoE by looking for radius or target count
    if (power.effects?.radius || (power.effects?.maxTargets && power.effects.maxTargets > 1)) {
      return 'aoe';
    }
    return 'ranged';
  }

  // Check if it's AoE
  if (power.effects?.radius || (power.effects?.maxTargets && power.effects.maxTargets > 1)) {
    return 'aoe';
  }

  return 'melee';
}

// ============================================
// FORMATTING
// ============================================

/**
 * Format damage for display
 */
export function formatDamage(damage: number): string {
  return damage.toFixed(2);
}

/**
 * Calculate buff/debuff value using archetype modifier
 */
export function calculateBuffDebuffValue(scale: number, archetypeId?: ArchetypeId): number {
  if (!scale || !archetypeId) return scale * 10;

  const archetype = getArchetype(archetypeId);
  if (!archetype) return scale * 10;

  const modifier = archetype.stats?.buffDebuffModifier || 1.0;

  // Formula: scale * archetypeModifier * 10 = percentage value
  return scale * modifier * 10;
}
