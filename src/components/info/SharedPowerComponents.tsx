/**
 * Shared React components for power display.
 * Used by both PowerInfoTooltip (compact) and InfoPanel (expanded).
 */

import { useState } from 'react';
import type { PowerEffects, NumberOrScaled } from '@/types';
import { getScaleValue } from '@/types';
import {
  calculateBuffDebuffValue,
  calculateResistancePercent,
  calcThreeTier,
  expandByTypeEntries,
  expandProtectionEntries,
} from './powerDisplayUtils';
import type { ThreeTierValues } from './powerDisplayUtils';
import { abbreviateDamageType, type PowerDamageResult } from '@/utils/calculations';
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
import { getTableValue } from '@/data/at-tables';

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
  /** Whether this stat can be enhanced. When true, always shows values; when false, shows "—" for Enhanced/Final */
  enhanceable?: boolean;
}

/**
 * Single row in a three-tier stat display.
 * Enhanceable stats always show values in all three columns (even when identical).
 * Non-enhanceable stats show "—" for Enhanced and Final.
 */
export function ThreeTierStatRow({
  label,
  base,
  enhanced,
  final,
  format = 'number',
  colorClass = 'text-slate-200',
  compact = false,
  enhanceable = true,
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
      <span className="text-slate-200">{formatValue(base)}</span>
      {enhanceable ? (
        <span className={hasEnhancement ? 'text-green-400' : 'text-slate-400'}>
          {formatValue(enhanced)}
        </span>
      ) : (
        <span className="text-slate-600">—</span>
      )}
      {enhanceable ? (
        <span className={hasGlobal ? 'text-amber-400' : 'text-slate-400'}>
          {formatValue(final)}
        </span>
      ) : (
        <span className="text-slate-600">—</span>
      )}
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
 * Single row in damage display.
 * Damage is always enhanceable — always shows values in all three columns.
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
      <span className={dimmed ? 'text-slate-600' : (hasEnh ? 'text-green-400' : 'text-slate-400')}>
        {enhanced.toFixed(1)}
      </span>
      <span className={dimmed ? 'text-slate-600' : (hasGlobal ? finalColorClass : 'text-slate-400')}>
        {final.toFixed(1)}
      </span>
    </div>
  );
}

// ============================================
// COLLAPSIBLE EFFECT GROUP
// ============================================

/** Minimum number of expanded entries to trigger collapsible behavior */
const COLLAPSE_THRESHOLD = 4;

interface DisplayableEffect {
  effect: GroupedEffect;
  baseValue: number;
  tiers: ThreeTierValues;
  byTypeLabel?: string;
  expandedLabel?: string;
}

/** A group of effects that share the same base config from expandByType */
type EffectGroup = {
  type: 'single';
  item: DisplayableEffect;
} | {
  type: 'group';
  label: string;
  colorClass: string;
  items: DisplayableEffect[];
}

