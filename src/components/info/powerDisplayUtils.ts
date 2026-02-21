/**
 * Shared utility functions and constants for power display components.
 * Used by both PowerInfoTooltip and InfoPanel to avoid code duplication.
 */

import type {
  DefenseByType,
  ResistanceByType,
  MovementByType,
  NumberOrScaled,
  SelectedPower,
} from '@/types';
import { getScaleValue } from '@/types';
import type { CharacterGlobalBonuses } from '@/utils/calculations';
import { getTableValue } from '@/data/at-tables';

// ============================================
// TABLE BASE VALUES
// These are the base percentages per scale point from AT tables
// ============================================
export const TABLE_BASE_VALUES: Record<string, number> = {
  // Resistance tables (10% per scale)
  'melee_res_dmg': 0.10,
  'ranged_res_dmg': 0.10,
  'melee_debuff_res_dmg': 0.10,
  'ranged_debuff_res_dmg': 0.10,
  // Defense tables (varies, but typically around 2-3% per scale for buffs)
  'melee_buff_def': 0.02,
  'ranged_buff_def': 0.02,
  'melee_debuff_def': 0.05,
  'ranged_debuff_def': 0.05,
  // Slow/Movement tables
  'ranged_slow': 0.10,
  'melee_slow': 0.10,
  // Default fallback
  'default': 0.10,
};

/**
 * Base values for buff/debuff effects per scale point at modifier 1.0
 * In City of Heroes, debuffs and buffs use different base scaling:
 * - Debuffs (ToHit, Defense, Resistance debuffs): 5% per scale (0.05)
 * - Buffs (Damage, Defense, ToHit buffs): 10% per scale (0.10)
 */
export const BASE_DEBUFF = 0.05;  // 5% per scale for debuffs
export const BASE_BUFF = 0.10;    // 10% per scale for buffs

export type EffectCategory = 'buff' | 'debuff';

/**
 * Get the base value for a table name.
 * If archetype and level are provided, uses AT-specific tables first.
 */
export function getTableBaseValue(tableName: string | undefined, archetype?: string, level?: number): number {
  if (!tableName) return TABLE_BASE_VALUES['default'];
  const key = tableName.toLowerCase();

  // "Ones" tables (Melee_Ones, Ranged_Ones) are constant 1.0 for all ATs
  if (key.endsWith('_ones')) return 1.0;

  // Try AT-specific table first
  if (archetype) {
    const atValue = getTableValue(archetype, key, level ?? 50);
    if (atValue !== undefined) return atValue;
  }

  return TABLE_BASE_VALUES[key] ?? TABLE_BASE_VALUES['default'];
}

/**
 * Calculate the final percentage value for a resistance/defense effect
 * Formula: scale × table_base_value (AT-specific when archetype provided)
 */
export function calculateResistancePercent(effect: NumberOrScaled | undefined, archetype?: string, level?: number): number {
  if (!effect) return 0;
  if (typeof effect === 'number') return effect;
  const baseValue = getTableBaseValue(effect.table, archetype, level);
  return effect.scale * baseValue;
}

/**
 * Check if all values in an array are approximately the same
 */
export function allValuesSame(values: number[]): boolean {
  if (values.length === 0) return true;
  const first = values[0];
  return values.every(v => Math.abs(v - first) < 0.001);
}

/**
 * Check if an effect value is a "by-type" object (DefenseByType, ResistanceByType, MovementByType)
 * vs a simple NumberOrScaled value
 */
export function isByTypeObject(value: NumberOrScaled | DefenseByType | ResistanceByType | MovementByType | undefined): value is DefenseByType | ResistanceByType | MovementByType {
  if (!value) return false;
  if (typeof value === 'number') return false;
  // ScaledEffect has 'scale' and 'table'
  if ('scale' in value && 'table' in value) return false;
  // Otherwise it's a ByType object with damage/defense type keys
  return true;
}

