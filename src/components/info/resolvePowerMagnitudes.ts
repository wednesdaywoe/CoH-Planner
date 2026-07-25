/**
 * Pure resolution of a power's granted buff/debuff magnitudes (PROD6B-2).
 *
 * This is the resolution half of `RegistryEffectsDisplay`, lifted out of the component so
 * it can be called without React. It answers "what rows does this power's effects bag
 * produce, and what are each row's three-tier numbers" — nothing about colors, grouping,
 * collapsing, or layout, which stay in the component.
 *
 * Two reasons it lives here rather than inline:
 *
 * 1. The engine now resolves the same rows (`coh_math`'s `granted.rs`, reading the shared
 *    `contract/effect-registry.json`). `powerProjectionParity.test.ts` diffs the engine's
 *    output against THIS function over all three forks' corpora — a gate that means
 *    something only because the component runs the same code path it grades.
 * 2. PROD6C swaps the component onto the engine's projection. That swap is a matter of
 *    replacing this call with a lookup, because the shapes already match.
 *
 * The `getEffectBaseValue` / `calcEffectThreeTier` / mez-duration / knockback-distance
 * logic here is unchanged behavior, only relocated.
 */
import type { NumberOrScaled, PowerEffects } from '@/types';
import { getScaleValue } from '@/types';
import { getTableValue } from '@/data/at-tables';
import {
  groupEffectsByCategory,
  isMezEffect,
  isByTypeObject,
  getByTypeAbbreviations,
  getByTypeFirstValue,
  type EffectDisplayConfig,
} from '@/data/core/effect-registry';
import { calculateBuffDebuffFraction } from '@/utils/calculations/buff-debuff';
import {
  calcThreeTier,
  calculateResistancePercent,
  expandByTypeEntries,
  expandProtectionEntries,
  type ThreeTierValues,
} from './powerDisplayUtils';

/**
 * What quantity a row's three-tier carries. A mez row shows a fixed magnitude beside an
 * enhanceable duration, so the two travel together.
 */
export type MagnitudeQuantity =
  | { kind: 'value' }
  | { kind: 'mez_duration'; magnitude: number }
  | { kind: 'distance' };

export interface ResolvedMagnitude {
  /** Row key — the effect key, suffixed with the type for an expanded row. */
  rowKey: string;
  /** The registry key this row resolved through, un-suffixed. */
  effectKey: string;
  /** Registry config, with `format`/`label` overridden for the percent-form absorb row. */
  config: EffectDisplayConfig;
  /** Per-type row label, set only when the row came from an expansion. */
  expandedLabel?: string;
  /** The authored value this row resolved from. */
  rawValue: unknown;
  tiers: ThreeTierValues;
  quantity: MagnitudeQuantity;
  /** Abbreviated type summary for a COLLAPSED by-type row. */
  byTypeLabel?: string;
}

export interface ResolveMagnitudesParams {
  effects: PowerEffects | undefined;
  archetypeId?: string;
  level?: number;
  /** This power's per-slot enhancement bonuses, keyed by aspect. */
  enhancementBonuses?: Record<string, number | undefined>;
  /** Build-wide globals, keyed by aspect (`convertGlobalBonusesToAspects`). */
  globalBonuses?: Record<string, number | undefined>;
  /** Support modifier, reached only on the table-less fallback paths. */
  buffDebuffMod?: number;
}

/** The level the mez / buff-debuff / percent table reads are pinned to. */
const DISPLAY_TABLE_LEVEL = 50;

/**
 * Calculate three-tier values for an effect using its registry config. An effect with no
 * enhancement aspect is flat across all three tiers.
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
 * Get the base value from an effect, handling different value types.
 */
