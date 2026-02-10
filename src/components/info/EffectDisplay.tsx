/**
 * EffectDisplay - Data-driven power effect rendering
 *
 * Uses the effect registry to automatically display any registered effects
 * with consistent formatting, grouping, and three-tier value support.
 */

import { useMemo } from 'react';
import type { ArchetypeId, NumberOrScaled, NumberOrMez, PowerEffects } from '@/types';
import { getScaleValue } from '@/types';
import {
  EFFECT_REGISTRY,
  groupEffectsByCategory,
  isByTypeObject,
  isMezEffect,
  formatEffectValue as formatValue,
  getByTypeAbbreviations,
  getByTypeFirstValue,
  type EffectCategory,
  type GroupedEffect,
  type EffectDisplayConfig,
} from '@/data/effect-registry';
import {
  calculateBuffDebuffValue,
  calculateDominationMagnitude,
  isDominatorControlPower,
} from '@/utils/calculations';
import { calcThreeTier } from './powerDisplayUtils';
import type { ThreeTierValues } from './powerDisplayUtils';

// ============================================
// TYPES
// ============================================

interface EffectDisplayProps {
  effects: PowerEffects;
  archetypeId?: ArchetypeId;
  enhancementBonuses?: Record<string, number | undefined>;
  globalBonuses?: Record<string, number | undefined>;
  /** Which categories to show (default: all) */
  categories?: EffectCategory[];
  /** Show three-tier values (Base/Enhanced/Final) */
  showThreeTier?: boolean;
  /** Compact mode for tooltips */
  compact?: boolean;
  /** Buff/debuff modifier from archetype */
  buffDebuffMod?: number;
  /** Whether Domination is active (for Dominator mez bonuses) */
  dominationActive?: boolean;
  /** Powerset ID to check if power qualifies for Domination bonus */
  powersetId?: string;
}

// ============================================
// HELPER COMPONENTS
// ============================================

interface EffectRowProps {
  label: string;
  colorClass: string;
  baseValue: string;
  enhancedValue?: string;
  finalValue?: string;
  showThreeTier?: boolean;
  /** Whether this stat can be enhanced. When true, always shows values; when false, shows "—" */
  enhanceable?: boolean;
  suffix?: string;
}

