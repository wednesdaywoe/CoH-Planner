/**
 * DamageBlock — three-tier damage display + cap-relative bar + per-cycle metric.
 *
 * Extracted from InfoPanel to keep the panel readable. Behavior is identical
 * to the prior inline implementation; this is the structural-cleanup slice
 * that future visual polish (mode tabs, Type-A/B/C/D row classification,
 * etc.) can build on top of.
 *
 * Sub-pieces:
 * - DamageRows  — three-tier table (Type / Base / Enhanced / Final / inherent)
 *                 with per-tick + DoT-total rows when DoT is present.
 * - DamageBar   — segmented base/enhanced/final overlay relative to the AT
 *                 damage cap (visual scale of headroom remaining).
 * - DamageMetrics — Cycle Time + the currently-selected mode value
 *                   (Damage / DPA / DPS / DPE) with proc-damage annotation.
 */

import type { PowerDamageResult } from '@/utils/calculations';
import { calculateArcanaTime, abbreviateDamageType } from '@/utils/calculations';
import { findProcData, parseProcEffect, calculateProcChance, interpolateProcDamage, arcToDegrees } from '@/data';
import type { IOSetEnhancement, SelectedPower } from '@/types';
import { useUIStore } from '@/stores';
import { getDamageCap, calcThreeTier as calcThreeTierUtil } from './powerDisplayUtils';
import { getConArrow } from './SharedPowerComponents';

/** AT-inherent damage column metadata (Scourge / Fury / Crit / Containment etc.) */
export interface InherentDamageInfo {
  /** Tailwind text-color class for the column header + value */
  color: string;
  /** Column header text ("w/ Scourge", "w/ Fury", etc.) */
  header: string;
  /** Apply the AT-bonus to a given final damage value */
  applyBonus: (value: number) => number;
}

export type DamageDisplayMode = 'damage' | 'damagePerAnim' | 'damagePerSec' | 'damagePerEnd';

export interface DamageBlockProps {
  calculatedDamage: PowerDamageResult;
  /** Subset of power.effects needed for cycle-time / DPE math */
  effects: {
    recharge?: number;
    castTime?: number;
    enduranceCost?: number;
    radius?: number;
    /** Cone arc — radians from binary, or already in degrees from upstream conversion */
    arc?: number;
  };
  archetypeId?: string;
  buildLevel: number;
  inherentInfo?: InherentDamageInfo | null;
  globalCombatModifier: number;
  targetLevelOffset: number;
  selectedPower?: SelectedPower | null;
  damageDisplayMode: DamageDisplayMode;
  arcanaTimeEnabled: boolean;
  includeProcDamage: boolean;
  /** Aspect-keyed enhancement bonuses (used for recharge three-tier) */
  enhancementBonuses: Record<string, number | undefined>;
  /** Aspect-keyed global bonuses (used for recharge three-tier) */
  globalBonusesForCalc: Record<string, number | undefined>;
}

