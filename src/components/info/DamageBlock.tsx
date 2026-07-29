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
import { arcToDegrees } from '@/data';
import { resolveProcAreaGeometry } from '@/utils/calculations/pet-damage';
import { calculateSlottedProcDamagePerCast } from '@/utils/calculations/power-proc-damage';
import type { SelectedPower } from '@/types';
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
    /** Summon block — lets summon-shell AoEs (Burn, rains) borrow the
     *  pseudo-pet/patch radius for the proc area-factor instead of being scored
     *  single-target. */
    summon?: import('@/types/power').SummonEffect;
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
  /** Extra proc-style damage from active Hybrid/Interface incarnate
   *  slots (already chance-multiplied — i.e., already an average per cast).
   *  Added to the "+X proc" annotation alongside slotted IO procs so the
   *  power's average-damage total reflects all proc sources. */
  incarnateProcDamage?: number;
  /** Highest total final damage among the build's attack powers. The cap bar
   *  normalizes to this so bar length is comparable across powers (Mids-style:
   *  hardest hitter fills the bar). Falls back to a per-power reference when 0. */
  maxBuildDamage?: number;
}

export function DamageBlock(props: DamageBlockProps) {
  const { calculatedDamage, buildLevel } = props;
  // Average proc damage per activation — computed once and shared by the
  // cap bar (yellow segment) and the tier readout so both reflect the same
  // number. Zero when the include-procs toggle is off.
  const procDamagePerActivation = computeProcDamagePerActivation(props);
  return (
    <div>
      {/* Header + mode toggle share one row to save vertical space. */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
          Damage <span className="text-slate-500 font-normal">(Lvl {buildLevel})</span>
        </h4>
        <ModeToggle />
      </div>
      <div className="bg-slate-800/50 rounded p-2">
        <DamageTiers {...props} procDamagePerActivation={procDamagePerActivation} />
        {!calculatedDamage.unknown && calculatedDamage.scale != null && (
          <DamageBar {...props} procDamagePerActivation={procDamagePerActivation} />
        )}
        {calculatedDamage.unknown && (
          <div className="text-[11px] text-slate-400 italic mt-1">
            * Actual damage varies (pseudo-pet or redirect power)
          </div>
        )}
        <DamageContext {...props} />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// ModeToggle — DMG / DPA / DPS / DPE radio. Reads/writes uiStore directly
// so the chosen mode persists across power selections without prop
// threading. The selected mode drives what the three big tier numbers show.
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
      className="inline-flex items-center bg-slate-700/40 rounded border border-slate-600/50 overflow-hidden shrink-0"
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
              active ? 'bg-[var(--color-primary)] text-[var(--color-primary-fg)]' : 'text-slate-300 hover:text-white hover:bg-slate-700'
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
// DamageTiers — the headline: three big BASE / ENHANCED / FINAL numbers
// for the selected metric (DMG / DPA / DPS / DPE).
//
// The numbers are the power's DoT-inclusive lifetime totals transformed by
// the metric divisor. BASE uses the unenhanced cycle; ENHANCED/FINAL use
// the enhanced cycle (so DPS reflects recharge slotting). The three tiers
// are fundamentally the DAMAGE decomposition — base → +slotted damage enh →
// +global/set bonuses — so the dash logic ("no slots" on ENHANCED) keys off
// damage, not the metric. When an AT inherent applies (Crit/Scourge/Fury/
// Containment) it is highlighted AS the FINAL number in its accent color,
// with the plain final shown beneath.
// ----------------------------------------------------------------------

function DamageTiers({
  calculatedDamage: cd,
  effects,
  inherentInfo,
  globalCombatModifier,
  targetLevelOffset,
  damageDisplayMode: mode,
  arcanaTimeEnabled,
  enhancementBonuses,
  globalBonusesForCalc,
  procDamagePerActivation,
}: DamageBlockProps & { procDamagePerActivation: number }) {
  // DoT-inclusive lifetime totals (mirror DamageBar). For pure-DoT powers
  // calculatedDamage.base IS the per-tick value, so use only the DoT total.
  const dot = cd.dotDamage;
  const isPureDot = dot ? Math.abs(cd.base - dot.base) <= 0.001 : false;
  // Probability-weighted ticks: chance-gated / cancel-on-miss DoTs land fewer
  // than the nominal tick count on average (matches the in-game tooltip).
  const lt = (perTick: number) => (dot ? perTick * dot.effectiveTicks : 0);
  const totalBase = isPureDot ? lt(dot!.base) : cd.base + (dot ? lt(dot.base) : 0);
  const totalEnh = isPureDot ? lt(dot!.enhanced) : cd.enhanced + (dot ? lt(dot.enhanced) : 0);
  const totalFinalRaw = isPureDot ? lt(dot!.final) : cd.final + (dot ? lt(dot.final) : 0);

  const showCombatMod = targetLevelOffset !== 0 && globalCombatModifier !== 1;
  const cm = showCombatMod ? globalCombatModifier : 1;
  const totalFinal = totalFinalRaw * cm;
  const inherentFinal = (inherentInfo ? inherentInfo.applyBonus(totalFinalRaw) : totalFinalRaw) * cm;

  // Metric divisors. Cast time is not enhanced, so DPA shares it across
  // tiers; only DPS varies its divisor (base vs enhanced cycle).
  const rechargeStats = calcThreeTierUtil('recharge', effects.recharge ?? 0, enhancementBonuses, globalBonusesForCalc);
  const effCast = arcanaTimeEnabled ? calculateArcanaTime(effects.castTime ?? 0) : (effects.castTime ?? 0);
  const baseCycle = effCast + (effects.recharge ?? 0);
  const finalCycle = effCast + rechargeStats.final;
  const endCost = effects.enduranceCost ?? 0;

  const unavailable =
    mode === 'damagePerAnim' && effCast <= 0 ? 'No activation time' :
    mode === 'damagePerEnd' && endCost <= 0 ? 'No endurance cost' :
    mode === 'damagePerSec' && finalCycle <= 0 ? 'No cycle time' :
    null;

  const metric = (dmg: number, state: 'base' | 'final'): number => {
    switch (mode) {
      case 'damagePerAnim': return dmg / effCast;
      case 'damagePerSec': return dmg / (state === 'base' ? baseCycle : finalCycle);
      case 'damagePerEnd': return dmg / endCost;
      case 'damage':
      default: return dmg;
    }
  };

  const baseVal = metric(totalBase, 'base');
  const enhVal = metric(totalEnh, 'final');
  const finalVal = metric(totalFinal, 'final');
  const inherentVal = metric(inherentFinal, 'final');
  const procVal = computeProcContribution(mode, procDamagePerActivation, finalCycle, effCast, endCost);

  const hasEnhDmg = Math.abs(totalEnh - totalBase) > 0.001;
  const hasInherent = inherentInfo != null && Math.abs(inherentFinal - totalFinal) > 0.001;
  const improvedPct = baseVal > 0 ? ((finalVal - procVal) / baseVal - 1) * 100 : 0;
  const finalImproved = improvedPct > 1 || showCombatMod;
  const cappedClass = cd.capped ? 'underline decoration-dotted decoration-amber-400/50' : '';
  const conArrow = showCombatMod ? getConArrow(targetLevelOffset) : null;

  const typeLabel = `${abbreviateDamageType(cd.type)}${isPureDot ? ' DoT' : ''}`;
  const fmt = (v: number) => v.toFixed(2);

  if (unavailable) {
    return (
      <div className="text-center py-2 text-slate-400 text-sm">
        — <span className="text-xs">({unavailable})</span>
      </div>
    );
  }

  return (
    <div>
      <div className="text-[11px] text-red-400 mb-1">{typeLabel}</div>
      <div className="grid grid-cols-3 gap-1 text-center">
        <Tier label="Base" value={fmt(baseVal)} valueClass="text-slate-100" />
        <Tier
          label="Enhanced"
          value={hasEnhDmg ? fmt(enhVal) : '—'}
          valueClass={hasEnhDmg ? 'text-green-400' : 'text-slate-600'}
          sub={hasEnhDmg ? undefined : 'no slots'}
        />
        <Tier
          label={hasInherent ? `Final ${inherentInfo!.header}` : 'Final'}
          value={hasInherent ? fmt(inherentVal) : fmt(finalVal)}
          valueClass={`${hasInherent ? inherentInfo!.color : finalImproved ? 'text-amber-400' : 'text-slate-100'} ${cappedClass}`}
          arrow={conArrow}
          sub={
            hasInherent
              ? `${fmt(finalVal)} base`
              : finalImproved && improvedPct > 1
                ? `+${improvedPct.toFixed(0)}%`
                : undefined
          }
        />
      </div>
      {!cd.unknown && procDamagePerActivation > 0 && (
        <div
          className="text-center text-[11px] text-cyan-400 mt-1"
          title="Average proc damage per activation, shown separately (flat, cap-exempt) so the (+%) reflects the enhancement multiplier on the attack itself."
        >
          +{procVal.toFixed(1)} proc
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Tier — one big-number column (label / emphasized value / sub-annotation).
// ----------------------------------------------------------------------

function Tier({
  label,
  value,
  valueClass,
  sub,
  arrow,
}: {
  label: string;
  value: string;
  valueClass?: string;
  sub?: string;
  arrow?: { symbol: string; colorClass: string } | null;
}) {
  return (
    <div className="min-w-0 rounded border border-slate-700/60 bg-slate-900/30 px-1 py-1.5">
      <div className="text-[10px] uppercase tracking-wide text-slate-400 leading-tight truncate">{label}</div>
      <div className={`text-2xl font-bold tabular-nums leading-tight ${valueClass ?? 'text-slate-100'}`}>
        {value}
        {arrow && <span className={`${arrow.colorClass} text-[11px] font-normal ml-0.5 align-top`}>{arrow.symbol}</span>}
      </div>
      <div className="text-[10px] text-slate-500 leading-tight min-h-[0.9rem]">{sub ?? ''}</div>
    </div>
  );
}

// ----------------------------------------------------------------------
// DamageBar — base/enhanced/final overlay vs AT damage cap.
// ----------------------------------------------------------------------

function DamageBar({ calculatedDamage, archetypeId, procDamagePerActivation, maxBuildDamage }: DamageBlockProps & { procDamagePerActivation: number }) {
  if (calculatedDamage.scale == null) return null;
  const damageCap = getDamageCap(archetypeId ?? '');

  const dot = calculatedDamage.dotDamage;
  const isPureDot = dot && Math.abs(calculatedDamage.base - dot.base) <= 0.001;
  // Probability-weighted ticks (cancel-on-miss geometric decay / chance-gated).
  const et = dot ? dot.effectiveTicks : 0;
  const totalBase = isPureDot
    ? dot.base * et
    : calculatedDamage.base + (dot ? dot.base * et : 0);
  const totalEnhanced = isPureDot
    ? dot.enhanced * et
    : calculatedDamage.enhanced + (dot ? dot.enhanced * et : 0);
  const totalFinal = isPureDot
    ? dot.final * et
    : calculatedDamage.final + (dot ? dot.final * et : 0);

  // Normalize to the build's highest-damage attack (Mids-style) so bar length
  // is comparable across powers: the hardest hitter fills the bar and the rest
  // scale relative to it. The reference is shared across every power, so it
  // tracks ABSOLUTE damage (a per-power "% of cap" reference made same-strength
  // powers look identical — the bug this replaces). Fall back to the AT's
  // scale-1.0 capped damage when the build has no damaging powers yet.
  const referenceDamage = maxBuildDamage && maxBuildDamage > 0
    ? maxBuildDamage
    : (calculatedDamage.base / calculatedDamage.scale) * damageCap;

  const basePercent = Math.min((totalBase / referenceDamage) * 100, 100);
  const enhPercent = Math.min((totalEnhanced / referenceDamage) * 100, 100);
  const finalPercent = Math.min((totalFinal / referenceDamage) * 100, 100);

  // Proc damage is flat and cap-exempt — stack it past the final fill in cyan
  // (matching the "+N proc" text below). Clamped to the remaining headroom on
  // the shared fixed scale so cross-power comparison is preserved.
  const procDmg = Math.max(0, procDamagePerActivation);
  const procPercent = referenceDamage > 0
    ? Math.max(0, Math.min((procDmg / referenceDamage) * 100, 100 - finalPercent))
    : 0;
  const showProc = procDmg > 0 && procPercent > 0.1;

  // When the attack itself is at the AT damage cap, mark the final fill edge so
  // it's clear the red has maxed out (vs. just being a small hit).
  const capped = calculatedDamage.capped === true;

  return (
    <div className="relative h-2.5 bg-slate-700/30 rounded overflow-hidden mt-2" title={`${maxBuildDamage && maxBuildDamage > 0 ? 'Scaled to your highest-damage attack' : `Damage cap: ${(damageCap * 100).toFixed(0)}%`}${capped ? ` · at damage cap (${(damageCap * 100).toFixed(0)}%)` : ''}${showProc ? ` · +${procDmg.toFixed(1)} proc (cap-exempt)` : ''}`}>
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
      {/* Proc (flat, cap-exempt) — cyan to match the "+N proc" annotation
          below the bar; stacked after the final segment. */}
      {showProc && (
        <div
          className="absolute inset-y-0 bg-cyan-400 transition-all duration-300"
          style={{ left: `${finalPercent}%`, width: `${procPercent}%` }}
        />
      )}
      {/* Damage-cap flag — amber tick at the final fill edge when capped */}
      {capped && (
        <div
          className="absolute inset-y-0 w-0.5 bg-amber-300"
          style={{ left: `calc(${finalPercent}% - 1px)` }}
          title={`At damage cap (${(damageCap * 100).toFixed(0)}%)`}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// DamageContext — compact context line beneath the big numbers: enhanced
// Cycle Time (with ArcanaTime flag + "was Xs" delta) and, for DoT powers,
// the tick breakdown that the lifetime totals above are built from.
// ----------------------------------------------------------------------

function DamageContext({
  calculatedDamage: cd,
  effects,
  arcanaTimeEnabled,
  enhancementBonuses,
  globalBonusesForCalc,
}: DamageBlockProps) {
  if (cd.unknown) return null;
  const dot = cd.dotDamage;
  const hasCycle = effects.recharge != null && effects.castTime != null;
  if (!hasCycle && !dot) return null;

  let cycleNode = null;
  if (hasCycle) {
    const rechargeStats = calcThreeTierUtil('recharge', effects.recharge ?? 0, enhancementBonuses, globalBonusesForCalc);
    const effCast = arcanaTimeEnabled ? calculateArcanaTime(effects.castTime ?? 0) : (effects.castTime ?? 0);
    const baseCycle = effCast + (effects.recharge ?? 0);
    const finalCycle = effCast + rechargeStats.final;
    cycleNode = (
      <span className="text-slate-400">
        Cycle{' '}
        <span className="text-slate-300">{finalCycle.toFixed(2)}s</span>
        {arcanaTimeEnabled && <span className="text-cyan-500 ml-0.5" title="ArcanaTime (server-tick-adjusted cast time)">A</span>}
        {finalCycle < baseCycle - 0.01 && (
          <span className="text-green-400 ml-1">(was {baseCycle.toFixed(1)}s)</span>
        )}
      </span>
    );
  }

  return (
    <div className="mt-2 pt-2 border-t border-slate-700 text-[11px] space-y-0.5">
      {cycleNode && <div>{cycleNode}</div>}
      {dot && (
        <div className="text-orange-400/80">
          DoT: {dot.ticks} ticks × {dot.final.toFixed(2)} over {dot.duration}s ({Number(dot.tickRate.toFixed(2))}s/tick)
          {dot.chance !== undefined && (
            <span title={dot.cancelOnMiss
              ? `${Math.round(dot.chance * 100)}% per tick, cancel-on-miss → ${dot.effectiveTicks.toFixed(2)} avg ticks`
              : `${Math.round(dot.chance * 100)}% per tick → ${dot.effectiveTicks.toFixed(2)} avg ticks`}>
              {' '}@ {Math.round(dot.chance * 100)}% ({dot.effectiveTicks.toFixed(2)} avg)
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Helpers.
// ----------------------------------------------------------------------

/**
 * Average proc damage per activation for this power. Seeds from active
 * Hybrid/Interface incarnate procs (already chance-multiplied) and adds each
 * slotted damage IO proc's chance × flat damage. Returns 0 when the
 * include-procs toggle is off.
 *
 * Proc damage is FLAT — no damage-strength buffs and no damage IO scaling;
 * only AT-specific multipliers (Containment/Crit/Scourge) touch it, and those
 * happen at hit time, not in this average. Proc chance uses base recharge +
 * the power's slotted Recharge bonus (the in-game firing-frequency driver)
 * and raw cast time (not ArcanaTime), matching the proc-chance tooltip.
 */
function computeProcDamagePerActivation(props: DamageBlockProps): number {
  const { selectedPower, effects, includeProcDamage, enhancementBonuses, buildLevel, incarnateProcDamage } = props;
  if (!includeProcDamage) return 0;
  let total = incarnateProcDamage ?? 0;
  if (selectedPower?.slots) {
    const { radius, arcDegrees } = resolveProcAreaGeometry(
      effects.radius ?? 0, arcToDegrees(effects.arc) || undefined, effects.summon);
    total += calculateSlottedProcDamagePerCast({
      slots: selectedPower.slots,
      baseRecharge: effects.recharge ?? 0,
      castTime: effects.castTime ?? 0,
      radius,
      arcDegrees,
      rechargeEnh: enhancementBonuses.recharge ?? 0,
      buildLevel,
      internalName: selectedPower.internalName,
    });
  }
  return total;
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

