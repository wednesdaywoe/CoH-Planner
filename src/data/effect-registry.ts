/**
 * Effect Registry - Data-driven configuration for power effect display
 *
 * Instead of hardcoding checks for each effect type in components,
 * this registry defines how each effect should be displayed.
 * Components iterate over effects and use this registry to render them.
 */

import type { ArchetypeId, NumberOrScaled, NumberOrMez, MezEffect } from '@/types';
import { getScaleValue } from '@/types';
import { calculateBuffDebuffValue } from '@/utils/calculations';
import { getTableValue } from '@/data/at-tables';
import { STAT_COLORS } from './stat-colors';

// ============================================
// TYPES
// ============================================

export type EffectCategory =
  | 'execution'   // Power execution stats (endurance, recharge, accuracy, range)
  | 'damage'      // Direct damage, DoT
  | 'control'     // Hold, stun, immobilize, etc.
  | 'buff'        // Positive effects on self/allies
  | 'debuff'      // Negative effects on enemies
  | 'protection'  // Defense, resistance, mez protection
  | 'movement'    // Speed, fly, teleport
  | 'special';    // Summons, unique effects

export type EffectFormat =
  | 'percent'     // Display as percentage (e.g., +25%)
  | 'value'       // Display as raw value
  | 'mag'         // Display as magnitude (Mag 3)
  | 'duration'    // Display with seconds (12s)
  | 'scale'       // Display scale value
  | 'damage'      // Use damage calculation system
  | 'degrees'     // Display as degrees (e.g., 30°)
  | 'custom';     // Needs special handling

export interface EffectDisplayConfig {
  /** Display label */
  label: string;
  /** Effect category for grouping */
  category: EffectCategory;
  /** Tailwind color class */
  colorClass: string;
  /** How to format the value */
  format: EffectFormat;
  /** Enhancement aspect that modifies this (for three-tier display) */
  enhancementAspect?: string;
  /** Whether this is a buff or debuff for percentage calculation */
  calculation?: 'buff' | 'debuff';
  /** Priority for display order within category (lower = first) */
  priority?: number;
  /** Whether this effect can have "by type" variants (defense, resistance) */
  canBeByType?: boolean;
  /** Whether by-type variants should expand into individual rows (vs abbreviated summary) */
  expandByType?: boolean;
  /** Custom render key if different from effect key */
  renderAs?: string;
  /** Base value to multiply by (e.g., accuracy is multiplier × 75% base to-hit) */
  baseMultiplier?: number;
}

// ============================================
// EFFECT REGISTRY
// ============================================