export function DamageBlock(props: DamageBlockProps) {
  const { calculatedDamage, effects, buildLevel } = props;
  return (
    <div>
      <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
        Damage <span className="text-slate-500 font-normal">(Lvl {buildLevel})</span>
      </h4>
      <div className="bg-slate-800/50 rounded p-2">
        <ModeToggle />
        <DamageRows {...props} />
        {!calculatedDamage.unknown && calculatedDamage.scale != null && (
          <DamageBar {...props} />
        )}
        {calculatedDamage.unknown && (
          <div className="text-[11px] text-slate-400 italic mt-1">
            * Actual damage varies (pseudo-pet or redirect power)
          </div>
        )}
        {!calculatedDamage.unknown && effects.recharge != null && effects.castTime != null && (
          <DamageMetrics {...props} />
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// ModeToggle — DMG / DPA / DPS / DPE radio. Reads/writes uiStore directly
// so the chosen mode persists across power selections without prop
// threading. Replaces the prior global toggle in the Header.
// ----------------------------------------------------------------------

const MODE_BUTTONS = [
  { mode: 'damage'        as DamageDisplayMode, label: 'DMG', title: 'Average DMG — average damage of one activation' },
  { mode: 'damagePerAnim' as DamageDisplayMode, label: 'DPA', title: 'Damage per Animation — damage / activation time (honors ArcanaTime)' },
  { mode: 'damagePerSec'  as DamageDisplayMode, label: 'DPS', title: 'Damage per Second — damage / full cycle time (activation + recharge)' },
  { mode: 'damagePerEnd'  as DamageDisplayMode, label: 'DPE', title: 'Damage per Endurance — damage / endurance cost' },
];

function ModeToggle() {
  const damageDisplayMode = useUIStore((s) => s.damageDisplayMode);
  const setDamageDisplayMode = useUIStore((s) => s.setDamageDisplayMode);
  return (
    <div
      className="inline-flex items-center bg-slate-700/40 rounded border border-slate-600/50 overflow-hidden mb-1.5"
      role="radiogroup"
      aria-label="Damage display mode"
    >
      {MODE_BUTTONS.map(({ mode, label, title }) => {
        const active = damageDisplayMode === mode;
        return (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setDamageDisplayMode(mode)}
            title={title}
            className={`px-2 py-0.5 text-xs font-medium transition-colors ${
              active ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ----------------------------------------------------------------------
// DamageRows — three-tier table with optional inherent column.
// ----------------------------------------------------------------------

function DamageRows({
  calculatedDamage,
  inherentInfo,
  globalCombatModifier,
  targetLevelOffset,
}: DamageBlockProps) {
  // Type column needs room for "Smash/Eng" (joined damage types like
  // Energy Melee's Smashing/Energy). 4rem cut off the second word; 5.5rem
  // fits the longest joined-and-abbreviated form with a small margin.
  const gridCols = inherentInfo ? 'grid-cols-[5.5rem_1fr_1fr_1fr_1fr]' : 'grid-cols-[5.5rem_1fr_1fr_1fr]';
  const dot = calculatedDamage.dotDamage;
  const hasDirectDamage = dot ? Math.abs(calculatedDamage.base - dot.base) > 0.001 : true;
  const isPureDot = dot && !hasDirectDamage;

  const hasEnh = Math.abs(calculatedDamage.enhanced - calculatedDamage.base) > 0.001;
  const hasGlobal = Math.abs(calculatedDamage.final - calculatedDamage.enhanced) > 0.001;
  const inherentFinal = inherentInfo ? inherentInfo.applyBonus(calculatedDamage.final) : calculatedDamage.final;
  const hasInherentDiff = inherentInfo != null && Math.abs(inherentFinal - calculatedDamage.final) > 0.001;

  const showCombatMod = targetLevelOffset !== 0 && globalCombatModifier !== 1;
  const dmgConArrow = showCombatMod ? getConArrow(targetLevelOffset) : null;
  const cappedClass = calculatedDamage.capped ? 'underline decoration-dotted decoration-amber-400/50' : '';

  // Apply combat modifier to final and inherent values for display
  const displayFinal = showCombatMod ? calculatedDamage.final * globalCombatModifier : calculatedDamage.final;
  const displayInherentFinal = showCombatMod ? inherentFinal * globalCombatModifier : inherentFinal;

  // DoT per-tick values (with inherent bonus on DoT)
  const dotInherentFinal = dot && inherentInfo ? inherentInfo.applyBonus(dot.final) : dot?.final ?? 0;
  const displayDotFinal = dot ? (showCombatMod ? dot.final * globalCombatModifier : dot.final) : 0;
  const displayDotInherentFinal = showCombatMod ? dotInherentFinal * globalCombatModifier : dotInherentFinal;

  // DoT totals
  const dotTotalBase = dot ? dot.base * dot.ticks : 0;
  const dotTotalEnhanced = dot ? dot.enhanced * dot.ticks : 0;
  const dotTotalFinal = dot ? displayDotFinal * dot.ticks : 0;
  const dotTotalInherent = dot && inherentInfo ? displayDotInherentFinal * dot.ticks : dotTotalFinal;

  return (
    <>
      <div className={`grid ${gridCols} gap-1 text-[11px] text-slate-400 uppercase mb-0.5 border-b border-slate-700 pb-0.5`}>
        <span>Type</span>
        <span>Base</span>
        <span>Enhanced</span>
        <span>Final</span>
        {inherentInfo && <span className={inherentInfo.color}>{inherentInfo.header}</span>}
      </div>

      {/* Direct damage row (or per-tick for pure DoT) */}
      <div className={`grid ${gridCols} gap-1 items-baseline text-sm`}>
        <span className="text-red-400">{isPureDot ? `${abbreviateDamageType(calculatedDamage.type)}/tick` : abbreviateDamageType(calculatedDamage.type)}</span>
        <span className="text-slate-200">{calculatedDamage.base.toFixed(2)}</span>
        <span className={hasEnh ? 'text-green-400' : 'text-slate-500'}>
          {hasEnh ? `→ ${calculatedDamage.enhanced.toFixed(2)}` : '—'}
        </span>
        <span className={`${hasGlobal || showCombatMod ? 'text-amber-400' : 'text-slate-500'} ${cappedClass}`}>
          {hasGlobal || showCombatMod ? <>→ {displayFinal.toFixed(2)}{dmgConArrow && <span className={`${dmgConArrow.colorClass} ml-0.5 text-[11px]`}>{dmgConArrow.symbol}</span>}</> : '—'}
        </span>
        {inherentInfo && (
          <span className={`${hasInherentDiff || showCombatMod ? inherentInfo.color : 'text-slate-500'} ${cappedClass}`}>
            {hasInherentDiff || showCombatMod ? <>→ {displayInherentFinal.toFixed(2)}{dmgConArrow && <span className={`${dmgConArrow.colorClass} ml-0.5 text-[11px]`}>{dmgConArrow.symbol}</span>}</> : '—'}
          </span>
        )}
      </div>

      {/* DoT per-tick row (only for mixed direct+DoT powers) */}
      {dot && hasDirectDamage && (() => {
        const dotHasEnh = Math.abs(dot.enhanced - dot.base) > 0.001;
        const dotHasGlobal = Math.abs(dot.final - dot.enhanced) > 0.001;
        const dotHasInherent = inherentInfo != null && Math.abs(dotInherentFinal - dot.final) > 0.001;
        return (
          <div className={`grid ${gridCols} gap-1 items-baseline text-sm`}>
            <span className="text-red-400">{abbreviateDamageType(dot.type)}/tick</span>
            <span className="text-slate-200">{dot.base.toFixed(2)}</span>
            <span className={dotHasEnh ? 'text-green-400' : 'text-slate-500'}>
              {dotHasEnh ? `→ ${dot.enhanced.toFixed(2)}` : '—'}
            </span>
            <span className={`${dotHasGlobal || showCombatMod ? 'text-amber-400' : 'text-slate-500'} ${cappedClass}`}>
              {dotHasGlobal || showCombatMod ? <>→ {displayDotFinal.toFixed(2)}{dmgConArrow && <span className={`${dmgConArrow.colorClass} ml-0.5 text-[11px]`}>{dmgConArrow.symbol}</span>}</> : '—'}
            </span>
            {inherentInfo && (
              <span className={`${dotHasInherent || showCombatMod ? inherentInfo.color : 'text-slate-500'} ${cappedClass}`}>
                {dotHasInherent || showCombatMod ? <>→ {displayDotInherentFinal.toFixed(2)}{dmgConArrow && <span className={`${dmgConArrow.colorClass} ml-0.5 text-[11px]`}>{dmgConArrow.symbol}</span>}</> : '—'}
              </span>
            )}
          </div>
        );
      })()}

      {/* DoT total row */}
      {dot && (() => {
        const hasTotalEnh = Math.abs(dotTotalEnhanced - dotTotalBase) > 0.001;
        const hasTotalGlobal = Math.abs(dotTotalFinal - dotTotalEnhanced) > 0.001;
        const hasTotalInherent = inherentInfo != null && Math.abs(dotTotalInherent - dotTotalFinal) > 0.001;
        return (
          <>
            <div className={`grid ${gridCols} gap-1 items-baseline text-sm mt-1 pt-1 border-t border-slate-700/50`}>
              <span className="text-orange-400">DoT</span>
              <span className="text-slate-200">{dotTotalBase.toFixed(2)}</span>
              <span className={hasTotalEnh ? 'text-green-400' : 'text-slate-500'}>
                {hasTotalEnh ? `→ ${dotTotalEnhanced.toFixed(2)}` : '—'}
              </span>
              <span className={`${hasTotalGlobal || showCombatMod ? 'text-amber-400' : 'text-slate-500'} ${cappedClass}`}>
                {hasTotalGlobal || showCombatMod ? <>→ {dotTotalFinal.toFixed(2)}{dmgConArrow && <span className={`${dmgConArrow.colorClass} ml-0.5 text-[11px]`}>{dmgConArrow.symbol}</span>}</> : '—'}
              </span>
              {inherentInfo && (
                <span className={`${hasTotalInherent || showCombatMod ? inherentInfo.color : 'text-slate-500'} ${cappedClass}`}>
                  {hasTotalInherent || showCombatMod ? <>→ {dotTotalInherent.toFixed(2)}{dmgConArrow && <span className={`${dmgConArrow.colorClass} ml-0.5 text-[11px]`}>{dmgConArrow.symbol}</span>}</> : '—'}
                </span>
              )}
            </div>
            <div className="text-[11px] text-orange-400/70 italic mt-0.5 ml-1">
              {dot.ticks} ticks over {dot.duration}s ({Number(dot.tickRate.toFixed(2))}s/tick)
            </div>
          </>
        );
      })()}
    </>
  );
}

// ----------------------------------------------------------------------
// DamageBar — base/enhanced/final overlay vs AT damage cap.
// ----------------------------------------------------------------------

function DamageBar({ calculatedDamage, archetypeId }: DamageBlockProps) {
  if (calculatedDamage.scale == null) return null;
  const damageCap = getDamageCap(archetypeId ?? '');
  // Fixed reference: AT's damage at scale 1.0 × damageCap.
  // Since base ∝ scale, (base/scale) gives AT base at scale 1.0.
  const referenceDamage = (calculatedDamage.base / calculatedDamage.scale) * damageCap;

  const dot = calculatedDamage.dotDamage;
  const isPureDot = dot && Math.abs(calculatedDamage.base - dot.base) <= 0.001;
  const totalBase = isPureDot
    ? dot.base * dot.ticks
    : calculatedDamage.base + (dot ? dot.base * dot.ticks : 0);
  const totalEnhanced = isPureDot
    ? dot.enhanced * dot.ticks
    : calculatedDamage.enhanced + (dot ? dot.enhanced * dot.ticks : 0);
  const totalFinal = isPureDot
    ? dot.final * dot.ticks
    : calculatedDamage.final + (dot ? dot.final * dot.ticks : 0);

  const basePercent = Math.min((totalBase / referenceDamage) * 100, 100);
  const enhPercent = Math.min((totalEnhanced / referenceDamage) * 100, 100);
  const finalPercent = Math.min((totalFinal / referenceDamage) * 100, 100);

  return (
    <div className="relative h-2.5 bg-slate-700/30 rounded overflow-hidden mt-2" title={`Damage cap: ${(damageCap * 100).toFixed(0)}%`}>
      {/* Final (back layer) — full saturation */}
      <div
        className="absolute inset-y-0 left-0 bg-red-800 rounded-l transition-all duration-300"
        style={{ width: `${finalPercent}%` }}
      />
      {/* Enhanced (middle layer) — medium saturation */}
      <div
        className="absolute inset-y-0 left-0 bg-red-400 rounded-l transition-all duration-300"
        style={{ width: `${enhPercent}%` }}
      />
      {/* Base (front layer) — light, low saturation */}
      <div
        className="absolute inset-y-0 left-0 bg-red-200 rounded-l transition-all duration-300"
        style={{ width: `${basePercent}%` }}
      />
    </div>
  );
}

// ----------------------------------------------------------------------
// DamageMetrics — Cycle Time + selected DPx readout.
// ----------------------------------------------------------------------

function DamageMetrics({
  calculatedDamage,
  effects,
  selectedPower,
  damageDisplayMode,
  arcanaTimeEnabled,
  includeProcDamage,
  enhancementBonuses,
  globalBonusesForCalc,
  buildLevel,
}: DamageBlockProps) {
  // Calculate enhanced recharge time
  const rechargeStats = calcThreeTierUtil('recharge', effects.recharge ?? 0, enhancementBonuses, globalBonusesForCalc);
  const rawCastTime = effects.castTime ?? 0;
  const effectiveCastTime = arcanaTimeEnabled ? calculateArcanaTime(rawCastTime) : rawCastTime;

  // Cycle time = cast time + recharge time
  const baseCycleTime = effectiveCastTime + (effects.recharge ?? 0);
  const finalCycleTime = effectiveCastTime + rechargeStats.final;

  // For pure-DoT powers, calculatedDamage.base IS the per-tick value
  // (calc copies it into dotDamage.base), so adding both double-counts
  // one tick. Detect that case and use only the DoT total.
  const dot = calculatedDamage.dotDamage;
  const isPureDot = dot ? Math.abs(calculatedDamage.base - dot.base) <= 0.001 : false;
  const dotTotalBase = dot ? dot.base * dot.ticks : 0;
  const dotTotalFinal = dot ? dot.final * dot.ticks : 0;

  // Calculate proc damage per activation if toggle is enabled
  let procDamagePerActivation = 0;
  if (includeProcDamage && selectedPower?.slots) {
    const radius = effects.radius ?? 0;
    const arcDegrees = radius > 0 ? (arcToDegrees(effects.arc) || 360) : 360;
    for (const slot of selectedPower.slots) {
      if (!slot || slot.type !== 'io-set') continue;
      const ioEnh = slot as IOSetEnhancement;
      if (!ioEnh.isProc) continue;
      const procData = findProcData(ioEnh.name, ioEnh.setName);
      if (!procData || procData.ppm === null) continue;
      const effect = parseProcEffect(procData.mechanics);
      if (effect.category !== 'Damage' || effect.value === undefined || effect.valueMax === undefined) continue;
      // Interpolate damage at the enhancement's effective level
      const enhLevel = ioEnh.attuned ? buildLevel : (ioEnh.level ?? buildLevel);
      const dmgAtLevel = interpolateProcDamage(effect.value, effect.valueMax, procData.levelRange, enhLevel);
      // Proc chance uses base recharge and raw cast time (not ArcanaTime)
      const procChance = calculateProcChance(procData.ppm, effects.recharge ?? 0, rawCastTime, radius, arcDegrees);
      procDamagePerActivation += dmgAtLevel * procChance;
    }
  }

  const totalDmgBase = isPureDot
    ? dotTotalBase
    : calculatedDamage.base + dotTotalBase;
  const totalDmgFinal = isPureDot
    ? dotTotalFinal + procDamagePerActivation
    : calculatedDamage.final + dotTotalFinal + procDamagePerActivation;

  const baseDPS = totalDmgBase / baseCycleTime;
  const finalDPS = totalDmgFinal / finalCycleTime;

  // Resolve the displayed figure based on the current mode.
  const endCost = effects.enduranceCost ?? 0;
  const metric = resolveDamageMetric({
    mode: damageDisplayMode,
    arcanaTimeEnabled,
    totalDmgBase,
    totalDmgFinal,
    baseDPS,
    finalDPS,
    effectiveCastTime,
    endCost,
  });

  const improved = metric.valueFinal > metric.valueBase * 1.01;
  const procContribution = computeProcContribution(damageDisplayMode, procDamagePerActivation, finalCycleTime, effectiveCastTime, endCost);

  return (
    <div className="mt-2 pt-2 border-t border-slate-700">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-slate-400">
            Cycle Time{arcanaTimeEnabled && <span className="text-cyan-500 text-[11px] ml-0.5" title="Using ArcanaTime (server-tick-adjusted cast time)">A</span>}
          </span>
          <div className="text-slate-300">
            {finalCycleTime.toFixed(2)}s
            {finalCycleTime < baseCycleTime - 0.01 && (
              <span className="text-green-400 text-xs ml-1">
                (was {baseCycleTime.toFixed(1)}s)
              </span>
            )}
          </div>
        </div>
        <div>
          <span className="text-slate-400" title={metric.title}>{metric.label}</span>
          {metric.unavailableReason ? (
            <div className="text-slate-400" title={metric.unavailableReason}>—</div>
          ) : (
            <div className={improved ? 'text-amber-400' : 'text-slate-300'}>
              {metric.valueFinal.toFixed(2)}
              {improved && metric.valueBase > 0 && (
                <span className="text-green-400 text-xs ml-1">
                  (+{((metric.valueFinal / metric.valueBase - 1) * 100).toFixed(0)}%)
                </span>
              )}
              {procDamagePerActivation > 0 && (
                <span className="text-cyan-400 text-xs ml-1" title="Includes proc damage">
                  +{procContribution.toFixed(1)} proc
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Helpers.
// ----------------------------------------------------------------------

interface MetricInputs {
  mode: DamageDisplayMode;
  arcanaTimeEnabled: boolean;
  totalDmgBase: number;
  totalDmgFinal: number;
  baseDPS: number;
  finalDPS: number;
  effectiveCastTime: number;
  endCost: number;
}

interface MetricResolved {
  label: string;
  title: string;
  valueBase: number;
  valueFinal: number;
  unavailableReason: string | null;
}

function resolveDamageMetric(inputs: MetricInputs): MetricResolved {
  const { mode, arcanaTimeEnabled, totalDmgBase, totalDmgFinal, baseDPS, finalDPS, effectiveCastTime, endCost } = inputs;
  switch (mode) {
    case 'damage':
      return {
        label: 'Average DMG',
        title: 'Average damage of one activation',
        valueBase: totalDmgBase,
        valueFinal: totalDmgFinal,
        unavailableReason: null,
      };
    case 'damagePerAnim':
      if (effectiveCastTime <= 0) {
        return { label: 'DPA', title: '', valueBase: 0, valueFinal: 0, unavailableReason: 'No activation time' };
      }
      return {
        label: 'DPA',
        title: `Damage per Animation — damage / ${arcanaTimeEnabled ? 'ArcanaTime' : 'activation time'}`,
        valueBase: totalDmgBase / effectiveCastTime,
        valueFinal: totalDmgFinal / effectiveCastTime,
        unavailableReason: null,
      };
    case 'damagePerEnd':
      if (endCost <= 0) {
        return { label: 'DPE', title: '', valueBase: 0, valueFinal: 0, unavailableReason: 'No endurance cost' };
      }
      return {
        label: 'DPE',
        title: 'Damage per Endurance — damage / endurance cost',
        valueBase: totalDmgBase / endCost,
        valueFinal: totalDmgFinal / endCost,
        unavailableReason: null,
      };
    case 'damagePerSec':
    default:
      return {
        label: 'DPS',
        title: 'Damage per Second — damage / full cycle time (activation + recharge)',
        valueBase: baseDPS,
        valueFinal: finalDPS,
        unavailableReason: null,
      };
  }
}

function computeProcContribution(
  mode: DamageDisplayMode,
  procDamagePerActivation: number,
  finalCycleTime: number,
  effectiveCastTime: number,
  endCost: number,
): number {
  if (mode === 'damagePerSec' && finalCycleTime > 0) return procDamagePerActivation / finalCycleTime;
  if (mode === 'damagePerAnim' && effectiveCastTime > 0) return procDamagePerActivation / effectiveCastTime;
  if (mode === 'damagePerEnd' && endCost > 0) return procDamagePerActivation / endCost;
  return procDamagePerActivation;
}