/** Collapsible wrapper for a group of expanded effects (e.g., 7 debuff resistance types) */
function CollapsibleEffectGroup({
  label,
  colorClass,
  items,
  gridCols,
  fontSize,
  compact,
  dominationActive,
  finalColumnColor,
}: {
  label: string;
  colorClass: string;
  items: DisplayableEffect[];
  gridCols: string;
  fontSize: string;
  compact: boolean;
  dominationActive: boolean;
  finalColumnColor: string;
}) {
  const [collapsed, setCollapsed] = useState(true);

  // Check if all values are the same for a compact summary
  const allSameBase = items.every(i => Math.abs(i.tiers.base - items[0].tiers.base) < 0.01);
  const summaryValue = allSameBase ? items[0].tiers.base : null;

  const formatValue = (v: number, config: EffectDisplayConfig) => {
    switch (config.format) {
      case 'percent':
        return `${v.toFixed(1)}%`;
      case 'duration':
        return compact ? `${v.toFixed(1)}s` : `${v.toFixed(2)}s`;
      case 'value':
        if (config.label === 'Range' || config.label === 'Radius') return `${v.toFixed(0)}ft`;
        return v.toFixed(2);
      default:
        return v.toFixed(2);
    }
  };

  // For mixed values, show min-max range
  const minBase = Math.min(...items.map(i => i.tiers.base));
  const maxBase = Math.max(...items.map(i => i.tiers.base));

  return (
    <>
      {/* Clickable summary row */}
      <div
        className={`grid ${gridCols} gap-1 items-baseline ${fontSize} cursor-pointer select-none hover:bg-slate-700/30 -mx-0.5 px-0.5 rounded`}
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className={colorClass}>
          <span className={`inline-block text-[8px] mr-0.5 transition-transform ${collapsed ? '' : 'rotate-90'}`}>▶</span>
          {label} ({items.length})
        </span>
        {summaryValue !== null ? (
          <>
            <span className="text-slate-200">{formatValue(summaryValue, items[0].effect.config)}</span>
            <span className="text-slate-600">—</span>
            <span className="text-slate-600">—</span>
          </>
        ) : (
          <>
            <span className="text-slate-200">{formatValue(minBase, items[0].effect.config)} – {formatValue(maxBase, items[0].effect.config)}</span>
            <span className="text-slate-600">—</span>
            <span className="text-slate-600">—</span>
          </>
        )}
      </div>

      {/* Expanded entries */}
      {!collapsed && items.map(({ effect, tiers, expandedLabel: elabel }) => {
        const { key, value: rawValue, config } = effect;
        const enhanceable = !!config.enhancementAspect;
        const hasEnh = Math.abs(tiers.enhanced - tiers.base) > 0.001;
        const hasFinal = Math.abs(tiers.final - tiers.enhanced) > 0.001;
        const itemLabel = elabel || config.label;

        if (config.format === 'mag') {
          const rawMag = dominationActive && config.category === 'control' ? tiers.base * 2 : tiers.base;
          const magStr = Number.isInteger(rawMag) ? rawMag.toString() : rawMag.toFixed(1);
          const magColorClass = dominationActive && config.category === 'control' ? 'text-pink-400' : config.colorClass;
          const mezDuration = rawValue && typeof rawValue === 'object' && 'scale' in (rawValue as Record<string, unknown>)
            ? (rawValue as { scale?: number }).scale : undefined;
          return (
            <div key={key} className={`grid ${gridCols} gap-1 items-baseline ${fontSize} ml-2`}>
              <span className={magColorClass}>{itemLabel}</span>
              <span className="text-slate-200">
                Mag {magStr}
                {mezDuration != null && mezDuration > 0 && (
                  <span className="text-slate-400 ml-1">({mezDuration.toFixed(1)}s)</span>
                )}
              </span>
              <span className="text-slate-600">—</span>
              <span className="text-slate-600">—</span>
            </div>
          );
        }

        return (
          <div key={key} className={`grid ${gridCols} gap-1 items-baseline ${fontSize} ml-2`}>
            <span className={config.colorClass}>{itemLabel}</span>
            <span className="text-slate-200">{formatValue(tiers.base, config)}</span>
            {enhanceable ? (
              <span className={hasEnh ? 'text-green-400' : 'text-slate-400'}>
                {formatValue(tiers.enhanced, config)}
              </span>
            ) : (
              <span className="text-slate-600">—</span>
            )}
            {enhanceable ? (
              <span className={hasFinal ? finalColumnColor : 'text-slate-400'}>
                {formatValue(tiers.final, config)}
              </span>
            ) : (
              <span className="text-slate-600">—</span>
            )}
          </div>
        );
      })}
    </>
  );
}

/**
 * Group consecutive expanded effects that share the same config into collapsible groups.
 * Effects with expandedLabel from the same config become a group if there are >= COLLAPSE_THRESHOLD entries.
 */
function groupEffectsForDisplay(effects: DisplayableEffect[]): EffectGroup[] {
  const result: EffectGroup[] = [];
  let i = 0;

  while (i < effects.length) {
    const current = effects[i];

    // Check if this starts a group of expanded effects
    if (current.expandedLabel) {
      const config = current.effect.config;
      const groupItems: DisplayableEffect[] = [current];

      // Collect consecutive effects with the same config
      let j = i + 1;
      while (j < effects.length && effects[j].expandedLabel && effects[j].effect.config === config) {
        groupItems.push(effects[j]);
        j++;
      }

      if (groupItems.length >= COLLAPSE_THRESHOLD) {
        result.push({ type: 'group', label: config.label, colorClass: config.colorClass, items: groupItems });
      } else {
        // Too few to collapse, render individually
        for (const item of groupItems) {
          result.push({ type: 'single', item });
        }
      }
      i = j;
    } else {
      result.push({ type: 'single', item: current });
      i++;
    }
  }

  return result;
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
  /** Archetype ID for AT-specific table lookups (resistance, etc.) */
  archetypeId?: string;
  /** Character level for AT-specific table lookups */
  level?: number;
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
  /** Calculated damage data (optional, includes dotDamage for DoT) */
  damage?: PowerDamageResult | null;
  /** Custom final column header (e.g., "w/ Scourge", "w/ Fury") */
  finalColumnHeader?: string;
  /** Color class for final column values (e.g., "text-cyan-400" for Scourge) */
  finalColumnColor?: string;
  /** Function to apply inherent bonus to damage values */
  applyInherentBonus?: (value: number) => number;
}