export const EFFECT_REGISTRY: Record<string, EffectDisplayConfig> = {
  // === EXECUTION (Power Stats) ===
  enduranceCost: {
    label: 'Endurance',
    category: 'execution',
    colorClass: STAT_COLORS.endurance,
    format: 'value',
    enhancementAspect: 'endurance',
    priority: 1,
  },
  buffDuration: {
    label: 'Duration',
    category: 'execution',
    colorClass: STAT_COLORS.buffDuration,
    format: 'duration',
    priority: 1.5,
  },
  recharge: {
    label: 'Recharge',
    category: 'execution',
    colorClass: STAT_COLORS.recharge,
    format: 'duration',
    enhancementAspect: 'recharge',
    priority: 2,
  },
  accuracy: {
    label: 'Accuracy',
    category: 'execution',
    colorClass: STAT_COLORS.accuracy,
    format: 'percent',
    enhancementAspect: 'accuracy',
    priority: 3,
    baseMultiplier: 75,  // Accuracy is multiplier × 75% base to-hit
  },
  range: {
    label: 'Range',
    category: 'execution',
    colorClass: STAT_COLORS.range,
    format: 'value',
    enhancementAspect: 'range',
    priority: 4,
  },
  castTime: {
    label: 'Cast Time',
    category: 'execution',
    colorClass: STAT_COLORS.castTime,
    format: 'duration',
    priority: 5,
  },
  effectDuration: {
    label: 'Effect Dur',
    category: 'execution',
    colorClass: STAT_COLORS.effectDuration,
    format: 'duration',
    priority: 6.5,
  },
  radius: {
    label: 'Radius',
    category: 'execution',
    colorClass: STAT_COLORS.radius,
    format: 'value',
    priority: 7,
  },
  arc: {
    label: 'Arc',
    category: 'execution',
    colorClass: STAT_COLORS.radius,
    format: 'degrees',
    priority: 8,
  },
  maxTargets: {
    label: 'Max Targets',
    category: 'execution',
    colorClass: STAT_COLORS.radius,
    format: 'value',
    priority: 9,
  },

  // === CONTROL (Mez Effects — all pink) ===
  hold: {
    label: 'Hold',
    category: 'control',
    colorClass: STAT_COLORS.hold,
    format: 'mag',
    priority: 1,
  },
  stun: {
    label: 'Stun',
    category: 'control',
    colorClass: STAT_COLORS.stun,
    format: 'mag',
    priority: 2,
  },
  immobilize: {
    label: 'Immobilize',
    category: 'control',
    colorClass: STAT_COLORS.immobilize,
    format: 'mag',
    priority: 3,
  },
  sleep: {
    label: 'Sleep',
    category: 'control',
    colorClass: STAT_COLORS.sleep,
    format: 'mag',
    priority: 4,
  },
  fear: {
    label: 'Fear',
    category: 'control',
    colorClass: STAT_COLORS.fear,
    format: 'mag',
    priority: 5,
  },
  confuse: {
    label: 'Confuse',
    category: 'control',
    colorClass: STAT_COLORS.confuse,
    format: 'mag',
    priority: 6,
  },
  taunt: {
    label: 'Taunt',
    category: 'control',
    colorClass: STAT_COLORS.taunt,
    format: 'mag',
    priority: 7,
  },
  placate: {
    label: 'Placate',
    category: 'control',
    colorClass: STAT_COLORS.placate,
    format: 'mag',
    priority: 8,
  },
  knockback: {
    label: 'Knockback',
    category: 'control',
    colorClass: STAT_COLORS.knockback,
    format: 'mag',
    priority: 10,
  },
  knockup: {
    label: 'Knockup',
    category: 'control',
    colorClass: STAT_COLORS.knockup,
    format: 'mag',
    priority: 11,
  },
  repel: {
    label: 'Repel',
    category: 'control',
    colorClass: STAT_COLORS.repel,
    format: 'mag',
    priority: 12,
  },

  // === DEBUFFS (dimmed versions of buff colors) ===
  tohitDebuff: {
    label: '-ToHit',
    category: 'debuff',
    colorClass: STAT_COLORS.tohitDebuff,
    format: 'percent',
    calculation: 'debuff',
    enhancementAspect: 'tohitDebuff',
    priority: 1,
  },
  defenseDebuff: {
    label: '-Defense',
    category: 'debuff',
    colorClass: STAT_COLORS.defenseDebuff,
    format: 'percent',
    calculation: 'debuff',
    enhancementAspect: 'defenseDebuff',
    canBeByType: true,
    priority: 2,
  },
  resistanceDebuff: {
    label: '-Resist',
    category: 'debuff',
    colorClass: STAT_COLORS.resistanceDebuff,
    format: 'percent',
    calculation: 'debuff',
    enhancementAspect: 'resistanceDebuff',
    canBeByType: true,
    priority: 3,
  },
  damageDebuff: {
    label: '-Damage',
    category: 'debuff',
    colorClass: STAT_COLORS.damageDebuff,
    format: 'percent',
    calculation: 'debuff',
    enhancementAspect: 'damageDebuff',
    priority: 4,
  },
  regenDebuff: {
    label: '-Regen',
    category: 'debuff',
    colorClass: STAT_COLORS.regenDebuff,
    format: 'percent',
    baseMultiplier: 100,
    priority: 5,
  },
  recoveryDebuff: {
    label: '-Recovery',
    category: 'debuff',
    colorClass: STAT_COLORS.recoveryDebuff,
    format: 'percent',
    baseMultiplier: 100,
    priority: 6,
  },
  rechargeDebuff: {
    label: '-Recharge',
    category: 'debuff',
    colorClass: STAT_COLORS.rechargeDebuff,
    format: 'percent',
    calculation: 'debuff',
    priority: 7,
  },
  slow: {
    label: '-Speed',
    category: 'debuff',
    colorClass: STAT_COLORS.slow,
    format: 'percent',
    canBeByType: true,
    priority: 8,
  },
  enduranceDrain: {
    label: '-End Drain',
    category: 'debuff',
    colorClass: STAT_COLORS.enduranceDrain,
    format: 'percent',
    priority: 9,
  },
  enduranceCrash: {
    label: '-End (Crash)',
    category: 'debuff',
    colorClass: STAT_COLORS.enduranceDrain,
    format: 'value',
    priority: 9,
  },
  threatDebuff: {
    label: '-Threat',
    category: 'debuff',
    colorClass: STAT_COLORS.threatDebuff,
    format: 'percent',
    priority: 10,
  },
  perceptionDebuff: {
    label: '-Perception',
    category: 'debuff',
    colorClass: STAT_COLORS.perceptionDebuff,
    format: 'percent',
    priority: 11,
  },
  specialDebuff: {
    label: '-Special',
    category: 'debuff',
    colorClass: STAT_COLORS.tohitDebuff,
    format: 'percent',
    expandByType: true,
    priority: 12,
  },

  // === BUFFS ===
  tohitBuff: {
    label: '+ToHit',
    category: 'buff',
    colorClass: STAT_COLORS.tohit,
    format: 'percent',
    calculation: 'buff',
    enhancementAspect: 'tohit',
    priority: 1,
  },
  damageBuff: {
    label: '+Damage',
    category: 'buff',
    colorClass: STAT_COLORS.damage,
    format: 'percent',
    calculation: 'buff',
    enhancementAspect: 'damage',
    priority: 2,
  },
  defenseBuff: {
    label: '+Defense',
    category: 'buff',
    colorClass: STAT_COLORS.defense,
    format: 'percent',
    enhancementAspect: 'defense',
    canBeByType: true,
    expandByType: true,
    priority: 3,
  },
  rechargeBuff: {
    label: '+Recharge',
    category: 'buff',
    colorClass: STAT_COLORS.rechargeBuff,
    format: 'percent',
    calculation: 'buff',
    priority: 4,
  },
  recoveryBuff: {
    label: '+Recovery',
    category: 'buff',
    colorClass: STAT_COLORS.recoveryBuff,
    format: 'percent',
    baseMultiplier: 100,
    priority: 5,
  },
  regenBuff: {
    label: '+Regen',
    category: 'buff',
    colorClass: STAT_COLORS.regen,
    format: 'percent',
    baseMultiplier: 100,
    priority: 6,
  },
  speedBuff: {
    label: '+Speed',
    category: 'buff',
    colorClass: STAT_COLORS.speed,
    format: 'percent',
    calculation: 'buff',
    priority: 7,
  },
  maxHPBuff: {
    label: '+Max HP',
    category: 'buff',
    colorClass: STAT_COLORS.maxHP,
    format: 'percent',
    calculation: 'buff',
    priority: 8,
  },
  maxEndBuff: {
    label: '+Max End',
    category: 'buff',
    colorClass: STAT_COLORS.maxEnd,
    format: 'percent',
    calculation: 'buff',
    priority: 9,
  },
  rangeBuff: {
    label: '+Range',
    category: 'buff',
    colorClass: STAT_COLORS.rangeBuff,
    format: 'percent',
    calculation: 'buff',
    priority: 10,
  },
  enduranceDiscount: {
    label: '-End Cost',
    category: 'buff',
    colorClass: STAT_COLORS.enduranceDiscount,
    format: 'percent',
    calculation: 'buff',
    priority: 11,
  },
  enduranceGain: {
    label: '+End Gain',
    category: 'buff',
    colorClass: STAT_COLORS.enduranceGain,
    format: 'percent',
    priority: 12,
  },
  threatBuff: {
    label: '+Threat',
    category: 'buff',
    colorClass: STAT_COLORS.threat,
    format: 'percent',
    priority: 13,
  },
  perceptionBuff: {
    label: '+Perception',
    category: 'buff',
    colorClass: STAT_COLORS.perception,
    format: 'percent',
    priority: 14,
  },
  absorb: {
    label: 'Absorb',
    category: 'buff',
    colorClass: STAT_COLORS.absorb,
    format: 'value',
    enhancementAspect: 'heal',
    priority: 15,
  },
  specialBuff: {
    label: '+Special',
    category: 'buff',
    colorClass: STAT_COLORS.tohit,
    format: 'percent',
    expandByType: true,
    priority: 20,
  },

  // === MOVEMENT (all teal) ===
  fly: {
    label: 'Fly',
    category: 'movement',
    colorClass: STAT_COLORS.fly,
    format: 'value',
    enhancementAspect: 'fly',
    priority: 1,
  },
  flySpeed: {
    label: 'Fly Speed',
    category: 'movement',
    colorClass: STAT_COLORS.flySpeed,
    format: 'value',
    enhancementAspect: 'fly',
    priority: 1,
  },
  runSpeed: {
    label: 'Run Speed',
    category: 'movement',
    colorClass: STAT_COLORS.runSpeed,
    format: 'value',
    enhancementAspect: 'runSpeed',
    priority: 2,
  },
  jumpSpeed: {
    label: 'Jump Speed',
    category: 'movement',
    colorClass: STAT_COLORS.jumpSpeed,
    format: 'value',
    enhancementAspect: 'jumpSpeed',
    priority: 3,
  },
  jumpHeight: {
    label: 'Jump Height',
    category: 'movement',
    colorClass: STAT_COLORS.jumpHeight,
    format: 'value',
    enhancementAspect: 'jumpHeight',
    priority: 4,
  },
  teleport: {
    label: 'Teleport',
    category: 'movement',
    colorClass: STAT_COLORS.teleport,
    format: 'value',
    priority: 5,
  },
  untouchable: {
    label: 'Intangible',
    category: 'movement',
    colorClass: STAT_COLORS.untouchable,
    format: 'duration',
    priority: 6,
  },

  // === SPECIAL ===
  summon: {
    label: 'Summon',
    category: 'special',
    colorClass: STAT_COLORS.summon,
    format: 'custom',
    priority: 1,
  },
  healing: {
    label: 'Heal',
    category: 'execution',
    colorClass: STAT_COLORS.healing,
    format: 'value',
    enhancementAspect: 'heal',
    priority: 2,
  },

  // === ARMOR & PROTECTION ===
  defense: {
    label: 'Def',
    category: 'protection',
    colorClass: STAT_COLORS.defense,
    format: 'percent',
    enhancementAspect: 'defense',
    expandByType: true,
    priority: 1,
  },
  resistance: {
    label: 'Res',
    category: 'protection',
    colorClass: STAT_COLORS.resistance,
    format: 'percent',
    enhancementAspect: 'resistance',
    expandByType: true,
    priority: 2,
  },
  elusivity: {
    label: 'DDR',
    category: 'protection',
    colorClass: STAT_COLORS.elusivity,
    format: 'percent',
    expandByType: true,
    priority: 3,
  },
  protection: {
    label: 'Prot',
    category: 'protection',
    colorClass: STAT_COLORS.protection,
    format: 'mag',
    expandByType: true,
    priority: 4,
  },
  debuffResistance: {
    label: 'Debuff Res',
    category: 'protection',
    colorClass: STAT_COLORS.debuffResistance,
    format: 'percent',
    canBeByType: true,
    expandByType: true,
    priority: 5,
  },
};