/**
 * Get the first/total value from a by-type object for simple display
 * Returns the first defined value, used when displaying a single summary value
 */
export function getByTypeFirstValue(byType: DefenseByType | ResistanceByType | MovementByType): NumberOrScaled | undefined {
  // Defense/Resistance type keys
  const defResKeys = ['smashing', 'lethal', 'fire', 'cold', 'energy', 'negative', 'psionic', 'toxic', 'melee', 'ranged', 'aoe'];
  // Movement type keys
  const movementKeys = ['runSpeed', 'flySpeed', 'jumpHeight', 'jumpSpeed', 'fly', 'movementControl', 'movementFriction'];
  const allKeys = [...defResKeys, ...movementKeys];
  for (const key of allKeys) {
    if ((byType as Record<string, NumberOrScaled | undefined>)[key] !== undefined) {
      return (byType as Record<string, NumberOrScaled | undefined>)[key];
    }
  }
  return undefined;
}

/**
 * Get the effective buff/debuff modifier for the powerset
 * - Defender/Controller PRIMARY support: uses their full buffDebuffModifier
 * - Corruptor/Mastermind SECONDARY support: uses 1.0 (base rate, not their primary modifier)
 * - Others: uses 1.0
 */
export function getEffectiveBuffDebuffModifier(powerSet: string, archetypeModifier: number): number {
  const powersetArchetype = powerSet.split('/')[0];

  // Defender and Controller have support as PRIMARY - use full modifier
  if (powersetArchetype === 'defender' || powersetArchetype === 'controller') {
    return archetypeModifier;
  }

  // Corruptor and Mastermind have support as SECONDARY - use base rate (1.0)
  // Their buffDebuffModifier (0.75) applies to their primary blast damage, not secondary support
  if (powersetArchetype === 'corruptor' || powersetArchetype === 'mastermind') {
    return 1.0;
  }

  // Pool powers and others use base rate
  return 1.0;
}

/**
 * Calculate the actual buff/debuff percentage value
 * Formula: scale × base × effectiveModifier
 * Accepts both number (legacy) and ScaledEffect (new format) as input.
 */
export function calculateBuffDebuffValue(
  scaleOrEffect: NumberOrScaled,
  effectiveModifier: number,
  category: EffectCategory = 'buff'
): number {
  const scale = getScaleValue(scaleOrEffect);
  if (scale === undefined || scale === 0) return 0;
  const baseValue = category === 'debuff' ? BASE_DEBUFF : BASE_BUFF;
  return scale * baseValue * effectiveModifier;
}

/**
 * Format a decimal value as a percentage string
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Type labels for damage/defense/resistance types (short form)
 */
export const TYPE_LABELS_SHORT: Record<string, string> = {
  smashing: 'S', lethal: 'L', fire: 'F', cold: 'C',
  energy: 'E', negative: 'N', psionic: 'P', toxic: 'T',
  melee: 'Mel', ranged: 'Rng', aoe: 'AoE',
};

/**
 * Type labels for damage/defense/resistance types (full form)
 */
export const TYPE_LABELS_FULL: Record<string, string> = {
  smashing: 'Smash', lethal: 'Lethal', fire: 'Fire', cold: 'Cold',
  energy: 'Energy', negative: 'Neg', psionic: 'Psi', toxic: 'Toxic',
  melee: 'Melee', ranged: 'Ranged', aoe: 'AoE',
};

/**
 * Movement type labels
 */
export const MOVEMENT_TYPE_LABELS: Record<string, string> = {
  runSpeed: 'Run Speed', flySpeed: 'Fly Speed',
  jumpSpeed: 'Jump Speed', jumpHeight: 'Jump Height',
  fly: 'Flight', movementControl: 'Move Control', movementFriction: 'Friction',
};

/**
 * Three-tier calculation result
 */
export interface ThreeTierValues {
  base: number;
  enhanced: number;
  final: number;
}

