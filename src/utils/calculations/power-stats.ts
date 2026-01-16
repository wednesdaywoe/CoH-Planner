/**
 * Power Enhancement Calculator
 *
 * Calculates three-tier stats for powers (base/enhanced/final)
 */

import type { EnhancementBonuses } from './enhancement-values';

// ============================================
// TYPES
// ============================================

export interface ThreeTierStat {
  base: number;
  enhanced: number;
  final: number;
}

export interface ComplexStat<T = number> {
  base: T;
  enhanced: T;
  final: T;
}

export interface DamageScale {
  scale: number;
  type?: string;
  types?: Array<{ type: string; scale: number }>;
}

export interface PowerEffectsForCalc {
  damage?: number | DamageScale;
  accuracy?: number;
  recharge?: number;
  endurance?: number;
  range?: number;
  defense?: Record<string, number>;
  resistance?: Record<string, number>;
  healing?: number | { scale: number };
}

export interface PowerForCalc {
  name: string;
  effects?: PowerEffectsForCalc;
}

export interface GlobalBonuses {
  damage?: number;
  accuracy?: number;
  recharge?: number;
  endurance?: number;
  range?: number;
  defense?: number;
  resistance?: number;
  healing?: number;
  [key: string]: number | undefined;
}

export interface PowerStats {
  damage?: ThreeTierStat | ComplexStat<DamageScale>;
  accuracy?: ThreeTierStat;
  recharge?: ThreeTierStat;
  endurance?: ThreeTierStat;
  range?: ThreeTierStat;
  defense?: ComplexStat<Record<string, number>>;
  resistance?: ComplexStat<Record<string, number>>;
  healing?: ThreeTierStat | ComplexStat<{ scale: number }>;
}

// ============================================
// STAT CALCULATION
// ============================================

/**
 * Calculate three-tier stats for a power (base, enhanced, final)
 */
export function calculatePowerStats(
  power: PowerForCalc,
  enhancementBonuses: EnhancementBonuses = {},
  globalBonuses: GlobalBonuses = {}
): PowerStats {
  if (!power?.effects) {
    return {};
  }

  const stats: PowerStats = {};
  const effects = power.effects;

  // Map of effects to process
  const effectsToProcess: Array<{
    key: keyof PowerStats;
    base: unknown;
  }> = [
    { key: 'damage', base: effects.damage },
    { key: 'accuracy', base: effects.accuracy },
    { key: 'recharge', base: effects.recharge },
    { key: 'endurance', base: effects.endurance },
    { key: 'range', base: effects.range },
    { key: 'defense', base: effects.defense },
    { key: 'resistance', base: effects.resistance },
    { key: 'healing', base: effects.healing },
  ];

  effectsToProcess.forEach(({ key, base }) => {
    if (base === undefined || base === null) return;

    if (typeof base === 'object') {
      // Complex objects (damage with types, defense/resistance with types, etc.)
      const result = calculateComplexStat(key, base, enhancementBonuses, globalBonuses);
      if (result) {
        (stats as Record<string, unknown>)[key] = result;
      }
    } else if (typeof base === 'number') {
      // Simple numeric values
      const result = calculateSimpleStat(key, base, enhancementBonuses, globalBonuses);
      if (result) {
        (stats as Record<string, unknown>)[key] = result;
      }
    }
  });

  return stats;
}

/**
 * Calculate simple stat with three tiers
 */
function calculateSimpleStat(
  aspect: string,
  baseValue: number,
  enhBonuses: EnhancementBonuses,
  globalBonuses: GlobalBonuses
): ThreeTierStat {
  const enhBonus = enhBonuses[aspect] || 0;
  const globalBonus = globalBonuses[aspect] || 0;

  let enhanced: number;
  let final: number;

  // Apply formulas based on aspect type
  switch (aspect) {
    case 'damage':
    case 'accuracy':
    case 'tohit':
      // Multiplicative: base * (1 + bonus%)
      enhanced = baseValue * (1 + enhBonus);
      final = enhanced * (1 + globalBonus);
      break;

    case 'endurance':
      // Reduction: base * (1 - reduction%)
      enhanced = baseValue * Math.max(0, 1 - enhBonus);
      final = enhanced * Math.max(0, 1 - globalBonus);
      break;

    case 'recharge':
      // Reduction (division): base / (1 + reduction%)
      enhanced = baseValue / Math.max(1, 1 + enhBonus);
      final = enhanced / Math.max(1, 1 + globalBonus);
      break;

    case 'range':
      // Multiplicative increase
      enhanced = baseValue * (1 + enhBonus);
      final = enhanced * (1 + globalBonus);
      break;

    default:
      // Default to additive
      enhanced = baseValue + enhBonus;
      final = enhanced + globalBonus;
      break;
  }

  return {
    base: roundToDecimal(baseValue, 2),
    enhanced: roundToDecimal(enhanced, 2),
    final: roundToDecimal(final, 2),
  };
}