// ============================================
// CATEGORY DISPLAY CONFIG
// ============================================

export interface CategoryDisplayConfig {
  label: string;
  colorClass: string;
  priority: number;
}

export const CATEGORY_CONFIG: Record<EffectCategory, CategoryDisplayConfig> = {
  execution: { label: 'Power Stats', colorClass: 'text-slate-400', priority: 0 },
  damage: { label: 'Damage', colorClass: 'text-red-500', priority: 1 },
  control: { label: 'Control', colorClass: 'text-purple-500', priority: 2 },
  debuff: { label: 'Debuffs', colorClass: 'text-yellow-500', priority: 3 },
  buff: { label: 'Buffs', colorClass: 'text-green-500', priority: 4 },
  protection: { label: 'Protection', colorClass: 'text-orange-500', priority: 5 },
  movement: { label: 'Movement', colorClass: 'text-cyan-500', priority: 6 },
  special: { label: 'Special', colorClass: 'text-amber-500', priority: 7 },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if a value is a "by type" object (e.g., defense by damage type)
 */
export function isByTypeObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const keys = Object.keys(value);
  const typeKeys = [
    'smashing', 'lethal', 'fire', 'cold', 'energy', 'negative', 'psionic', 'toxic',
    'melee', 'ranged', 'aoe', 'all', 'run', 'fly', 'jump',
    // Debuff resistance stat types
    'defense', 'endurance', 'tohit', 'movement', 'regeneration', 'recovery', 'recharge', 'range', 'perception',
    // Resistance subtypes
    'heal',
    // Mez types (for specialDebuff/specialBuff)
    'hold', 'stun', 'immobilize', 'sleep', 'confuse', 'fear', 'knockback', 'knockup', 'repel',
  ];
  return keys.some(k => typeKeys.includes(k.toLowerCase()));
}