/**
 * Calculate three-tier stats (Base/Enhanced/Final) for key values.
 *
 * This is the single source of truth for three-tier math. All display
 * components (InfoPanel, PowerInfoTooltip, EffectDisplay, SharedPowerComponents)
 * should delegate to this function rather than implementing their own formulas.
 *
 * Formulas by aspect type:
 * - Reductions (endurance, recharge): base / (1 + bonus) — lower is better
 * - Multiplicative (everything else): base * (1 + bonus) — higher is better
 */
export function calcThreeTier(
  aspect: string,
  baseValue: number,
  enhancementBonuses: Record<string, number | undefined>,
  globalBonuses: Record<string, number | undefined>
): ThreeTierValues {
  const enhBonus = enhancementBonuses[aspect] || 0;
  const globalBonus = globalBonuses[aspect] || 0;

  let enhanced: number;
  let final: number;

  if (aspect === 'endurance' || aspect === 'recharge') {
    // Divisive reduction: base / (1 + bonus) — matches CoH game formula
    enhanced = baseValue / Math.max(1, 1 + enhBonus);
    final = enhanced / Math.max(1, 1 + globalBonus);
  } else {
    // Multiplicative: base * (1 + bonus)
    enhanced = baseValue * (1 + enhBonus);
    final = enhanced * (1 + globalBonus);
  }

  return { base: baseValue, enhanced, final };
}

// ============================================
// GLOBAL BONUS CONVERSION
// ============================================

/**
 * Maps enhancement aspect keys to their corresponding CharacterGlobalBonuses field names.
 * Only aspects where a global bonus directly modifies a power's output are included.
 *
 * This is the single source of truth for bridging the dashboard's global stats
 * (percentage values, e.g. 50 = +50%) with the per-power three-tier calculation
 * (decimal multipliers, e.g. 0.5 = +50%).
 *
 * Add new entries here when the dashboard gains a global bonus that should affect
 * per-power calculations (e.g. a new global heal bonus).
 */
const GLOBAL_BONUS_ASPECT_MAP: [string, keyof CharacterGlobalBonuses][] = [
  ['damage', 'damage'],
  ['accuracy', 'accuracy'],
  ['recharge', 'recharge'],
  ['endurance', 'endurance'],
  ['range', 'range'],
  ['tohit', 'toHit'],
  ['heal', 'healOther'],
];

/**
 * Convert CharacterGlobalBonuses (percentage values from the dashboard calculation)
 * to enhancement-aspect-keyed decimal multipliers for three-tier power display.
 *
 * Used by InfoPanel, PowerInfoTooltip, and EffectDisplay to ensure consistent
 * global bonus application across all power display surfaces.
 */
export function convertGlobalBonusesToAspects(
  globalBonuses: CharacterGlobalBonuses
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [aspect, field] of GLOBAL_BONUS_ASPECT_MAP) {
    const value = globalBonuses[field];
    if (value) {
      result[aspect] = value / 100;
    }
  }
  return result;
}

/**
 * Find a selected power from the build by name
 */
export function findSelectedPowerInBuild(
  powerName: string,
  build: {
    primary: { powers: SelectedPower[] };
    secondary: { powers: SelectedPower[] };
    pools: { powers: SelectedPower[] }[];
    epicPool?: { powers: SelectedPower[] } | null;
    inherents: SelectedPower[];
  }
): SelectedPower | null {
  const primary = build.primary.powers.find((p) => p.name === powerName);
  if (primary) return primary;
  const secondary = build.secondary.powers.find((p) => p.name === powerName);
  if (secondary) return secondary;
  for (const pool of build.pools) {
    const poolPower = pool.powers.find((p) => p.name === powerName);
    if (poolPower) return poolPower;
  }
  if (build.epicPool) {
    const epic = build.epicPool.powers.find((p) => p.name === powerName);
    if (epic) return epic;
  }
  // Check inherent powers
  const inherent = build.inherents.find((p) => p.name === powerName);
  if (inherent) return inherent;
  return null;
}