function getEffectBaseValue(
  value: unknown,
  config: EffectDisplayConfig,
  buffDebuffMod: number,
  archetypeId?: string,
  level?: number
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
        const tableVal = getTableValue(archetypeId, value.table, DISPLAY_TABLE_LEVEL);
        if (tableVal !== undefined) return Math.abs(value.scale) * tableVal;
      }
      return value.mag;
    }
    // ScaledEffect without mag (knockback, knockup, repel) — resolve via table when available
    if (archetypeId && typeof value === 'object' && value !== null && 'scale' in value && 'table' in value) {
      const sv = value as { scale: number; table: string };
      const tableVal = getTableValue(archetypeId, sv.table, DISPLAY_TABLE_LEVEL);
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
      const tableVal = getTableValue(archetypeId, (scaled as { scale: number; table: string }).table, DISPLAY_TABLE_LEVEL);
      if (tableVal !== undefined) {
        return Math.abs((scaled as { scale: number; table: string }).scale * tableVal) * 100;
      }
    }
    // Fallback to legacy formula for plain number scales
    const result = calculateBuffDebuffFraction(scaled, buffDebuffMod, config.calculation);
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
      const tableVal = getTableValue(archetypeId, (value as { scale: number; table: string }).table, DISPLAY_TABLE_LEVEL);
      if (tableVal !== undefined) {
        return Math.abs((value as { scale: number; table: string }).scale * tableVal) * 100;
      }
    }
    const multiplier = config.baseMultiplier ?? 100;
    return scaled * multiplier * buffDebuffMod;
  }

  // Heal / absorb resolve their scale through the table into an HP amount, at the BUILD
  // level (the one level-aware read — the pinned-50 reads above are the display's own
  // long-standing inconsistency).
  if (config.valueFromTable && typeof value === 'object' && value !== null && 'table' in value && archetypeId) {
    const tableVal = getTableValue(archetypeId, (value as { table: string }).table, level ?? DISPLAY_TABLE_LEVEL);
    if (tableVal !== undefined) return scaled * tableVal;
  }

  return scaled;
}

/**
 * `*_Ones` tables (Melee_Ones, Ranged_Ones) are constant 1.0 across all ATs and levels —
 * they signal "scale is a % of target Max HP", not an HP value to scale through a Heal
 * table. Rebirth's Spirit Ward rework is the canonical case: scale 0.10 × Ranged_Ones means
 * 10% of the target's Max HP, NOT 0.10 HP.
 *
 * The recovered `maxHPFraction` form (Wild Bastion 0.25 = 25% of the caster's current Max
 * HP, from an Expression magnitude) says the same thing outright.
 */
function maxHPFractionPercent(value: unknown): number | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  const fraction = (value as { maxHPFraction?: number }).maxHPFraction;
  if (fraction != null) return fraction * 100;
  const table = (value as { table?: string }).table?.toLowerCase() ?? '';
  if (!table.endsWith('_ones')) return undefined;
  const scale = (value as { scale?: number }).scale;
  if (scale == null) return undefined;
  return scale * 100;
}

/**
 * Classify a `mag`-format effect: a mez whose table resolves a positive duration carries
 * that duration beside its fixed magnitude; a `{ scale, table }` with no `mag` is a
 * distance; anything else is a plain magnitude.
 */
function classifyMagQuantity(
  value: unknown,
  config: EffectDisplayConfig,
  archetypeId?: string,
  level?: number
): MagnitudeQuantity {
  if (config.format !== 'mag') return { kind: 'value' };
  if (!archetypeId || !level) return { kind: 'value' };
  if (isMezEffect(value)) {
    const tableVal = getTableValue(archetypeId, value.table, level);
    if (tableVal !== undefined && Math.abs(value.scale * tableVal) > 0) {
      return { kind: 'mez_duration', magnitude: value.mag };
    }
    return { kind: 'value' };
  }
  if (typeof value === 'object' && value !== null && 'scale' in value && 'table' in value) {
    return { kind: 'distance' };
  }
  return { kind: 'value' };
}

/**
 * Resolve every registered effect in a power's effects bag into a row's worth of
 * already-resolved numbers. Unregistered keys (the bag also carries `durations`,
 * `maxStacks`, … bookkeeping) and zero-valued effects produce no row.
 *
 * Rows come back UNFILTERED and UNSORTED: which categories to show, which execution stats
 * the caller owns, and how rows group and order are the component's business.
 */
