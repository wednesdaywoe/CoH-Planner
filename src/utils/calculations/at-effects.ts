/**
 * Archetype-Based Effect Calculations
 *
 * Calculates power effects (damage, buffs, debuffs, heals) using
 * the authentic AT modifier tables from Homecoming data.
 *
 * New powers use a scale + table format:
 *   { scale: 2.5, table: "Ranged_Debuff_ToHit" }
 *
 * This module provides functions to calculate final values from that format.
 */

import { AT_TABLES, getTableValue } from '@/data/at-tables';
import type { ArchetypeId } from '@/types';

// ============================================
// TYPES
// ============================================

/** Effect with scale and table reference (new format) */
export interface ScaledEffect {
  scale: number;
  table: string;
}

/** Damage entry with type, scale, and table (new format) */
export interface ScaledDamage {
  type: string;
  scale: number;
  table: string;
}

/** Result of an effect calculation */
export interface EffectCalculationResult {
  /** Raw value from table (before scale) */
  tableValue: number;
  /** Final calculated value (scale * tableValue) */
  value: number;
  /** As a percentage (value * 100) */
  percentage: number;
  /** Whether this is a debuff (negative value) */
  isDebuff: boolean;
}

/** Result of a damage calculation */
export interface DamageCalculationResult {
  /** Damage type (Fire, Energy, etc.) */
  type: string;
  /** Base damage value */
  base: number;
  /** With enhancement bonus */
  enhanced: number;
  /** With enhancement and buff bonuses */
  final: number;
  /** Whether this is PvP damage */
  isPvP: boolean;
}

// ============================================
// TABLE NAME NORMALIZATION
// ============================================

/**
 * Normalize a table name from power data to match AT_TABLES keys
 * Examples:
 *   "Ranged_Debuff_ToHit" -> "ranged_debuff_tohit"
 *   "Ranged_Damage" -> "ranged_damage"
 *   "Melee_Buff_Def" -> "melee_buff_def"
 */
export function normalizeTableName(tableName: string): string {
  return tableName.toLowerCase().replace(/-/g, '_');
}

/**
 * Normalize archetype ID for AT_TABLES lookup
 * Handles various formats: "defender", "arachnos-soldier", etc.
 */
export function normalizeArchetypeId(archetypeId: string): string {
  return archetypeId.toLowerCase().replace(/_/g, '-');
}

// ============================================
// EFFECT CALCULATIONS
// ============================================

/**
 * Calculate an effect value from scale and table
 *
 * @param effect - The scaled effect { scale, table }
 * @param archetypeId - The archetype ID
 * @param level - Character level (default 50)
 * @returns Calculation result or null if table not found
 *
 * @example
 * // Radiation Infection tohit debuff for Defender at level 50
 * calculateScaledEffect(
 *   { scale: 2.5, table: "Ranged_Debuff_ToHit" },
 *   "defender",
 *   50
 * )
 * // Returns: { tableValue: -0.125, value: -0.3125, percentage: -31.25, isDebuff: true }
 */
export function calculateScaledEffect(
  effect: ScaledEffect,
  archetypeId: ArchetypeId | string,
  level: number = 50
): EffectCalculationResult | null {
  const normalizedAT = normalizeArchetypeId(archetypeId);
  const normalizedTable = normalizeTableName(effect.table);

  const tableValue = getTableValue(normalizedAT, normalizedTable, level);
  if (tableValue === undefined) {
    console.warn(`Table not found: ${normalizedTable} for ${normalizedAT}`);
    return null;
  }

  const value = effect.scale * tableValue;
  const isDebuff = tableValue < 0;

  return {
    tableValue,
    value,
    percentage: value * 100,
    isDebuff,
  };
}

/**
 * Calculate multiple effects and return a map of results
 *
 * @param effects - Object with effect names and scaled effects
 * @param archetypeId - The archetype ID
 * @param level - Character level
 * @returns Map of effect name to calculation result
 */
export function calculateMultipleEffects(
  effects: Record<string, ScaledEffect | number | unknown>,
  archetypeId: ArchetypeId | string,
  level: number = 50
): Record<string, EffectCalculationResult> {
  const results: Record<string, EffectCalculationResult> = {};

  for (const [key, effect] of Object.entries(effects)) {
    // Skip non-scaled effects (like effectDuration)
    if (!isScaledEffect(effect)) continue;

    const result = calculateScaledEffect(effect, archetypeId, level);
    if (result) {
      results[key] = result;
    }
  }

  return results;
}

/**
 * Type guard for ScaledEffect
 */
export function isScaledEffect(value: unknown): value is ScaledEffect {
  return (
    typeof value === 'object' &&
    value !== null &&
    'scale' in value &&
    'table' in value &&
    typeof (value as ScaledEffect).scale === 'number' &&
    typeof (value as ScaledEffect).table === 'string'
  );
}

// ============================================
// DAMAGE CALCULATIONS
// ============================================

/**
 * Calculate damage from scaled damage entry
 *
 * @param damage - The scaled damage { type, scale, table }
 * @param archetypeId - The archetype ID
 * @param level - Character level
 * @param enhancementBonus - Enhancement bonus (0.95 = 95%)
 * @param damageBuffs - Active damage buffs (0.50 = 50%)
 * @returns Damage calculation result or null if table not found
 *
 * @example
 * // Neutrino Bolt damage for Defender at level 50
 * calculateScaledDamage(
 *   { type: "Energy", scale: 0.6, table: "Ranged_Damage" },
 *   "defender",
 *   50,
 *   0.95,
 *   0
 * )
 */