/**
 * Calculate three-tier values for an effect using its registry config.
 * Delegates to the shared calcThreeTier in powerDisplayUtils.
 */
function calcEffectThreeTier(
  config: EffectDisplayConfig,
  baseValue: number,
  enhancementBonuses: Record<string, number | undefined>,
  globalBonuses: Record<string, number | undefined>
): ThreeTierValues {
  const aspect = config.enhancementAspect;
  if (!aspect) return { base: baseValue, enhanced: baseValue, final: baseValue };
  return calcThreeTier(aspect, baseValue, enhancementBonuses, globalBonuses);
}

/**
 * Get the base value from an effect, handling different value types
 */
function getEffectBaseValue(
  value: unknown,
  config: EffectDisplayConfig,
  buffDebuffMod: number,
  archetypeId?: string
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
    if (isMezEffect(value)) {
      // Mez protection effects use res_boolean tables — calculate from scale × tableValue
      if (archetypeId && value.table.toLowerCase().includes('res_boolean')) {
        const tableVal = getTableValue(archetypeId, value.table, 50);
        if (tableVal !== undefined) return Math.abs(value.scale) * tableVal;
      }
      return value.mag;
    }
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
  archetypeId,
  level,
  categories = ['execution', 'buff', 'debuff'],
  compact = false,
  dominationActive = false,
  header,
  duration,
  damage,
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
  const displayableEffects: DisplayableEffect[] = [];

  for (const group of filteredGroups) {
    for (const effect of group.effects) {
      const { key, value, config } = effect;

      // Check if this effect should be shown
      if (!shouldShowExecutionEffect(key, config)) continue;

      // Skip healing (handled separately with scale display)
      if (key === 'healing') continue;

      // Skip damageBuff (handled by Defiance section for Blasters)
      if (key === 'damageBuff') continue;

      // Handle expandByType effects (defense, resistance, elusivity, protection)
      if (config.expandByType && typeof value === 'object' && value !== null) {
        // Protection: expand mez magnitudes
        if (key === 'protection') {
          const protEntries = expandProtectionEntries(
            value as Record<string, number>,
            config.label
          );
          for (const entry of protEntries) {
            displayableEffects.push({
              effect: { key: `${key}_${entry.typeKey}`, value: entry.magnitude, config },
              baseValue: entry.magnitude,
              tiers: { base: entry.magnitude, enhanced: entry.magnitude, final: entry.magnitude },
              expandedLabel: entry.typeLabel,
            });
          }
          continue;
        }

        // Defense, resistance, elusivity: expand by damage/defense type
        if (isByTypeObject(value)) {
          const byTypeEntries = expandByTypeEntries(
            value as Record<string, unknown>,
            config.label,
            archetypeId,
            level
          );
          for (const entry of byTypeEntries) {
            if (entry.basePercent === 0) continue;
            const tiers = calcEffectThreeTier(config, entry.basePercent, enhancementBonuses, globalBonuses);
            displayableEffects.push({
              effect: { key: `${key}_${entry.typeKey}`, value: entry.basePercent, config },
              baseValue: entry.basePercent,
              tiers,
              expandedLabel: entry.typeLabel,
            });
          }
          continue;
        }

        // Scalar elusivity (not by-type)
        if (key === 'elusivity') {
          const pct = calculateResistancePercent(value as NumberOrScaled, archetypeId, level) * 100;
          if (pct === 0) continue;
          displayableEffects.push({
            effect: { key, value, config },
            baseValue: pct,
            tiers: { base: pct, enhanced: pct, final: pct },
            expandedLabel: 'DDR',
          });
          continue;
        }
      }

      // Get base value
      const baseValue = getEffectBaseValue(value, config, buffDebuffMod, archetypeId);
      if (baseValue === null || baseValue === 0) continue;

      // Special handling for range (skip if 0 or negative)
      if (key === 'range' && baseValue <= 0) continue;

      // Calculate three-tier values
      const tiers = calcEffectThreeTier(config, baseValue, enhancementBonuses, globalBonuses);

      // Get by-type label if applicable (abbreviated summary for buff/debuff by-type)
      let byTypeLabel: string | undefined;
      if (config.canBeByType && isByTypeObject(value)) {
        byTypeLabel = getByTypeAbbreviations(value as Record<string, unknown>);
      }

      displayableEffects.push({ effect, baseValue, tiers, byTypeLabel });
    }
  }

  // Handle healing separately (resolve AT table for actual HP values)
  const healing = effects?.healing;
  if (healing && typeof healing === 'object' && 'scale' in healing && healing.scale != null) {
    const healConfig = EFFECT_REGISTRY['healing'];
    if (healConfig && categories.includes(healConfig.category as EffectCategory)) {
      // Resolve AT table to get actual HP healed instead of raw scale
      let baseHealHP = healing.scale;
      if (healing.table && archetypeId) {
        const tableVal = getTableValue(archetypeId, healing.table, level ?? 50);
        if (tableVal !== undefined) {
          baseHealHP = healing.scale * tableVal;
        }
      }
      const tiers = calcEffectThreeTier(healConfig, baseHealHP, enhancementBonuses, globalBonuses);
      displayableEffects.push({
        effect: { key: 'healing', value: healing, config: healConfig },
        baseValue: baseHealHP,
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

        {/* Damage row(s) - rendered first (damage is always enhanceable) */}
        {damage && (() => {
          const dot = damage.dotDamage;
          const hasDirectDamage = dot ? Math.abs(damage.base - dot.base) > 0.001 : true;
          const isPureDot = dot && !hasDirectDamage;

          const hasEnh = Math.abs(damage.enhanced - damage.base) > 0.001;
          const finalDamage = applyInherentBonus ? applyInherentBonus(damage.final) : damage.final;
          const hasFinal = Math.abs(finalDamage - damage.enhanced) > 0.001;

          // DoT per-tick final (with inherent bonus)
          const dotFinalDamage = dot && applyInherentBonus ? applyInherentBonus(dot.final) : dot?.final ?? 0;

          // DoT totals
          const dotTotalBase = dot ? dot.base * dot.ticks : 0;
          const dotTotalEnhanced = dot ? dot.enhanced * dot.ticks : 0;
          const dotTotalFinal = dot ? dotFinalDamage * dot.ticks : 0;

          return (
            <>
              {/* Direct damage row (or per-tick for pure DoT) */}
              <div className={`grid ${gridCols} gap-1 items-baseline ${fontSize}`}>
                <span className="text-red-400">{isPureDot ? `${abbreviateDamageType(damage.type)}/tick` : abbreviateDamageType(damage.type)}</span>
                <span className="text-slate-200">{damage.base.toFixed(2)}</span>
                <span className={hasEnh ? 'text-green-400' : 'text-slate-400'}>
                  {damage.enhanced.toFixed(2)}
                </span>
                <span className={hasFinal ? finalColumnColor : 'text-slate-400'}>
                  {finalDamage.toFixed(2)}
                </span>
              </div>

              {/* DoT per-tick row (only for mixed direct+DoT) */}
              {dot && hasDirectDamage && (() => {
                const dotHasEnh = Math.abs(dot.enhanced - dot.base) > 0.001;
                const dotHasFinal = Math.abs(dotFinalDamage - dot.enhanced) > 0.001;
                return (
                  <div className={`grid ${gridCols} gap-1 items-baseline ${fontSize}`}>
                    <span className="text-red-400">{abbreviateDamageType(dot.type)}/tick</span>
                    <span className="text-slate-200">{dot.base.toFixed(2)}</span>
                    <span className={dotHasEnh ? 'text-green-400' : 'text-slate-400'}>
                      {dot.enhanced.toFixed(2)}
                    </span>
                    <span className={dotHasFinal ? finalColumnColor : 'text-slate-400'}>
                      {dotFinalDamage.toFixed(2)}
                    </span>
                  </div>
                );
              })()}

              {/* DoT total row */}
              {dot && (() => {
                const hasTotalEnh = Math.abs(dotTotalEnhanced - dotTotalBase) > 0.001;
                const hasTotalFinal = Math.abs(dotTotalFinal - dotTotalEnhanced) > 0.001;
                return (
                  <>
                    <div className={`grid ${gridCols} gap-1 items-baseline ${fontSize}`}>
                      <span className="text-orange-400">DoT</span>
                      <span className="text-slate-200">{dotTotalBase.toFixed(2)}</span>
                      <span className={hasTotalEnh ? 'text-green-400' : 'text-slate-400'}>
                        {dotTotalEnhanced.toFixed(2)}
                      </span>
                      <span className={hasTotalFinal ? finalColumnColor : 'text-slate-400'}>
                        {dotTotalFinal.toFixed(2)}
                      </span>
                    </div>
                    <div className={`${compact ? 'text-[8px]' : 'text-[9px]'} text-orange-400/70 italic mt-0.5 ml-1`}>
                      {dot.ticks} ticks over {dot.duration}s ({dot.tickRate}s/tick)
                    </div>
                  </>
                );
              })()}

              {/* Unknown damage indicator */}
              {damage.unknown && (
                <div className={`${compact ? 'text-[8px]' : 'text-[9px]'} text-slate-500 italic mt-0.5 ml-1`}>
                  * Actual damage varies
                </div>
              )}
            </>
          );
        })()}

      {/* Effects — with collapsible groups for long expanded-by-type lists */}
      {groupEffectsForDisplay(displayableEffects).map((group, groupIdx) => {
        if (group.type === 'group') {
          return (
            <CollapsibleEffectGroup
              key={`group-${groupIdx}`}
              label={group.label}
              colorClass={group.colorClass}
              items={group.items}
              gridCols={gridCols}
              fontSize={fontSize}
              compact={compact}
              dominationActive={dominationActive}
              finalColumnColor={finalColumnColor}
            />
          );
        }

        const { effect, tiers, byTypeLabel, expandedLabel } = group.item;
        const { key, value: rawValue, config } = effect;
        const enhanceable = !!config.enhancementAspect;
        const hasEnh = Math.abs(tiers.enhanced - tiers.base) > 0.001;
        const hasFinal = Math.abs(tiers.final - tiers.enhanced) > 0.001;

        // Build label — expanded label takes precedence
        let label = expandedLabel || config.label;
        if (!expandedLabel && byTypeLabel) {
          label = `${config.label} (${byTypeLabel})`;
        }

        // Handle mez effects (magnitude format) — not enhanceable, show "—"
        if (config.format === 'mag') {
          const rawMag = dominationActive && config.category === 'control' ? tiers.base * 2 : tiers.base;
          const magStr = Number.isInteger(rawMag) ? rawMag.toString() : rawMag.toFixed(1);
          const colorClass = dominationActive && config.category === 'control' ? 'text-pink-400' : config.colorClass;

          // Extract duration from MezEffect if available
          const mezDuration = rawValue && typeof rawValue === 'object' && 'scale' in (rawValue as Record<string, unknown>)
            ? (rawValue as { scale?: number }).scale
            : undefined;

          return (
            <div key={key} className={`grid ${gridCols} gap-1 items-baseline ${fontSize}`}>
              <span className={colorClass}>{label}</span>
              <span className="text-slate-200">
                Mag {magStr}
                {mezDuration != null && mezDuration > 0 && (
                  <span className="text-slate-400 ml-1">({mezDuration.toFixed(1)}s)</span>
                )}
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
            <span className="text-slate-200">{formatValue(tiers.base)}</span>
            {enhanceable ? (
              <span className={hasEnh ? 'text-green-400' : 'text-slate-400'}>
                {formatValue(tiers.enhanced)}
              </span>
            ) : (
              <span className="text-slate-600">—</span>
            )}
            {enhanceable ? (
              <span className={hasFinal ? 'text-amber-400' : 'text-slate-400'}>
                {formatValue(tiers.final)}
              </span>
            ) : (
              <span className="text-slate-600">—</span>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
}