/**
 * Check if a value is a MezEffect object
 */
export function isMezEffect(value: unknown): value is MezEffect {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return 'mag' in obj && typeof obj.mag === 'number';
}

/**
 * Format a mez effect for display
 */
export function formatMezValue(value: NumberOrMez): string {
  if (typeof value === 'number') {
    return `Mag ${value}`;
  }
  if (isMezEffect(value)) {
    const mag = value.mag;
    const duration = value.scale ? `${value.scale.toFixed(1)}s` : '';
    return duration ? `Mag ${mag} (${duration})` : `Mag ${mag}`;
  }
  return String(value);
}

/**
 * Calculate effect value based on config
 */
export function calculateEffectValue(
  value: NumberOrScaled,
  config: EffectDisplayConfig,
  archetypeId?: ArchetypeId
): number {
  if (config.calculation === 'buff' || config.calculation === 'debuff') {
    // Use AT table directly when available (accurate per-AT values)
    if (archetypeId && typeof value === 'object' && value !== null && 'table' in value && 'scale' in value) {
      const tableVal = getTableValue(archetypeId, (value as { scale: number; table: string }).table, 50);
      if (tableVal !== undefined) {
        return Math.abs((value as { scale: number; table: string }).scale * tableVal);
      }
    }
    // Fallback to legacy formula for plain number scales
    return calculateBuffDebuffValue(value, archetypeId, config.calculation);
  }
  return getScaleValue(value) ?? 0;
}

