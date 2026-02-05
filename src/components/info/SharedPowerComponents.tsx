/**
 * Shared React components for power display.
 * Used by both PowerInfoTooltip (compact) and InfoPanel (expanded).
 */

import type { DefenseByType, ResistanceByType, ProtectionEffects, PowerEffects, NumberOrScaled } from '@/types';
import { getScaleValue } from '@/types';
import { formatPercent, calculateBuffDebuffValue } from './powerDisplayUtils';
import type { PowerDamageResult } from '@/utils/calculations';
import {
  EFFECT_REGISTRY,
  CATEGORY_CONFIG,
  groupEffectsByCategory,
  isMezEffect,
  isByTypeObject,
  getByTypeAbbreviations,
  getByTypeFirstValue,
  type EffectCategory,
  type EffectDisplayConfig,
  type GroupedEffect,
} from '@/data/effect-registry';

// ============================================
// THREE-TIER DISPLAY COMPONENTS
// ============================================

interface ThreeTierHeaderProps {
  /** Use compact sizing for tooltips */
  compact?: boolean;
}

/**
 * Header row for three-tier stat display (Base/Enhanced/Final)
 */
export function ThreeTierHeader({ compact = false }: ThreeTierHeaderProps) {
  const gridCols = compact
    ? 'grid-cols-[4rem_1fr_1fr_1fr]'
    : 'grid-cols-[5rem_1fr_1fr_1fr]';
  const fontSize = compact ? 'text-[8px]' : 'text-[9px]';

  return (
    <div className={`grid ${gridCols} gap-1 ${fontSize} text-slate-500 uppercase mb-0.5 border-b border-slate-700 pb-0.5`}>
      <span>Stat</span>
      <span>Base</span>
      <span>{compact ? 'Enh' : 'Enhanced'}</span>
      <span>Final</span>
    </div>
  );
}

interface ThreeTierStatRowProps {
  label: string;
  base: number;
  enhanced: number;
  final: number;
  format?: 'number' | 'percent' | 'seconds' | 'feet';
  colorClass?: string;
  /** Use compact sizing for tooltips */
  compact?: boolean;
}

/**
 * Single row in a three-tier stat display
 */
export function ThreeTierStatRow({
  label,
  base,
  enhanced,
  final,
  format = 'number',
  colorClass = 'text-slate-200',
  compact = false,
}: ThreeTierStatRowProps) {
  const formatValue = (v: number) => {
    switch (format) {
      case 'percent':
        return `${(v * 100).toFixed(1)}%`;
      case 'seconds':
        return compact ? `${v.toFixed(1)}s` : `${v.toFixed(2)}s`;
      case 'feet':
        return `${v.toFixed(0)}ft`;
      default:
        return v.toFixed(2);
    }
  };

  const hasEnhancement = Math.abs(enhanced - base) > 0.001;
  const hasGlobal = Math.abs(final - enhanced) > 0.001;

  const gridCols = compact
    ? 'grid-cols-[4rem_1fr_1fr_1fr]'
    : 'grid-cols-[5rem_1fr_1fr_1fr]';
  const fontSize = compact ? 'text-[10px]' : 'text-xs';

  return (
    <div className={`grid ${gridCols} gap-1 items-baseline ${fontSize}`}>
      <span className={colorClass}>{label}</span>
      <span className={colorClass}>{formatValue(base)}</span>
      <span className={hasEnhancement ? 'text-green-400' : 'text-slate-600'}>
        {hasEnhancement ? (compact ? `→ ${formatValue(enhanced)}` : formatValue(enhanced)) : '—'}
      </span>
      <span className={hasGlobal ? 'text-amber-400' : 'text-slate-600'}>
        {hasGlobal ? (compact ? `→ ${formatValue(final)}` : formatValue(final)) : '—'}
      </span>
    </div>
  );
}

// ============================================
// DEFENSE/RESISTANCE DISPLAY COMPONENTS
// ============================================