export function calculateScaledDamage(
  damage: ScaledDamage,
  archetypeId: ArchetypeId | string,
  level: number = 50,
  enhancementBonus: number = 0,
  damageBuffs: number = 0
): DamageCalculationResult | null {
  const normalizedAT = normalizeArchetypeId(archetypeId);
  const normalizedTable = normalizeTableName(damage.table);

  const tableValue = getTableValue(normalizedAT, normalizedTable, level);
  if (tableValue === undefined) {
    console.warn(`Damage table not found: ${normalizedTable} for ${normalizedAT}`);
    return null;
  }

  // Damage tables store negative values, so we take absolute value
  const baseDamagePerScale = Math.abs(tableValue);

  const base = damage.scale * baseDamagePerScale;
  const enhanced = base * (1 + enhancementBonus);
  const final = enhanced * (1 + damageBuffs);

  return {
    type: damage.type,
    base,
    enhanced,
    final,
    isPvP: normalizedTable.includes('pvp'),
  };
}

/**
 * Calculate total damage from array of damage entries
 *
 * @param damages - Array of scaled damage entries
 * @param archetypeId - The archetype ID
 * @param level - Character level
 * @param enhancementBonus - Enhancement bonus
 * @param damageBuffs - Active damage buffs
 * @param includePvP - Whether to include PvP damage entries
 * @returns Array of damage results (excluding PvP unless requested)
 */
export function calculatePowerDamageFromScaled(
  damages: ScaledDamage[],
  archetypeId: ArchetypeId | string,
  level: number = 50,
  enhancementBonus: number = 0,
  damageBuffs: number = 0,
  includePvP: boolean = false
): DamageCalculationResult[] {
  const results: DamageCalculationResult[] = [];

  for (const damage of damages) {
    const result = calculateScaledDamage(
      damage,
      archetypeId,
      level,
      enhancementBonus,
      damageBuffs
    );

    if (result && (includePvP || !result.isPvP)) {
      results.push(result);
    }
  }

  return results;
}

/**
 * Sum up total damage from multiple damage types
 */
export function sumDamageResults(
  results: DamageCalculationResult[]
): { base: number; enhanced: number; final: number } {
  return results.reduce(
    (totals, r) => ({
      base: totals.base + r.base,
      enhanced: totals.enhanced + r.enhanced,
      final: totals.final + r.final,
    }),
    { base: 0, enhanced: 0, final: 0 }
  );
}

// ============================================
// HEAL CALCULATIONS
// ============================================

/**
 * Calculate heal value from scaled effect
 */
export function calculateScaledHeal(
  effect: ScaledEffect,
  archetypeId: ArchetypeId | string,
  level: number = 50,
  enhancementBonus: number = 0,
  healBuffs: number = 0
): { base: number; enhanced: number; final: number } | null {
  const normalizedAT = normalizeArchetypeId(archetypeId);
  const normalizedTable = normalizeTableName(effect.table);

  const tableValue = getTableValue(normalizedAT, normalizedTable, level);
  if (tableValue === undefined) {
    return null;
  }

  // Heal tables store positive values
  const base = effect.scale * tableValue;
  const enhanced = base * (1 + enhancementBonus);
  const final = enhanced * (1 + healBuffs);

  return { base, enhanced, final };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get available tables for an archetype
 */
export function getArchetypeTableNames(archetypeId: string): string[] {
  const normalizedAT = normalizeArchetypeId(archetypeId);
  const atData = AT_TABLES[normalizedAT];
  if (!atData) return [];
  return Object.keys(atData.tables);
}

/**
 * Check if an archetype has AT tables available
 */
export function hasATTables(archetypeId: string): boolean {
  const normalizedAT = normalizeArchetypeId(archetypeId);
  return normalizedAT in AT_TABLES;
}

/**
 * Get the AT modifier comparison between archetypes for a specific table
 * Useful for showing "Defenders have 25% higher debuffs than Controllers"
 */
export function compareATModifiers(
  tableName: string,
  archetypeId1: string,
  archetypeId2: string,
  level: number = 50
): { ratio: number; difference: number } | null {
  const normalizedTable = normalizeTableName(tableName);

  const value1 = getTableValue(normalizeArchetypeId(archetypeId1), normalizedTable, level);
  const value2 = getTableValue(normalizeArchetypeId(archetypeId2), normalizedTable, level);

  if (value1 === undefined || value2 === undefined || value2 === 0) {
    return null;
  }

  return {
    ratio: value1 / value2,
    difference: value1 - value2,
  };
}

/**
 * Format an effect value for display
 *
 * @param result - The calculation result
 * @param decimals - Number of decimal places
 * @returns Formatted string like "-31.25%" or "+12.5%"
 */
export function formatEffectValue(
  result: EffectCalculationResult,
  decimals: number = 2
): string {
  const sign = result.value >= 0 ? '+' : '';
  return `${sign}${result.percentage.toFixed(decimals)}%`;
}

/**
 * Format damage value for display
 */
export function formatDamageValue(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}