// ============================================
// BY-TYPE EXPANSION HELPERS
// ============================================

/**
 * Mez protection type labels for expanded protection rows
 */
const MEZ_LABELS: Record<string, string> = {
  stun: 'Stun', hold: 'Hold', immobilize: 'Immob',
  sleep: 'Sleep', confuse: 'Confuse', fear: 'Fear', knockback: 'KB',
};

/**
 * Expand a by-type object (DefenseByType, ResistanceByType, ElusivityByType)
 * into individual type entries with calculated percentage values.
 *
 * If all values are the same, returns a single summary entry with label "Def (All)".
 * Otherwise returns per-type entries like "Def: Smash", "Def: Lethal".
 */
export function expandByTypeEntries(
  obj: Record<string, unknown>,
  labelPrefix: string,
  archetype?: string,
  level?: number
): Array<{ typeKey: string; typeLabel: string; basePercent: number }> {
  const entries = Object.entries(obj).filter(([, v]) => v !== undefined && v !== 0);
  if (entries.length === 0) return [];

  const resolved = entries.map(([typeKey, value]) => ({
    typeKey,
    basePercent: calculateResistancePercent(value as NumberOrScaled, archetype, level) * 100,
  }));

  const percentValues = resolved.map(r => r.basePercent);
  if (allValuesSame(percentValues) && resolved.length > 1) {
    return [{
      typeKey: '_all',
      typeLabel: `${labelPrefix} (All)`,
      basePercent: resolved[0].basePercent,
    }];
  }

  return resolved.map(({ typeKey, basePercent }) => ({
    typeKey,
    typeLabel: `${labelPrefix}: ${TYPE_LABELS_FULL[typeKey] || typeKey}`,
    basePercent,
  }));
}

/**
 * Expand ProtectionEffects into individual mez type entries.
 * Returns entries like "Prot: Stun", "Prot: Hold" with magnitude values.
 */
export function expandProtectionEntries(
  protection: Record<string, number>,
  labelPrefix: string
): Array<{ typeKey: string; typeLabel: string; magnitude: number }> {
  const entries = Object.entries(protection).filter(([, v]) => v !== undefined && v !== 0);
  if (entries.length === 0) return [];

  return entries.map(([typeKey, value]) => ({
    typeKey,
    typeLabel: `${labelPrefix}: ${MEZ_LABELS[typeKey] || typeKey}`,
    magnitude: value,
  }));
}

/**
 * Check if power has any effects to show in the consolidated view
 */
export function hasDisplayableEffects(
  effects: Record<string, unknown> | undefined,
  allowedEnhancements: string[]
): boolean {
  if (!effects) return false;
  const allowed = new Set(allowedEnhancements);

  return !!(
    // Power execution stats
    (allowed.has('EnduranceReduction') && effects?.enduranceCost) ||
    (allowed.has('Recharge') && effects?.recharge) ||
    (allowed.has('Accuracy') && effects?.accuracy) ||
    (allowed.has('Range') && effects?.range && (effects.range as number) > 0) ||
    // Debuffs
    effects?.tohitDebuff || effects?.defenseDebuff || effects?.resistanceDebuff ||
    effects?.damageDebuff || effects?.regenDebuff || effects?.recoveryDebuff || effects?.slow ||
    // Buffs
    effects?.tohitBuff || effects?.damageBuff || effects?.defenseBuff ||
    effects?.rechargeBuff || effects?.speedBuff || effects?.recoveryBuff || effects?.enduranceBuff ||
    // Healing
    (effects?.healing && (effects.healing as { scale?: number }).scale != null) ||
    // Mez effects
    effects?.stun || effects?.hold || effects?.immobilize ||
    effects?.sleep || effects?.fear || effects?.confuse ||
    effects?.knockback || effects?.knockup ||
    // Defense/Resistance (armor powers)
    effects?.resistance || effects?.defense || effects?.elusivity ||
    // Movement
    effects?.movement
  );
}