interface DefenseResistanceDisplayProps {
  label: string;
  values: DefenseByType | ResistanceByType;
  colorClass: string;
  /** Use compact sizing for tooltips */
  compact?: boolean;
}

/**
 * Display defense or resistance values by type
 */
export function DefenseResistanceDisplay({
  label,
  values,
  colorClass,
  compact = false,
}: DefenseResistanceDisplayProps) {
  const entries = Object.entries(values).filter(([, v]) => v !== undefined && v !== 0);
  if (entries.length === 0) return null;

  const fontSize = compact ? 'text-[9px]' : 'text-[10px]';
  const labelFontSize = compact ? 'text-[9px]' : 'text-[10px]';

  return (
    <div className="mt-1">
      <span className={`text-slate-400 ${labelFontSize} uppercase`}>{label}</span>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-0.5">
        {entries.map(([type, value]) => (
          <div key={type} className="flex justify-between">
            <span className={`text-slate-500 capitalize ${fontSize}`}>{type}</span>
            <span className={`${colorClass} ${fontSize}`}>{formatPercent(value as number)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DefenseResistanceThreeTierProps {
  label: string;
  values: DefenseByType | ResistanceByType;
  enhancementBonus: number;
  colorClass: string;
}

/**
 * Defense/Resistance with three-tier display (Base/Enhanced/Final)
 */
export function DefenseResistanceThreeTier({
  label,
  values,
  enhancementBonus,
  colorClass,
}: DefenseResistanceThreeTierProps) {
  const entries = Object.entries(values).filter(([, v]) => v !== undefined && v !== 0);
  if (entries.length === 0) return null;

  const hasEnhancement = enhancementBonus > 0.001;

  return (
    <div className="bg-slate-800/50 rounded p-1.5 mt-1">
      <div className="grid grid-cols-[3.5rem_1fr_1fr_1fr] gap-1 text-[8px] text-slate-500 uppercase mb-0.5 border-b border-slate-700 pb-0.5">
        <span>{label}</span>
        <span>Base</span>
        <span>Enhanced</span>
        <span>Final</span>
      </div>
      {entries.map(([type, baseValue]) => {
        const base = baseValue as number;
        // Defense and Resistance are multiplicative with enhancements
        const enhanced = base * (1 + enhancementBonus);
        const hasEnh = Math.abs(enhanced - base) > 0.001;

        return (
          <div key={type} className="grid grid-cols-[3.5rem_1fr_1fr_1fr] gap-1 items-baseline text-[10px]">
            <span className="text-slate-400 capitalize text-[9px]">{type}</span>
            <span className={colorClass}>{formatPercent(base)}</span>
            <span className={hasEnh ? 'text-green-400' : 'text-slate-600'}>
              {hasEnh ? `→ ${formatPercent(enhanced)}` : '—'}
            </span>
            <span className="text-slate-600">—</span>
          </div>
        );
      })}
      {hasEnhancement && (
        <div className="text-[8px] text-green-500/70 mt-0.5">
          +{(enhancementBonus * 100).toFixed(1)}% from enhancements
        </div>
      )}
    </div>
  );
}

// ============================================
// PROTECTION DISPLAY COMPONENTS
// ============================================

interface ProtectionDisplayProps {
  protection: ProtectionEffects;
  /** Use compact sizing for tooltips */
  compact?: boolean;
}

/**
 * Display mez protection values
 */
export function ProtectionDisplay({ protection, compact = false }: ProtectionDisplayProps) {
  const entries = Object.entries(protection).filter(([, v]) => v !== undefined && v !== 0);
  if (entries.length === 0) return null;

  const fontSize = compact ? 'text-[9px]' : 'text-[10px]';

  return (
    <div className="mt-1">
      <span className={`text-slate-400 ${fontSize} uppercase`}>Mez Protection</span>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0 mt-0.5">
        {entries.map(([type, value]) => (
          <div key={type} className="flex justify-between">
            <span className={`text-slate-500 capitalize ${fontSize}`}>{type}</span>
            <span className={`text-purple-400 ${fontSize}`}>Mag {(value as number).toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// DAMAGE DISPLAY COMPONENTS
// ============================================

interface DamageThreeTierHeaderProps {
  finalColumnHeader?: string;
  compact?: boolean;
}

/**
 * Header for damage three-tier display with custom final column
 */
export function DamageThreeTierHeader({
  finalColumnHeader = 'Final',
  compact = false,
}: DamageThreeTierHeaderProps) {
  const fontSize = compact ? 'text-[8px]' : 'text-[9px]';
  const gridCols = compact
    ? 'grid-cols-[3rem_1fr_1fr_1fr]'
    : 'grid-cols-[4rem_1fr_1fr_1fr]';

  return (
    <div className={`grid ${gridCols} gap-1 ${fontSize} text-slate-500 uppercase mb-0.5 border-b border-slate-700 pb-0.5`}>
      <span>Type</span>
      <span>Base</span>
      <span>Enhanced</span>
      <span>{finalColumnHeader}</span>
    </div>
  );
}

interface DamageRowProps {
  type: string;
  base: number;
  enhanced: number;
  final: number;
  typeColorClass?: string;
  finalColorClass?: string;
  compact?: boolean;
  dimmed?: boolean;
}

/**
 * Single row in damage display
 */
export function DamageRow({
  type,
  base,
  enhanced,
  final,
  typeColorClass = 'text-red-400',
  finalColorClass = 'text-amber-400',
  compact = false,
  dimmed = false,
}: DamageRowProps) {
  const hasEnh = Math.abs(enhanced - base) > 0.001;
  const hasGlobal = Math.abs(final - enhanced) > 0.001;

  const gridCols = compact
    ? 'grid-cols-[3rem_1fr_1fr_1fr]'
    : 'grid-cols-[4rem_1fr_1fr_1fr]';
  const fontSize = compact ? 'text-[10px]' : 'text-xs';

  return (
    <div className={`grid ${gridCols} gap-1 items-baseline ${fontSize} ${dimmed ? 'opacity-40' : ''}`}>
      <span className={dimmed ? 'text-slate-500' : typeColorClass}>{type}</span>
      <span className={dimmed ? 'text-slate-500' : 'text-slate-200'}>{base.toFixed(1)}</span>
      <span className={dimmed ? 'text-slate-600' : (hasEnh ? 'text-green-400' : 'text-slate-600')}>
        {hasEnh ? `→ ${enhanced.toFixed(1)}` : '—'}
      </span>
      <span className={dimmed ? 'text-slate-600' : (hasGlobal ? finalColorClass : 'text-slate-600')}>
        {hasGlobal ? `→ ${final.toFixed(1)}` : '—'}
      </span>
    </div>
  );
}

// ============================================
// REGISTRY-DRIVEN EFFECTS DISPLAY
// ============================================

interface RegistryEffectsDisplayProps {
  effects: PowerEffects;
  /** Allowed enhancement types for this power */
  allowedEnhancements?: string[];
  /** Enhancement bonuses by aspect */
  enhancementBonuses?: Record<string, number | undefined>;
  /** Global bonuses by aspect */
  globalBonuses?: Record<string, number | undefined>;
  /** Buff/debuff modifier from archetype */
  buffDebuffMod?: number;
  /** Categories to include (default: execution, buff, debuff) */
  categories?: EffectCategory[];
  /** Use compact sizing for tooltips */
  compact?: boolean;
  /** Whether Domination is active */
  dominationActive?: boolean;
  /** Optional header text (shown above the table) */
  header?: string;
  /** Optional duration to show in header */
  duration?: number;
  /** Calculated damage data (optional) */
  damage?: PowerDamageResult | null;
  /** DoT info from power definition */
  dotInfo?: { duration: number; tickRate?: number };
  /** Custom final column header (e.g., "w/ Scourge", "w/ Fury") */
  finalColumnHeader?: string;
  /** Color class for final column values (e.g., "text-cyan-400" for Scourge) */
  finalColumnColor?: string;
  /** Function to apply inherent bonus to damage values */
  applyInherentBonus?: (value: number) => number;
}

interface ThreeTierValues {
  base: number;
  enhanced: number;
  final: number;
}

/**
 * Calculate three-tier values for an effect
 */
function calcEffectThreeTier(
  config: EffectDisplayConfig,
  baseValue: number,
  enhancementBonuses: Record<string, number | undefined>,
  globalBonuses: Record<string, number | undefined>
): ThreeTierValues {
  const aspect = config.enhancementAspect;
  const enhBonus = aspect ? (enhancementBonuses[aspect] || 0) : 0;
  const globalBonus = aspect ? (globalBonuses[aspect] || 0) : 0;

  // For recharge/endurance, reduction means lower is better
  const isReduction = aspect === 'endurance' || aspect === 'recharge';

  let enhanced: number;
  let final: number;

  if (isReduction) {
    // Reduction: base / (1 + bonus)
    enhanced = baseValue / (1 + enhBonus);
    final = enhanced / (1 + globalBonus);
  } else {
    // Standard: base * (1 + bonus)
    enhanced = baseValue * (1 + enhBonus);
    final = enhanced * (1 + globalBonus);
  }

  return { base: baseValue, enhanced, final };
}

/**
 * Get the base value from an effect, handling different value types
 */
function getEffectBaseValue(
  value: unknown,
  config: EffectDisplayConfig,
  buffDebuffMod: number
): number | null {
  // Handle by-type objects - get first value
  if (config.canBeByType && isByTypeObject(value)) {
    const firstVal = getByTypeFirstValue(value as Record<string, unknown>);
    if (!firstVal) return null;
    value = firstVal;
  }

  // Handle mez effects (magnitude)
  if (config.format === 'mag') {
    if (typeof value === 'number') return value;
    if (isMezEffect(value)) return value.mag;
    return null;
  }

  // Handle buff/debuff calculation - returns decimal, multiply by 100 for percent display
  if (config.calculation === 'buff' || config.calculation === 'debuff') {
    const result = calculateBuffDebuffValue(value as NumberOrScaled, buffDebuffMod, config.calculation);
    // Buff/debuff values are displayed as percentages, so multiply by 100
    return result * 100;
  }

  // Handle scaled values
  const scaled = getScaleValue(value as NumberOrScaled);
  if (scaled === undefined) return null;

  // For percent format, multiply by baseMultiplier (default 100)
  // Accuracy uses 75 (base to-hit rate), other percents use 100
  if (config.format === 'percent') {
    const multiplier = config.baseMultiplier ?? 100;
    return scaled * multiplier * buffDebuffMod;
  }

  return scaled;
}


/**
 * Registry-driven power effects display using three-tier table format.
 * Replaces hardcoded effect checks with registry-based rendering.
 */
export function RegistryEffectsDisplay({
  effects,
  allowedEnhancements = [],
  enhancementBonuses = {},
  globalBonuses = {},
  buffDebuffMod = 1.0,
  categories = ['execution', 'buff', 'debuff'],
  compact = false,
  dominationActive = false,
  header,
  duration,
  damage,
  dotInfo,
  finalColumnHeader = 'Final',
  finalColumnColor = 'text-amber-400',
  applyInherentBonus,
}: RegistryEffectsDisplayProps) {
  const allowedSet = new Set(allowedEnhancements);

  // Map enhancement type names to registry aspect names
  const enhancementToAspect: Record<string, string> = {
    'EnduranceReduction': 'endurance',
    'Recharge': 'recharge',
    'Accuracy': 'accuracy',
    'Range': 'range',
  };

  // Check if an execution effect should be shown (must be allowed enhancement)
  const shouldShowExecutionEffect = (_key: string, config: EffectDisplayConfig): boolean => {
    if (config.category !== 'execution') return true;

    // Find the enhancement type that enables this effect
    const enhType = Object.entries(enhancementToAspect).find(([, aspect]) => aspect === config.enhancementAspect)?.[0];
    if (!enhType) return true; // Non-enhanceable execution stats (castTime, radius, etc.)

    return allowedSet.has(enhType);
  };

  // Group effects by category
  const groupedEffects = groupEffectsByCategory(effects as Record<string, unknown>);

  // Filter to requested categories
  const filteredGroups = groupedEffects.filter(g => categories.includes(g.category));

  // Collect all displayable effects
  const displayableEffects: Array<{
    effect: GroupedEffect;
    baseValue: number;
    tiers: ThreeTierValues;
    byTypeLabel?: string;
  }> = [];

  for (const group of filteredGroups) {
    for (const effect of group.effects) {
      const { key, value, config } = effect;

      // Check if this effect should be shown
      if (!shouldShowExecutionEffect(key, config)) continue;

      // Skip healing (handled separately with scale display)
      if (key === 'healing') continue;

      // Skip damageBuff (handled by Defiance section for Blasters)
      if (key === 'damageBuff') continue;

      // Get base value
      const baseValue = getEffectBaseValue(value, config, buffDebuffMod);
      if (baseValue === null || baseValue === 0) continue;

      // Special handling for range (skip if 0 or negative)
      if (key === 'range' && baseValue <= 0) continue;

      // Calculate three-tier values
      const tiers = calcEffectThreeTier(config, baseValue, enhancementBonuses, globalBonuses);

      // Get by-type label if applicable
      let byTypeLabel: string | undefined;
      if (config.canBeByType && isByTypeObject(value)) {
        byTypeLabel = getByTypeAbbreviations(value as Record<string, unknown>);
      }

      displayableEffects.push({ effect, baseValue, tiers, byTypeLabel });
    }
  }

  // Handle healing separately (needs scale-based display)
  const healing = effects?.healing;
  if (healing && typeof healing === 'object' && 'scale' in healing && healing.scale != null) {
    const healConfig = EFFECT_REGISTRY['healing'];
    if (healConfig && categories.includes(healConfig.category as EffectCategory)) {
      const tiers = calcEffectThreeTier(healConfig, healing.scale, enhancementBonuses, globalBonuses);
      displayableEffects.push({
        effect: { key: 'healing', value: healing, config: healConfig },
        baseValue: healing.scale,
        tiers,
      });
    }
  }

  // Return null only if no effects AND no damage to display
  if (displayableEffects.length === 0 && !damage) return null;

  // Sort by category priority, then by effect priority
  displayableEffects.sort((a, b) => {
    const catA = CATEGORY_CONFIG[a.effect.config.category]?.priority ?? 99;
    const catB = CATEGORY_CONFIG[b.effect.config.category]?.priority ?? 99;
    if (catA !== catB) return catA - catB;
    return (a.effect.config.priority ?? 99) - (b.effect.config.priority ?? 99);
  });

  const gridCols = compact
    ? 'grid-cols-[4rem_1fr_1fr_1fr]'
    : 'grid-cols-[5rem_1fr_1fr_1fr]';
  const fontSize = compact ? 'text-[10px]' : 'text-xs';
  const headerFontSize = compact ? 'text-[8px]' : 'text-[9px]';

  return (
    <div>
      {/* Section header if provided */}
      {header && (
        <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
          {header} {duration && <span className="text-slate-600 font-normal">({duration.toFixed(1)}s)</span>}
        </h4>
      )}
      <div className="bg-slate-800/50 rounded p-2">
        {/* Table header */}
        <div className={`grid ${gridCols} gap-1 ${headerFontSize} text-slate-500 uppercase mb-0.5 border-b border-slate-700 pb-0.5`}>
          <span>Stat</span>
          <span>Base</span>
          <span>{compact ? 'Enh' : 'Enhanced'}</span>
          <span>{finalColumnHeader}</span>
        </div>

        {/* Damage row(s) - rendered first */}
        {damage && (() => {
          const hasEnh = Math.abs(damage.enhanced - damage.base) > 0.001;
          const finalDamage = applyInherentBonus ? applyInherentBonus(damage.final) : damage.final;
          const hasFinal = Math.abs(finalDamage - damage.enhanced) > 0.001;

          return (
            <>
              <div className={`grid ${gridCols} gap-1 items-baseline ${fontSize}`}>
                <span className="text-red-400">{damage.type}</span>
                <span className="text-slate-200">{damage.base.toFixed(2)}</span>
                <span className={hasEnh ? 'text-green-400' : 'text-slate-600'}>
                  {hasEnh ? (compact ? `→ ${damage.enhanced.toFixed(2)}` : damage.enhanced.toFixed(2)) : '—'}
                </span>
                <span className={hasFinal ? finalColumnColor : 'text-slate-600'}>
                  {hasFinal ? (compact ? `→ ${finalDamage.toFixed(2)}` : finalDamage.toFixed(2)) : '—'}
                </span>
              </div>
              {/* DoT indicator */}
              {dotInfo && dotInfo.duration > 0 && (
                <div className={`${compact ? 'text-[8px]' : 'text-[9px]'} text-orange-400 italic mt-0.5 ml-1`}>
                  DoT: {dotInfo.duration}s{dotInfo.tickRate ? `, ${dotInfo.tickRate}s ticks` : ''}
                </div>
              )}
              {/* Unknown damage indicator */}
              {damage.unknown && (
                <div className={`${compact ? 'text-[8px]' : 'text-[9px]'} text-slate-500 italic mt-0.5 ml-1`}>
                  * Actual damage varies
                </div>
              )}
            </>
          );
        })()}

      {/* Effects */}
      {displayableEffects.map(({ effect, tiers, byTypeLabel }) => {
        const { key, config } = effect;
        const hasEnh = Math.abs(tiers.enhanced - tiers.base) > 0.001;
        const hasFinal = Math.abs(tiers.final - tiers.enhanced) > 0.001;

        // Build label
        let label = config.label;
        if (byTypeLabel) {
          label = `${config.label} (${byTypeLabel})`;
        }

        // Handle mez effects (magnitude format)
        if (config.format === 'mag') {
          const mag = dominationActive && config.category === 'control' ? tiers.base * 2 : tiers.base;
          const colorClass = dominationActive && config.category === 'control' ? 'text-pink-400' : config.colorClass;

          return (
            <div key={key} className={`grid ${gridCols} gap-1 items-baseline ${fontSize}`}>
              <span className={colorClass}>{label}</span>
              <span className={colorClass}>
                Mag {mag}
                {dominationActive && config.category === 'control' && (
                  <span className="text-pink-300 text-[8px] ml-1">[2×]</span>
                )}
              </span>
              <span className="text-slate-600">—</span>
              <span className="text-slate-600">—</span>
            </div>
          );
        }

        // Standard three-tier row
        const formatValue = (v: number) => {
          switch (config.format) {
            case 'percent':
              return `${(v).toFixed(1)}%`;
            case 'duration':
              return compact ? `${v.toFixed(1)}s` : `${v.toFixed(2)}s`;
            case 'value':
              if (config.label === 'Range' || config.label === 'Radius') return `${v.toFixed(0)}ft`;
              return v.toFixed(2);
            default:
              return v.toFixed(2);
          }
        };

        return (
          <div key={key} className={`grid ${gridCols} gap-1 items-baseline ${fontSize}`}>
            <span className={config.colorClass}>{label}</span>
            <span className={config.colorClass}>{formatValue(tiers.base)}</span>
            <span className={hasEnh ? 'text-green-400' : 'text-slate-600'}>
              {hasEnh ? (compact ? `→ ${formatValue(tiers.enhanced)}` : formatValue(tiers.enhanced)) : '—'}
            </span>
            <span className={hasFinal ? 'text-amber-400' : 'text-slate-600'}>
              {hasFinal ? (compact ? `→ ${formatValue(tiers.final)}` : formatValue(tiers.final)) : '—'}
            </span>
          </div>
        );
      })}
      </div>
    </div>
  );
}