/**
 * Calculate complex stat (objects with sub-properties)
 */
function calculateComplexStat(
  aspect: string,
  baseObject: unknown,
  enhBonuses: EnhancementBonuses,
  globalBonuses: GlobalBonuses
): ComplexStat<unknown> | null {
  if (aspect === 'damage' && isDamageScale(baseObject)) {
    // Damage with scale value
    const enhBonus = enhBonuses.damage || 0;
    const globalBonus = globalBonuses.damage || 0;

    const baseScale = baseObject.scale;
    const enhancedScale = baseScale * (1 + enhBonus);
    const finalScale = enhancedScale * (1 + globalBonus);

    return {
      base: baseObject,
      enhanced: {
        ...baseObject,
        scale: roundToDecimal(enhancedScale, 2),
      },
      final: {
        ...baseObject,
        scale: roundToDecimal(finalScale, 2),
      },
    };
  }

  if ((aspect === 'defense' || aspect === 'resistance') && isTypedValues(baseObject)) {
    // Defense/Resistance with typed values (S/L, E/N, etc.)
    const enhanced: Record<string, number> = {};
    const final: Record<string, number> = {};

    const enhBonus = enhBonuses[aspect] || 0;
    const globalBonus = globalBonuses[aspect] || 0;

    Object.entries(baseObject).forEach(([type, value]) => {
      if (typeof value === 'number') {
        // For defense/resistance, bonuses are additive percentages
        const basePercent = value * 100;
        const enhancedPercent = basePercent + enhBonus * 100;
        const finalPercent = enhancedPercent + globalBonus * 100;

        enhanced[type] = roundToDecimal(enhancedPercent / 100, 4);
        final[type] = roundToDecimal(finalPercent / 100, 4);
      }
    });

    return {
      base: baseObject,
      enhanced,
      final,
    };
  }

  if (aspect === 'healing' && isScaleObject(baseObject)) {
    // Healing with scale
    const enhBonus = enhBonuses.heal || 0;
    const globalBonus = globalBonuses.healing || 0;

    const baseScale = baseObject.scale;
    const enhancedScale = baseScale * (1 + enhBonus);
    const finalScale = enhancedScale * (1 + globalBonus);

    return {
      base: baseObject,
      enhanced: {
        ...baseObject,
        scale: roundToDecimal(enhancedScale, 2),
      },
      final: {
        ...baseObject,
        scale: roundToDecimal(finalScale, 2),
      },
    };
  }

  return null;
}

// ============================================
// TYPE GUARDS
// ============================================

function isDamageScale(obj: unknown): obj is DamageScale {
  return typeof obj === 'object' && obj !== null && 'scale' in obj;
}

function isTypedValues(obj: unknown): obj is Record<string, number> {
  return typeof obj === 'object' && obj !== null && !('scale' in obj);
}

function isScaleObject(obj: unknown): obj is { scale: number } {
  return typeof obj === 'object' && obj !== null && 'scale' in obj;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Round number to specified decimal places
 */
function roundToDecimal(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Format stat value for display in tooltip
 */
export function formatStatForTooltip(
  stat: ThreeTierStat | null,
  format: 'number' | 'percentage' | 'seconds' = 'number'
): string {
  if (!stat) return '';

  const { base, enhanced, final } = stat;

  let baseStr: string;
  let enhancedStr: string;
  let finalStr: string;

  switch (format) {
    case 'percentage':
      baseStr = `${(base * 100).toFixed(1)}%`;
      enhancedStr = `${(enhanced * 100).toFixed(1)}%`;
      finalStr = `${(final * 100).toFixed(1)}%`;
      break;
    case 'seconds':
      baseStr = `${base.toFixed(2)}s`;
      enhancedStr = `${enhanced.toFixed(2)}s`;
      finalStr = `${final.toFixed(2)}s`;
      break;
    default:
      baseStr = base.toFixed(2);
      enhancedStr = enhanced.toFixed(2);
      finalStr = final.toFixed(2);
      break;
  }

  // Return format: base (enhanced) [final]
  // Only show enhanced if different from base
  // Only show final if different from enhanced
  if (base === enhanced && enhanced === final) {
    return baseStr;
  } else if (enhanced === final) {
    return `${baseStr} (${enhancedStr})`;
  } else {
    return `${baseStr} (${enhancedStr}) [${finalStr}]`;
  }
}

/**
 * Check if stat has been modified by enhancements
 */
export function isStatEnhanced(stat: ThreeTierStat): boolean {
  return stat.enhanced !== stat.base;
}

/**
 * Check if stat has global bonuses applied
 */
export function hasGlobalBonuses(stat: ThreeTierStat): boolean {
  return stat.final !== stat.enhanced;
}

/**
 * Calculate percentage improvement from base to final
 */
export function calculateImprovement(stat: ThreeTierStat): number {
  if (stat.base === 0) return 0;
  return ((stat.final - stat.base) / stat.base) * 100;
}