export function resolvePowerMagnitudes({
  effects,
  archetypeId,
  level,
  enhancementBonuses = {},
  globalBonuses = {},
  buffDebuffMod = 1.0,
}: ResolveMagnitudesParams): ResolvedMagnitude[] {
  if (!effects) return [];

  const rows: ResolvedMagnitude[] = [];
  const push = (row: ResolvedMagnitude) => rows.push(row);

  for (const group of groupEffectsByCategory(effects as Record<string, unknown>)) {
    for (const { key, value, config } of group.effects) {
      // Handle expandByType effects (defense, resistance, elusivity, protection)
      if (config.expandByType && typeof value === 'object' && value !== null) {
        // Protection: expand mez magnitudes, never enhanceable
        if (config.format === 'mag') {
          for (const entry of expandProtectionEntries(value as Record<string, number>, config.label)) {
            push({
              rowKey: `${key}_${entry.typeKey}`,
              effectKey: key,
              config,
              expandedLabel: entry.typeLabel,
              rawValue: entry.magnitude,
              tiers: { base: entry.magnitude, enhanced: entry.magnitude, final: entry.magnitude },
              quantity: { kind: 'value' },
            });
          }
          continue;
        }

        // Defense, resistance, elusivity: expand by damage/defense type
        if (isByTypeObject(value)) {
          for (const entry of expandByTypeEntries(value as Record<string, unknown>, config.label, archetypeId, level)) {
            if (entry.basePercent === 0) continue;
            push({
              rowKey: `${key}_${entry.typeKey}`,
              effectKey: key,
              config,
              expandedLabel: entry.typeLabel,
              rawValue: entry.basePercent,
              tiers: calcEffectThreeTier(config, entry.basePercent, enhancementBonuses, globalBonuses),
              quantity: { kind: 'value' },
            });
          }
          continue;
        }

        // Scalar value on an effect that resolves through the table-base percent path.
        if (config.scalarFromTablePercent) {
          const pct = calculateResistancePercent(value as NumberOrScaled, archetypeId, level) * 100;
          if (pct === 0) continue;
          push({
            rowKey: `${key}__all`,
            effectKey: key,
            config,
            expandedLabel: config.label,
            rawValue: value,
            tiers: { base: pct, enhanced: pct, final: pct },
            quantity: { kind: 'value' },
          });
          continue;
        }
        // Otherwise fall through to the generic path.
      }

      // An effect authored as a fraction of Max HP reports a percent, not an amount — and
      // may carry ONLY a `maxHPFraction`, with no scale for the generic path to read.
      const percentForm = config.maxHpFractionPercentForm ? maxHPFractionPercent(value) : undefined;
      const rowConfig: EffectDisplayConfig = percentForm !== undefined
        ? { ...config, label: `${config.label} (% Max HP)`, format: 'percent' }
        : config;

      const baseValue = percentForm !== undefined
        ? percentForm
        : getEffectBaseValue(value, config, buffDebuffMod, archetypeId, level);
      if (baseValue === null || baseValue === 0) continue;

      const quantity = classifyMagQuantity(value, config, archetypeId, level);

      // A mez's duration and a knockback's distance are scaled by the bonus named by the
      // EFFECT key (a hold's duration reads the `hold` bonus), not by the config's
      // enhancement aspect — which `mag`-format effects do not declare.
      const tiers = quantity.kind === 'value'
        ? calcEffectThreeTier(rowConfig, baseValue, enhancementBonuses, globalBonuses)
        : calcThreeTier(key, baseValue, enhancementBonuses, globalBonuses);

      push({
        rowKey: key,
        effectKey: key,
        config: rowConfig,
        rawValue: value,
        tiers,
        quantity,
        byTypeLabel: config.canBeByType && isByTypeObject(value)
          ? getByTypeAbbreviations(value as Record<string, unknown>)
          : undefined,
      });
    }
  }

  return rows;
}