function EffectRow({
  label,
  colorClass,
  baseValue,
  enhancedValue,
  finalValue,
  showThreeTier = false,
  enhanceable = true,
  suffix = '',
}: EffectRowProps) {
  if (showThreeTier) {
    const hasEnh = enhancedValue && enhancedValue !== baseValue;
    const hasFinal = finalValue && finalValue !== enhancedValue;

    return (
      <div className="grid grid-cols-[5rem_1fr_1fr_1fr] gap-1 items-baseline text-xs">
        <span className={colorClass}>{label}</span>
        <span className="text-slate-200">{baseValue}{suffix}</span>
        {enhanceable ? (
          <span className={hasEnh ? 'text-green-400' : 'text-slate-400'}>
            {(enhancedValue ?? baseValue)}{suffix}
          </span>
        ) : (
          <span className="text-slate-600">—</span>
        )}
        {enhanceable ? (
          <span className={hasFinal ? 'text-amber-400' : 'text-slate-400'}>
            {(finalValue ?? enhancedValue ?? baseValue)}{suffix}
          </span>
        ) : (
          <span className="text-slate-600">—</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex justify-between text-xs py-0.5">
      <span className={colorClass}>{label}</span>
      <span className="text-slate-200">{baseValue}{suffix}</span>
    </div>
  );
}

interface MezEffectRowProps {
  label: string;
  colorClass: string;
  value: unknown;
  showThreeTier?: boolean;
  /** Whether Domination bonus applies */
  showDomination?: boolean;
}

/**
 * Get magnitude from a mez value (handles both number and MezEffect object)
 */
function getMezMagnitude(value: NumberOrMez): number {
  if (typeof value === 'number') return value;
  if (isMezEffect(value)) return value.mag;
  return 0;
}

/**
 * Format mez value for display, with optional Domination bonus
 */
function formatMezDisplay(value: NumberOrMez, showDomination: boolean): { text: string; magnitude: number } {
  const baseMag = getMezMagnitude(value);
  const displayMag = showDomination ? calculateDominationMagnitude(baseMag) : baseMag;
  return { text: `Mag ${displayMag}`, magnitude: displayMag };
}

function MezEffectRow({ label, colorClass, value, showThreeTier, showDomination = false }: MezEffectRowProps) {
  const { text } = formatMezDisplay(value as NumberOrMez, showDomination);
  const displayColorClass = showDomination ? 'text-pink-400' : colorClass;

  if (showThreeTier) {
    return (
      <div className="grid grid-cols-[5rem_1fr_1fr_1fr] gap-1 items-baseline text-xs">
        <span className={displayColorClass}>{label}</span>
        <span className="text-slate-200">
          {text}
          {showDomination && <span className="text-pink-300 text-[8px] ml-1">[2×]</span>}
        </span>
        <span className="text-slate-600">—</span>
        <span className="text-slate-600">—</span>
      </div>
    );
  }

  return (
    <div className="flex justify-between text-xs py-0.5">
      <span className={displayColorClass}>{label}</span>
      <span className="text-slate-200">
        {text}
        {showDomination && <span className="text-pink-300 text-[8px] ml-1">[2×]</span>}
      </span>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function EffectDisplay({
  effects,
  archetypeId,
  enhancementBonuses = {},
  globalBonuses = {},
  categories,
  showThreeTier = false,
  compact = false,
  buffDebuffMod = 1.0,
  dominationActive = false,
  powersetId,
}: EffectDisplayProps) {
  // Check if Domination bonus should apply to control effects
  const showDomination = useMemo(() => {
    if (!dominationActive) return false;
    if (archetypeId !== 'dominator') return false;
    if (!powersetId) return false;
    return isDominatorControlPower(powersetId);
  }, [dominationActive, archetypeId, powersetId]);

  // Group effects by category
  const groupedEffects = useMemo(() => {
    const groups = groupEffectsByCategory(effects as Record<string, unknown>);

    // Filter by requested categories if specified
    if (categories && categories.length > 0) {
      return groups.filter(g => categories.includes(g.category));
    }

    return groups;
  }, [effects, categories]);

  // Calculate three-tier values for an effect using shared formula
  const calcThreeTierForEffect = (
    config: EffectDisplayConfig,
    baseValue: number
  ): ThreeTierValues => {
    const aspect = config.enhancementAspect;
    if (!aspect) return { base: baseValue, enhanced: baseValue, final: baseValue };
    return calcThreeTier(aspect, baseValue, enhancementBonuses, globalBonuses);
  };

  // Render a single effect based on its config
  const renderEffect = (effect: GroupedEffect) => {
    const { key, value, config } = effect;

    // Handle mez effects (hold, stun, etc.)
    if (config.format === 'mag') {
      return (
        <MezEffectRow
          key={key}
          label={config.label}
          colorClass={config.colorClass}
          value={value}
          showThreeTier={showThreeTier}
          showDomination={showDomination && config.category === 'control'}
        />
      );
    }

    // Handle by-type effects (defense, resistance by type)
    if (config.canBeByType && isByTypeObject(value)) {
      const firstValue = getByTypeFirstValue(value as Record<string, unknown>);
      if (!firstValue) return null;

      const types = getByTypeAbbreviations(value as Record<string, unknown>);
      const label = `${config.label} (${types})`;

      let baseValue: number;
      if (config.calculation) {
        baseValue = calculateBuffDebuffValue(firstValue, archetypeId, config.calculation);
      } else {
        baseValue = (getScaleValue(firstValue) ?? 0) * 100 * buffDebuffMod;
      }

      if (showThreeTier) {
        const tiers = calcThreeTierForEffect(config, baseValue);
        return (
          <EffectRow
            key={key}
            label={label}
            colorClass={config.colorClass}
            baseValue={tiers.base.toFixed(1)}
            enhancedValue={tiers.enhanced.toFixed(1)}
            finalValue={tiers.final.toFixed(1)}
            showThreeTier={true}
            enhanceable={!!config.enhancementAspect}
            suffix="%"
          />
        );
      }

      return (
        <EffectRow
          key={key}
          label={label}
          colorClass={config.colorClass}
          baseValue={`${baseValue.toFixed(1)}%`}
        />
      );
    }

    // Handle standard numeric effects
    let baseValue: number;
    if (config.calculation) {
      baseValue = calculateBuffDebuffValue(value as NumberOrScaled, archetypeId, config.calculation);
    } else if (config.format === 'percent') {
      if (config.baseMultiplier !== undefined) {
        // Use custom base multiplier (e.g., accuracy × 75% base to-hit)
        baseValue = (getScaleValue(value as NumberOrScaled) ?? 0) * config.baseMultiplier;
      } else {
        // Standard percentage (convert decimal to %)
        baseValue = (getScaleValue(value as NumberOrScaled) ?? 0) * 100 * buffDebuffMod;
      }
    } else {
      baseValue = getScaleValue(value as NumberOrScaled) ?? 0;
    }

    // Three-tier display
    if (showThreeTier) {
      const tiers = calcThreeTierForEffect(config, baseValue);
      const suffix = config.format === 'percent' ? '%' : '';

      return (
        <EffectRow
          key={key}
          label={config.label}
          colorClass={config.colorClass}
          baseValue={tiers.base.toFixed(1)}
          enhancedValue={tiers.enhanced.toFixed(1)}
          finalValue={tiers.final.toFixed(1)}
          showThreeTier={true}
          enhanceable={!!config.enhancementAspect}
          suffix={suffix}
        />
      );
    }

    // Simple display
    const formattedValue = formatValue(baseValue, config.format);
    return (
      <EffectRow
        key={key}
        label={config.label}
        colorClass={config.colorClass}
        baseValue={formattedValue}
      />
    );
  };

  if (groupedEffects.length === 0) {
    return null;
  }

  return (
    <div className={compact ? 'space-y-1' : 'space-y-3'}>
      {groupedEffects.map(group => (
        <div key={group.category}>
          {/* Category header */}
          {!compact && (
            <div className="border-t border-slate-700 mt-1 pt-1 text-[8px] text-slate-500 uppercase mb-1">
              {group.categoryConfig.label}
            </div>
          )}

          {/* Effects in this category */}
          <div className={compact ? 'space-y-0.5' : 'space-y-1'}>
            {group.effects.map(effect => renderEffect(effect))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// SPECIALIZED EXPORTS
// ============================================

/**
 * Render only control effects (mez)
 */
export function ControlEffects(props: Omit<EffectDisplayProps, 'categories'>) {
  return <EffectDisplay {...props} categories={['control']} />;
}

/**
 * Render only buff effects
 */
export function BuffEffects(props: Omit<EffectDisplayProps, 'categories'>) {
  return <EffectDisplay {...props} categories={['buff']} />;
}

/**
 * Render only debuff effects
 */
export function DebuffEffects(props: Omit<EffectDisplayProps, 'categories'>) {
  return <EffectDisplay {...props} categories={['debuff']} />;
}

/**
 * Check if effects object has any registered effects worth displaying
 */
export function hasDisplayableEffects(effects: PowerEffects): boolean {
  for (const key of Object.keys(effects)) {
    if (EFFECT_REGISTRY[key] && effects[key as keyof PowerEffects] != null) {
      return true;
    }
  }
  return false;
}

/**
 * Check if effects object has effects in a specific category
 */
export function hasEffectsInCategory(effects: PowerEffects, category: EffectCategory): boolean {
  for (const [key, config] of Object.entries(EFFECT_REGISTRY)) {
    if (config.category === category && effects[key as keyof PowerEffects] != null) {
      return true;
    }
  }
  return false;
}
