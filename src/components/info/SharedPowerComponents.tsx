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
import { abbreviateDamageType, calculateDominationMagnitude, type PowerDamageResult } from '@/utils/calculations';
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
        return `${(v * 100).toFixed(2)}%`;
      case 'seconds':
        return `${v.toFixed(2)}s`;
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
const COLLAPSE_THRESHOLD = 2;

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
  dominationActive,
  finalColumnColor,
}: {
  label: string;
  colorClass: string;
  items: DisplayableEffect[];
  gridCols: string;
  fontSize: string;
  dominationActive: boolean;
  finalColumnColor: string;
}) {
  const [collapsed, setCollapsed] = useState(false);

  // Check if all values are the same for a compact summary
  const allSameBase = items.every(i => Math.abs(i.tiers.base - items[0].tiers.base) < 0.01);
  const summaryValue = allSameBase ? items[0].tiers.base : null;

  const formatValue = (v: number, config: EffectDisplayConfig) => {
    switch (config.format) {
      case 'percent':
        return `${v.toFixed(1)}%`;
      case 'duration':
        return `${v.toFixed(2)}s`;
      case 'degrees':
        return `${Math.round(v)}\u00B0`;
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
        role="button"
        aria-expanded={!collapsed}
        title={collapsed ? `Show all ${items.length} ${label} entries` : `Collapse ${label} list`}
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
        const { key, config } = effect;
        const enhanceable = !!config.enhancementAspect;
        const hasEnh = Math.abs(tiers.enhanced - tiers.base) > 0.001;
        const hasFinal = Math.abs(tiers.final - tiers.enhanced) > 0.001;
        // Strip the group-label prefix from child rows so we don't repeat
        // "Debuff Res:" / "Status Res:" / "Prot:" — the group header already
        // owns that label. `expandByTypeEntries` and `expandProtectionEntries`
        // emit labels like "Debuff Res: Recovery"; render children as just
        // "Recovery" when the prefix matches the parent group's label.
        const baseLabel = elabel || config.label;
        const itemLabel = elabel && elabel.startsWith(`${label}: `)
          ? elabel.slice(label.length + 2)
          : baseLabel;

        if (config.format === 'mag') {
          const rawMag = dominationActive && config.category === 'control' ? calculateDominationMagnitude(tiers.base) : tiers.base;
          const magStr = Number.isInteger(rawMag) ? rawMag.toString() : rawMag.toFixed(1);
          const magColorClass = dominationActive && config.category === 'control' ? 'text-pink-400' : config.colorClass;
          return (
            <div key={key} className={`grid ${gridCols} gap-1 items-baseline ${fontSize} ml-2`}>
              <span className={magColorClass}>{itemLabel}</span>
              <span className="text-slate-200">Mag {magStr}</span>
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

// User-facing sections for the Power Effects table — MEZ / BUFFS / DEBUFFS /
// SPECIAL. Multiple registry categories collapse into one section: protection
// + movement both fold into BUFFS so a player's defensive buffs and travel
// powers sit next to their offensive +DMG/+Rech buffs rather than under a
// half-empty "Protection" subhead.
type EffectSection = 'MEZ' | 'BUFFS' | 'DEBUFFS' | 'SPECIAL';
const SECTION_PRIORITY: Record<EffectSection, number> = {
  MEZ: 1, BUFFS: 2, DEBUFFS: 3, SPECIAL: 4,
};
const SECTION_COLOR: Record<EffectSection, string> = {
  MEZ: 'text-purple-400',
  BUFFS: 'text-green-400',
  DEBUFFS: 'text-amber-400',
  SPECIAL: 'text-cyan-400',
};

function sectionForCategory(cat: EffectCategory): EffectSection | null {
  switch (cat) {
    case 'control': return 'MEZ';
    case 'buff': case 'protection': case 'movement': return 'BUFFS';
    case 'debuff': return 'DEBUFFS';
    case 'special': return 'SPECIAL';
    default: return null;
  }
}

function sectionPriorityForCategory(cat: EffectCategory): number {
  const s = sectionForCategory(cat);
  return s ? SECTION_PRIORITY[s] : 99;
}

function sectionForGroup(g: EffectGroup): EffectSection | null {
  const cat = g.type === 'group'
    ? g.items[0]?.effect.config.category
    : g.item.effect.config.category;
  return cat ? sectionForCategory(cat) : null;
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
  /** Purple patch info for adjusting accuracy and damage final values */
  purplePatchInfo?: { factor: number; offset: number; toHitBonus?: number; combatModifier: number };
}

/** Get con-colored arrow symbol for target level offset (matches in-game con system) */
export function getConArrow(offset: number): { symbol: string; colorClass: string } | null {
  if (offset === 0) return null;
  if (offset <= -3) return { symbol: '\u25B2', colorClass: 'text-slate-400' };
  if (offset === -2) return { symbol: '\u25B2', colorClass: 'text-green-400' };
  if (offset === -1) return { symbol: '\u25B2', colorClass: 'text-blue-400' };
  if (offset === 1) return { symbol: '\u25BC', colorClass: 'text-yellow-400' };
  if (offset === 2) return { symbol: '\u25BC', colorClass: 'text-orange-400' };
  if (offset === 3) return { symbol: '\u25BC', colorClass: 'text-red-400' };
  return { symbol: '\u25BC', colorClass: 'text-purple-400' }; // +4, +5
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
    // ScaledEffect without mag (knockback, knockup, repel) — resolve via table when available
    if (archetypeId && typeof value === 'object' && value !== null && 'scale' in value && 'table' in value) {
      const sv = value as { scale: number; table: string };
      const tableVal = getTableValue(archetypeId, sv.table, 50);
      if (tableVal !== undefined) return Math.abs(sv.scale * tableVal);
    }
    const scaled = getScaleValue(value as NumberOrScaled);
    if (scaled !== undefined) return scaled;
    return null;
  }

  // Handle buff/debuff calculation - returns decimal, multiply by 100 for percent display
  if (config.calculation === 'buff' || config.calculation === 'debuff') {
    const scaled = value as NumberOrScaled;
    const scaleNum = typeof scaled === 'number'
      ? scaled
      : (scaled && typeof scaled === 'object' && 'scale' in scaled
          ? (scaled as { scale: number }).scale
          : undefined);
    // Effects flagged as flat-percent-per-scale (e.g. maxHPBuff at 10%/scale)
    // intentionally ignore the AT-table reference: the game stores a heal-table
    // ref for bookkeeping but applies a fixed multiplier. See effect-registry.ts.
    if (config.flatPercentPerScale !== undefined && scaleNum !== undefined) {
      return Math.abs(scaleNum * config.flatPercentPerScale);
    }
    // Use AT table directly when available (accurate per-AT values)
    if (archetypeId && typeof scaled === 'object' && scaled !== null && 'table' in scaled && 'scale' in scaled) {
      const tableVal = getTableValue(archetypeId, (scaled as { scale: number; table: string }).table, 50);
      if (tableVal !== undefined) {
        return Math.abs((scaled as { scale: number; table: string }).scale * tableVal) * 100;
      }
    }
    // Fallback to legacy formula for plain number scales
    const result = calculateBuffDebuffValue(scaled, buffDebuffMod, config.calculation);
    return result * 100;
  }

  // Handle scaled values
  const scaled = getScaleValue(value as NumberOrScaled);
  if (scaled === undefined) return null;

  // For percent format, multiply by baseMultiplier (default 100)
  // Accuracy uses 75 (base to-hit rate), other percents use 100
  if (config.format === 'percent') {
    // Use AT table directly when available (accurate per-AT values)
    if (archetypeId && typeof value === 'object' && value !== null && 'table' in value && 'scale' in value) {
      const tableVal = getTableValue(archetypeId, (value as { scale: number; table: string }).table, 50);
      if (tableVal !== undefined) {
        return Math.abs((value as { scale: number; table: string }).scale * tableVal) * 100;
      }
    }
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
  duration: _duration,
  damage,
  finalColumnHeader = 'Final',
  finalColumnColor = 'text-amber-400',
  applyInherentBonus,
  purplePatchInfo,
}: RegistryEffectsDisplayProps) {
  const allowedSet = new Set(allowedEnhancements);

  // Per-effect durations for annotations
  const durations = effects?.durations as Record<string, number> | undefined;
  const buffDur = effects?.buffDuration as number | undefined;

  // Look up duration for an effect key, returns undefined if same as buffDuration or not present
  const getEffectDuration = (effectKey: string): number | undefined => {
    if (!durations) return undefined;
    // Try exact key first, then strip expanded suffix (e.g. "defense_smashing" → "defense")
    const baseKey = effectKey.includes('_') ? effectKey.split('_')[0] : effectKey;
    const dur = durations[effectKey] ?? durations[baseKey];
    if (dur === undefined) return undefined;
    // Don't annotate if it matches buffDuration (already shown in execution stats)
    if (buffDur && Math.abs(dur - buffDur) < 0.01) return undefined;
    return dur;
  };

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

    // If the power has no allowed enhancements at all, show all execution stats (e.g., inherent powers)
    if (allowedSet.size === 0) return true;

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

      // Skip healing and absorb (handled separately with AT table resolution)
      if (key === 'healing') continue;
      if (key === 'absorb') continue;

      // Skip damageBuff unless it has perTarget metadata (per-target stacking like Soul Drain)
      if (key === 'damageBuff') {
        const dmgBuff = effects?.damageBuff;
        if (!(typeof dmgBuff === 'object' && dmgBuff !== null && 'perTarget' in dmgBuff)) continue;
      }

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

  // Handle absorb separately (resolve AT table for actual HP values, like healing)
  const absorb = effects?.absorb;
  if (absorb && typeof absorb === 'object' && 'scale' in absorb && absorb.scale != null) {
    const absorbConfig = EFFECT_REGISTRY['absorb'];
    if (absorbConfig && categories.includes(absorbConfig.category as EffectCategory)) {
      let baseAbsorbHP = absorb.scale;
      if (absorb.table && archetypeId) {
        const tableVal = getTableValue(archetypeId, absorb.table, level ?? 50);
        if (tableVal !== undefined) {
          baseAbsorbHP = absorb.scale * tableVal;
        }
      }
      const tiers = calcEffectThreeTier(absorbConfig, baseAbsorbHP, enhancementBonuses, globalBonuses);
      displayableEffects.push({
        effect: { key: 'absorb', value: absorb, config: absorbConfig },
        baseValue: baseAbsorbHP,
        tiers,
      });
    }
  }

  // Return null only if no effects AND no damage to display
  if (displayableEffects.length === 0 && !damage) return null;

  // Sort by user-facing section first (MEZ → BUFFS → DEBUFFS → SPECIAL),
  // then by registry category priority within the section, then by effect
  // priority. Prevents debuff effects from being interleaved between buff
  // and protection rows when those all collapse into the BUFFS section.
  displayableEffects.sort((a, b) => {
    const sectA = sectionPriorityForCategory(a.effect.config.category);
    const sectB = sectionPriorityForCategory(b.effect.config.category);
    if (sectA !== sectB) return sectA - sectB;
    const catA = CATEGORY_CONFIG[a.effect.config.category]?.priority ?? 99;
    const catB = CATEGORY_CONFIG[b.effect.config.category]?.priority ?? 99;
    if (catA !== catB) return catA - catB;
    return (a.effect.config.priority ?? 99) - (b.effect.config.priority ?? 99);
  });

  // Group mez protection effects (hold/stun/immobilize/sleep/confuse/fear) into a collapsible group
  // Also group knockback/knockup when they share the same magnitude
  const MEZ_PROT_KEYS = new Set(['hold', 'stun', 'immobilize', 'sleep', 'confuse', 'fear']);
  const KB_KEYS = new Set(['knockback', 'knockup']);
  const mezProtConfig: EffectDisplayConfig = {
    label: 'Status Prot',
    category: 'control',
    colorClass: 'text-pink-400',
    format: 'mag',
    priority: 1,
  };
  const kbConfig: EffectDisplayConfig = {
    label: 'KB Prot',
    category: 'control',
    colorClass: 'text-pink-400',
    format: 'mag',
    priority: 10,
  };

  // Find and group consecutive mez protection effects
  const grouped: DisplayableEffect[] = [];
  let i = 0;
  while (i < displayableEffects.length) {
    const eff = displayableEffects[i];
    const rawKey = eff.effect.key;

    // Check for mez protection group
    if (MEZ_PROT_KEYS.has(rawKey) && eff.effect.config.format === 'mag') {
      const groupItems: DisplayableEffect[] = [];
      let j = i;
      while (j < displayableEffects.length && MEZ_PROT_KEYS.has(displayableEffects[j].effect.key) && displayableEffects[j].effect.config.format === 'mag') {
        groupItems.push(displayableEffects[j]);
        j++;
      }
      if (groupItems.length >= 2) {
        // Assign shared config and expandedLabel for collapsible grouping
        for (const item of groupItems) {
          grouped.push({
            ...item,
            effect: { ...item.effect, config: mezProtConfig },
            expandedLabel: item.effect.config.label,
          });
        }
      } else {
        grouped.push(...groupItems);
      }
      i = j;
      continue;
    }

    // Check for KB/KU group
    if (KB_KEYS.has(rawKey) && eff.effect.config.format === 'mag') {
      const groupItems: DisplayableEffect[] = [];
      let j = i;
      while (j < displayableEffects.length && KB_KEYS.has(displayableEffects[j].effect.key) && displayableEffects[j].effect.config.format === 'mag') {
        groupItems.push(displayableEffects[j]);
        j++;
      }
      if (groupItems.length >= 2) {
        for (const item of groupItems) {
          grouped.push({
            ...item,
            effect: { ...item.effect, config: kbConfig },
            expandedLabel: item.effect.config.label,
          });
        }
      } else {
        grouped.push(...groupItems);
      }
      i = j;
      continue;
    }

    grouped.push(eff);
    i++;
  }
  displayableEffects.length = 0;
  displayableEffects.push(...grouped);

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
          {header}
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

          // Purple patch combat modifier for damage
          const combatMod = purplePatchInfo?.combatModifier ?? 1;
          const showCombatMod = purplePatchInfo && purplePatchInfo.offset !== 0 && combatMod !== 1;
          const dmgConArrow = showCombatMod ? getConArrow(purplePatchInfo.offset) : null;
          const adjustedFinal = showCombatMod ? finalDamage * combatMod : finalDamage;
          const cappedClass = damage.capped ? 'underline decoration-dotted decoration-amber-400/50' : '';

          // DoT per-tick final (with inherent bonus)
          const dotFinalDamage = dot && applyInherentBonus ? applyInherentBonus(dot.final) : dot?.final ?? 0;
          const adjustedDotFinal = showCombatMod ? dotFinalDamage * combatMod : dotFinalDamage;

          // DoT totals
          const dotTotalBase = dot ? dot.base * dot.ticks : 0;
          const dotTotalEnhanced = dot ? dot.enhanced * dot.ticks : 0;
          const dotTotalFinal = dot ? adjustedDotFinal * dot.ticks : 0;

          return (
            <>
              {/* Direct damage row (or per-tick for pure DoT) */}
              <div className={`grid ${gridCols} gap-1 items-baseline ${fontSize}`}>
                <span className="text-red-400">{isPureDot ? `${abbreviateDamageType(damage.type)}/tick` : abbreviateDamageType(damage.type)}</span>
                <span className="text-slate-200">{damage.base.toFixed(2)}</span>
                <span className={hasEnh ? 'text-green-400' : 'text-slate-400'}>
                  {damage.enhanced.toFixed(2)}
                </span>
                <span className={`${hasFinal || showCombatMod ? finalColumnColor : 'text-slate-400'} ${cappedClass}`}>
                  {adjustedFinal.toFixed(2)}
                  {dmgConArrow && <span className={`${dmgConArrow.colorClass} ml-0.5 text-[9px]`}>{dmgConArrow.symbol}</span>}
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
                    <span className={`${dotHasFinal || showCombatMod ? finalColumnColor : 'text-slate-400'} ${cappedClass}`}>
                      {adjustedDotFinal.toFixed(2)}
                      {dmgConArrow && <span className={`${dmgConArrow.colorClass} ml-0.5 text-[9px]`}>{dmgConArrow.symbol}</span>}
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
                      <span className={`${hasTotalFinal || showCombatMod ? finalColumnColor : 'text-slate-400'} ${cappedClass}`}>
                        {dotTotalFinal.toFixed(2)}
                        {dmgConArrow && <span className={`${dmgConArrow.colorClass} ml-0.5 text-[9px]`}>{dmgConArrow.symbol}</span>}
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

      {/* Effects — sectioned by MEZ / BUFFS / DEBUFFS / SPECIAL with
        * collapsible groups for long expanded-by-type lists. The outer
        * flatMap inserts a section header whenever the effect category
        * transitions to a different user-facing section. */}
      {groupEffectsForDisplay(displayableEffects).flatMap((group, groupIdx, all) => {
        const section = sectionForGroup(group);
        const prevSection = groupIdx > 0 ? sectionForGroup(all[groupIdx - 1]) : null;
        const showHeader = section !== null && section !== prevSection;
        const sectionHeader = showHeader ? (
          <div
            key={`section-${section}-${groupIdx}`}
            className={`${headerFontSize} ${SECTION_COLOR[section!]} font-semibold uppercase tracking-wider mt-1.5 first:mt-0`}
          >
            {section}
          </div>
        ) : null;
        const itemNode = ((): React.ReactNode => {
        if (group.type === 'group') {
          return (
            <CollapsibleEffectGroup
              key={`group-${groupIdx}`}
              label={group.label}
              colorClass={group.colorClass}
              items={group.items}
              gridCols={gridCols}
              fontSize={fontSize}
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

        // Handle mez effects (magnitude format)
        if (config.format === 'mag') {
          const rawMag = dominationActive && config.category === 'control' ? calculateDominationMagnitude(tiers.base) : tiers.base;
          const magStr = Number.isInteger(rawMag) ? rawMag.toString() : rawMag.toFixed(1);
          const colorClass = dominationActive && config.category === 'control' ? 'text-pink-400' : config.colorClass;

          // Duration-based mez (stun, hold, etc.) — magnitude is fixed, duration is enhanceable
          if (isMezEffect(rawValue) && archetypeId && level) {
            const tableVal = getTableValue(archetypeId, rawValue.table, level);
            const baseDuration = tableVal !== undefined ? Math.abs(rawValue.scale * tableVal) : undefined;

            if (baseDuration !== undefined && baseDuration > 0) {
              const enhBonus = enhancementBonuses[key] || 0;
              const enhancedDuration = baseDuration * (1 + enhBonus);
              // No global mez bonus exists, but support it for correctness
              const globalBonus = globalBonuses[key] || 0;
              const finalDuration = baseDuration * (1 + enhBonus + globalBonus);
              const hasEnh = Math.abs(enhancedDuration - baseDuration) > 0.001;
              const hasFinal = Math.abs(finalDuration - enhancedDuration) > 0.001;

              return (
                <div key={key} className={`grid ${gridCols} gap-1 items-baseline ${fontSize}`}>
                  <span className={colorClass}>{label}</span>
                  <span className="text-slate-200">
                    Mag {magStr} ({baseDuration.toFixed(1)}s)
                    {dominationActive && config.category === 'control' && (
                      <span className="text-pink-300 text-[8px] ml-1">[2×]</span>
                    )}
                  </span>
                  <span className={hasEnh ? 'text-green-400' : 'text-slate-400'}>
                    ({enhancedDuration.toFixed(1)}s)
                  </span>
                  <span className={hasFinal ? finalColumnColor : 'text-slate-400'}>
                    ({finalDuration.toFixed(1)}s)
                  </span>
                </div>
              );
            }
          }

          // Distance-based mez (knockback, knockup, repel) — no mag, distance is enhanceable
          if (!isMezEffect(rawValue) && rawValue && typeof rawValue === 'object' && 'scale' in rawValue && 'table' in rawValue && archetypeId && level) {
            const enhBonus = enhancementBonuses[key] || 0;
            const globalBonus = globalBonuses[key] || 0;
            const enhanced = tiers.base * (1 + enhBonus);
            const final_ = tiers.base * (1 + enhBonus + globalBonus);
            const hasEnh = Math.abs(enhanced - tiers.base) > 0.001;
            const hasFinal = Math.abs(final_ - enhanced) > 0.001;

            return (
              <div key={key} className={`grid ${gridCols} gap-1 items-baseline ${fontSize}`}>
                <span className={colorClass}>{label}</span>
                <span className="text-slate-200">{tiers.base.toFixed(1)}</span>
                <span className={hasEnh ? 'text-green-400' : 'text-slate-400'}>
                  {enhanced.toFixed(1)}
                </span>
                <span className={hasFinal ? finalColumnColor : 'text-slate-400'}>
                  {final_.toFixed(1)}
                </span>
              </div>
            );
          }

          // Fallback: simple magnitude (no AT data or plain number) — not enhanceable
          // Also used by protection entries which have plain number values
          let mezDuration = durations?.[key];
          if (mezDuration == null || mezDuration <= 0) mezDuration = undefined;

          return (
            <div key={key} className={`grid ${gridCols} gap-1 items-baseline ${fontSize}`}>
              <span className={colorClass}>{label}</span>
              <span className="text-slate-200">
                Mag {magStr}
                {mezDuration != null && (
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

        // Duration annotation for this effect
        const effectDur = getEffectDuration(key);

        // Standard three-tier row
        const formatValue = (v: number) => {
          switch (config.format) {
            case 'percent':
              return `${(v).toFixed(2)}%`;
            case 'duration':
              return `${v.toFixed(2)}s`;
            case 'degrees':
              return `${Math.round(v)}\u00B0`;
            case 'value':
              if (config.label === 'Range' || config.label === 'Radius') return `${v.toFixed(0)}ft`;
              return v.toFixed(2);
            default:
              return v.toFixed(2);
          }
        };

        return (
          <div key={key} className={`grid ${gridCols} gap-1 items-baseline ${fontSize}`}>
            <span className={config.colorClass}>
              {label}
              {effectDur != null && (
                <span className="text-slate-500 font-normal text-[9px] ml-0.5">({effectDur}s)</span>
              )}
            </span>
            <span className="text-slate-200">{formatValue(tiers.base)}</span>
            {enhanceable ? (
              <span className={hasEnh ? 'text-green-400' : 'text-slate-400'}>
                {formatValue(tiers.enhanced)}
              </span>
            ) : (
              <span className="text-slate-600">—</span>
            )}
            {enhanceable ? (() => {
              const isAccuracy = key === 'accuracy' && purplePatchInfo;
              const conArrow = isAccuracy ? getConArrow(purplePatchInfo.offset) : null;
              const hasToHitMod = isAccuracy && (purplePatchInfo.offset !== 0 || (purplePatchInfo.toHitBonus ?? 0) !== 0);
              const rawFinal = hasToHitMod ? tiers.final * purplePatchInfo!.factor : tiers.final;
              const adjustedFinal = isAccuracy ? Math.min(95, rawFinal) : rawFinal;
              const isCapped = isAccuracy && rawFinal > 95;
              const isAdjusted = hasToHitMod;
              // Tooltip explaining the level-differential adjustment so the user
              // can tell why "Final" differs from "Enhanced" — the arrow alone
              // doesn't communicate that purple-patch ToHit is doing the math.
              let accTitle: string | undefined;
              if (hasToHitMod) {
                const off = purplePatchInfo!.offset;
                const offText = off > 0 ? `+${off}` : `${off}`;
                const effectiveToHitPct = (purplePatchInfo!.factor * 75).toFixed(1);
                const tohitBonus = purplePatchInfo!.toHitBonus ?? 0;
                const bonusPart = tohitBonus !== 0
                  ? ` (includes your ${tohitBonus > 0 ? '+' : ''}${tohitBonus.toFixed(1)}% ToHit bonus)`
                  : '';
                accTitle = `Adjusted for level differential vs ${offText} target — effective base ToHit ${effectiveToHitPct}%${bonusPart}.${isCapped ? ' Hit chance capped at 95%.' : ''}`;
              }
              return (
                <span className={isCapped ? 'text-orange-400' : hasFinal || isAdjusted ? finalColumnColor : 'text-slate-400'} title={accTitle}>
                  {formatValue(adjustedFinal)}
                  {isCapped && (
                    <span className="text-slate-500 text-[9px] ml-0.5">({formatValue(rawFinal)})</span>
                  )}
                  {conArrow && (
                    <span className={`${conArrow.colorClass} ml-0.5 text-[9px]`}>{conArrow.symbol}</span>
                  )}
                </span>
              );
            })() : (
              <span className="text-slate-600">—</span>
            )}
          </div>
        );
        })();
        return sectionHeader ? [sectionHeader, itemNode] : [itemNode];
      })}
      </div>
    </div>
  );
}