/**
 * Format effect value for display
 */
export function formatEffectValue(
  value: number,
  format: EffectFormat
): string {
  switch (format) {
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'duration':
      return `${value.toFixed(1)}s`;
    case 'mag':
      return `Mag ${value}`;
    case 'scale':
      return `${value.toFixed(2)} scale`;
    case 'degrees':
      return `${Math.round(value)}°`;
    case 'value':
    default:
      return value.toFixed(1);
  }
}

/**
 * Get the first value from a by-type object
 */
export function getByTypeFirstValue(obj: Record<string, unknown>): NumberOrScaled | undefined {
  const values = Object.values(obj);
  if (values.length === 0) return undefined;
  const first = values[0];
  if (typeof first === 'number') return first;
  if (typeof first === 'object' && first !== null && 'scale' in first) {
    return first as NumberOrScaled;
  }
  return undefined;
}

/**
 * Get type abbreviations from a by-type object
 */
export function getByTypeAbbreviations(obj: Record<string, unknown>): string {
  const typeAbbrev: Record<string, string> = {
    smashing: 'S', lethal: 'L', fire: 'F', cold: 'C',
    energy: 'E', negative: 'N', psionic: 'P', toxic: 'T',
    melee: 'Mel', ranged: 'Rng', aoe: 'AoE',
    run: 'Run', fly: 'Fly', jump: 'Jmp',
  };
  const allDamageTypes = ['smashing', 'lethal', 'fire', 'cold', 'energy', 'negative', 'psionic', 'toxic'];
  const keys = Object.keys(obj).map(k => k.toLowerCase());
  if (allDamageTypes.every(t => keys.includes(t))) return 'All';
  return keys
    .map(k => typeAbbrev[k] || k.charAt(0).toUpperCase())
    .join('');
}

// ============================================
// EFFECT GROUPING
// ============================================

export interface GroupedEffect {
  key: string;
  value: unknown;
  config: EffectDisplayConfig;
}

export interface GroupedEffects {
  category: EffectCategory;
  categoryConfig: CategoryDisplayConfig;
  effects: GroupedEffect[];
}

/**
 * Group effects by category for organized display
 */
export function groupEffectsByCategory(
  effects: Record<string, unknown>
): GroupedEffects[] {
  const groups: Map<EffectCategory, GroupedEffect[]> = new Map();

  for (const [key, value] of Object.entries(effects)) {
    // Skip null/undefined values
    if (value == null) continue;

    // Skip non-effect properties (stats, flags, etc.)
    const config = EFFECT_REGISTRY[key];
    if (!config) continue;

    const category = config.category;
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category)!.push({ key, value, config });
  }

  // Sort effects within each group by priority
  for (const effectList of groups.values()) {
    effectList.sort((a, b) => (a.config.priority ?? 99) - (b.config.priority ?? 99));
  }

  // Convert to array and sort by category priority
  const result: GroupedEffects[] = [];
  for (const [category, effects] of groups) {
    result.push({
      category,
      categoryConfig: CATEGORY_CONFIG[category],
      effects,
    });
  }
  result.sort((a, b) => a.categoryConfig.priority - b.categoryConfig.priority);

  return result;
}

/**
 * Get all effects that have registry entries (for validation/debugging)
 */
export function getRegisteredEffectKeys(): string[] {
  return Object.keys(EFFECT_REGISTRY);
}

/**
 * Check if an effect key is registered
 */
export function isRegisteredEffect(key: string): boolean {
  return key in EFFECT_REGISTRY;
}
