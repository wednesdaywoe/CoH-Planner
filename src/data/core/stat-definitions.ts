/**
 * Stat definitions for the stats dashboard and compare slotting modal.
 *
 * Extracted to a shared module to avoid circular dependencies between
 * StatsDashboard (which renders modals) and CompareSlottingModal
 * (which needs stat definitions).
 */

import { STAT_COLORS } from './stat-colors';
import { applyMovementBuff } from './movement-constants';
import { formatPrecision } from '@/utils/format-precision';
import type { CalculatedStats } from '@/hooks/useCalculatedStats';
import type { GlobalBonuses } from '@/utils/calculations/character-totals';

// ============================================
// TYPES
// ============================================

/** Compound stat value for stats that show rate + percentage */
export interface CompoundStatValue {
  perSec: number;
  buff: number;
}

/** Mez stat value carrying both protection and resistance */
export interface MezStatValue {
  protection: number; // magnitude points
  resistance: number; // percentage
}

/** Paired stat value for S/L, F/C, E/N when the two values differ */
export interface PairedStatValue {
  first: number;
  second: number;
}

export type StatValue = number | string | CompoundStatValue | MezStatValue | PairedStatValue;

export interface StatDefinition {
  id: string;
  label: string;
  getValue: (stats: CalculatedStats, baseHP: number, maxHPCap: number) => StatValue;
  format: (value: StatValue) => string;
  color: string;
  tooltip: string;
  showWhenZero?: boolean;
  breakdownKey?: string; // Key to look up breakdown from calculation result
  breakdownUnit?: string; // Unit for breakdown values (default: '%'). Use 'Mag' for mez protection.
  /** Constant added to the total when displayed (not to individual source
   *  rows). Used by Recharge to follow the CoH speed-multiplier
   *  convention Mids calls "Haste" — base recharge is 100%, bonuses add
   *  on top. Each source row stays as its own bonus value (e.g.
   *  "Hasten +70%"), but the headline and tooltip total render as
   *  "100% + sum of bonuses". This is purely a display convention; the
   *  underlying decimal value used by every formula is unchanged. */
  totalBaseOffset?: number;
  /** Optional override for the breakdown tooltip's *total* line. The per-source
   *  rows always render their raw contributions (`+formatBonusValue(value)`),
   *  but the total can need a different presentation than a plain sum — e.g.
   *  mez resistance shows the resulting mez-*duration* %, a nonlinear transform
   *  of the summed resistance. Receives the raw summed total and returns the
   *  full string for the total cell. When set, the headline's `format()` should
   *  apply the same transform so the headline and tooltip total agree. */
  formatTotal?: (total: number) => string;
  /** Optional override for how each individual breakdown *source* value renders
   *  (the per-row figure). Receives the source's raw value and returns the full
   *  string WITHOUT a leading "+" (the value carries its own sign). Status
   *  resistance uses this to show each buff's negative duration reduction
   *  instead of its raw resistance %, matching the in-game combat monitor. */
  formatBreakdownSource?: (raw: number) => string;
}

// ============================================
// HELPERS
// ============================================

/** Return PairedStatValue if values differ, otherwise just the number */
function pairedValue(a: number, b: number): StatValue {
  if (a === b) return a;
  return { first: a, second: b } as PairedStatValue;
}

/** Format a number as a percentage rounded to 2 decimals, with trailing
 *  zeros stripped: 0 → "0", 30 → "30", 30.5 → "30.5", 30.55 → "30.55".
 *  Veterans still see meaningful precision when it exists; clean zeros
 *  don't pad to "0.00" or "30.00". The tooltip carries the unrounded
 *  breakdown for users who want it. Character totals are the planner's
 *  2-decimal tier; see [[formatPrecision]] for the shared round-then-strip
 *  mechanic. */
function pct2(n: number): string {
  return formatPrecision(n, 2);
}

/** Convert a mez-*resistance* percentage into the resulting mez-*duration*
 *  percentage, matching the in-game combat-attributes convention. A mez of base
 *  duration D lasts `D / (1 + R)` under R% resistance, so the residual duration
 *  is `100 / (1 + R/100)` % of base. e.g. 50% resistance → 66.67% duration —
 *  NOT 50%, the common "cut in half" misconception. Lower is better; 0%
 *  resistance → 100% duration (full). Applies to the six status mezzes only
 *  (Hold/Stun/Immob/Sleep/Confuse/Fear); Knockback resistance reduces distance,
 *  not duration, so it keeps the raw-% display. */
function mezResistDurationPct(resistPct: number): number {
  return 100 / (1 + resistPct / 100);
}

/** Total-line formatter for the six status-resistance stats. Mirrors the in-game
 *  "Status Effect Resistance" combat-attributes header: the *residual* duration
 *  from the summed resistance, as a positive %. e.g. total 205.7% resistance →
 *  100/(1+2.057) = 32.71% duration. (Per-source rows show each source's negative
 *  reduction instead — see [[formatMezResistReduction]] — so they intentionally
 *  do NOT sum to this total, exactly like the in-game window.) */
function formatMezResistTotal(total: number): string {
  return `${pct2(mezResistDurationPct(total))}% dur`;
}

/** Per-source breakdown formatter for status resistance. Matches the in-game
 *  combat monitor, which lists each buff as the duration reduction it provides
 *  in isolation, shown negative: `100/(1+R/100) − 100`. e.g. a +7.5% Status
 *  Resistance bonus → −6.98%, a +20% bonus → −16.67%. Returned without a
 *  leading "+" since the value carries its own sign. */
function formatMezResistReduction(resistPct: number): string {
  return pct2(mezResistDurationPct(resistPct) - 100);
}

/** Format a paired or simple percentage stat */
function formatPairedPercent(v: StatValue): string {
  if (typeof v === 'object' && v !== null && 'first' in v) {
    const p = v as PairedStatValue;
    return `${pct2(p.first)}%/${pct2(p.second)}%`;
  }
  return `${pct2(Number(v))}%`;
}

// (Previously had a formatMezStat helper that combined protection + resistance
// into one "X (Y%)" cell. Removed when the dashboard split into separate
// Status Protection and Status Resistance sections — mez_* now show
// protection-only, mezres_* show resistance-only.)

// ============================================
// STAT DEFINITIONS
// ============================================

export const STAT_DEFINITIONS: Record<string, StatDefinition> = {
  // Offense
  damage: {
    id: 'damage',
    label: 'Dmg',
    getValue: (stats) => stats.globalDamage,
    format: (v) => { const n = Number(v); return `${n >= 0 ? '+' : ''}${pct2(n)}%`; },
    color: STAT_COLORS.damage,
    tooltip: 'Global damage from set bonuses',
    showWhenZero: true,
    breakdownKey: 'damage',
  },
  accuracy: {
    id: 'accuracy',
    label: 'Acc',
    getValue: (stats) => stats.globalAccuracy,
    format: (v) => `+${pct2(Number(v))}%`,
    color: STAT_COLORS.accuracy,
    tooltip: 'Global accuracy from set bonuses',
    showWhenZero: true,
    breakdownKey: 'accuracy',
  },
  tohit: {
    id: 'tohit',
    label: 'ToHit',
    getValue: (stats) => 75 + stats.toHitBuff,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.tohit,
    tooltip: 'Base 75% + ToHit buffs from set bonuses and procs',
    showWhenZero: true,
    breakdownKey: 'toHit',
  },
  recharge: {
    id: 'recharge',
    label: 'Rech',
    getValue: (stats) => stats.globalRecharge,
    // Mids-style speed-multiplier display: base recharge is 100%, bonuses
    // add on top. So +70% Hasten → 170%; +191% build → 291%. Matches
    // Mids' "Haste" column directly so users comparing the two tools see
    // the same number.
    format: (v) => `${pct2(100 + Number(v))}%`,
    color: STAT_COLORS.recharge,
    tooltip: 'Recharge speed (100% base + global bonuses, matches Mids "Haste").',
    showWhenZero: true,
    breakdownKey: 'recharge',
    totalBaseOffset: 100,
  },

  // Defense
  defense_melee: {
    id: 'defense_melee',
    label: 'Melee',
    getValue: (stats) => stats.defense.melee,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Melee defense',
    showWhenZero: true,
    breakdownKey: 'defMelee',
  },
  defense_ranged: {
    id: 'defense_ranged',
    label: 'Ranged',
    getValue: (stats) => stats.defense.ranged,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Ranged defense',
    showWhenZero: true,
    breakdownKey: 'defRanged',
  },
  defense_aoe: {
    id: 'defense_aoe',
    label: 'AoE',
    getValue: (stats) => stats.defense.aoe,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.defense,
    tooltip: 'AoE defense',
    showWhenZero: true,
    breakdownKey: 'defAoE',
  },
  defense_smashing: {
    id: 'defense_smashing',
    label: 'S/L',
    getValue: (stats) => pairedValue(stats.defense.smashing, stats.defense.lethal),
    format: formatPairedPercent,
    color: STAT_COLORS.defense,
    tooltip: 'Smashing/Lethal defense',
    showWhenZero: true,
    breakdownKey: 'defSmashing',
  },
  defense_fire: {
    id: 'defense_fire',
    label: 'F/C',
    getValue: (stats) => pairedValue(stats.defense.fire, stats.defense.cold),
    format: formatPairedPercent,
    color: STAT_COLORS.defense,
    tooltip: 'Fire/Cold defense',
    showWhenZero: true,
    breakdownKey: 'defFire',
  },
  defense_energy: {
    id: 'defense_energy',
    label: 'E/N',
    getValue: (stats) => pairedValue(stats.defense.energy, stats.defense.negative),
    format: formatPairedPercent,
    color: STAT_COLORS.defense,
    tooltip: 'Energy/Negative defense',
    showWhenZero: true,
    breakdownKey: 'defEnergy',
  },
  defense_psionic: {
    id: 'defense_psionic',
    label: 'Psi',
    getValue: (stats) => stats.defense.psionic,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Psionic defense',
    showWhenZero: true,
    breakdownKey: 'defPsionic',
  },
  defense_toxic: {
    id: 'defense_toxic',
    label: 'Toxic',
    getValue: (stats) => stats.defense.toxic,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Toxic defense',
    showWhenZero: true,
    breakdownKey: 'defToxic',
  },

  // Resistance
  resist_smashing: {
    id: 'resist_smashing',
    label: 'S/L',
    getValue: (stats) => pairedValue(stats.resistance.smashing, stats.resistance.lethal),
    format: formatPairedPercent,
    color: STAT_COLORS.resistance,
    tooltip: 'Smashing/Lethal resistance',
    showWhenZero: true,
    breakdownKey: 'resSmashing',
  },
  resist_fire: {
    id: 'resist_fire',
    label: 'F/C',
    getValue: (stats) => pairedValue(stats.resistance.fire, stats.resistance.cold),
    format: formatPairedPercent,
    color: STAT_COLORS.resistance,
    tooltip: 'Fire/Cold resistance',
    showWhenZero: true,
    breakdownKey: 'resFire',
  },
  resist_energy: {
    id: 'resist_energy',
    label: 'E/N',
    getValue: (stats) => pairedValue(stats.resistance.energy, stats.resistance.negative),
    format: formatPairedPercent,
    color: STAT_COLORS.resistance,
    tooltip: 'Energy/Negative resistance',
    showWhenZero: true,
    breakdownKey: 'resEnergy',
  },
  resist_psionic: {
    id: 'resist_psionic',
    label: 'Psi',
    getValue: (stats) => stats.resistance.psionic,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Psionic resistance',
    showWhenZero: true,
    breakdownKey: 'resPsionic',
  },
  resist_toxic: {
    id: 'resist_toxic',
    label: 'Toxic',
    getValue: (stats) => stats.resistance.toxic,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Toxic resistance',
    showWhenZero: true,
    breakdownKey: 'resToxic',
  },

  // Mez Protection — magnitude points. Resistance for these types lives
  // in the parallel mezres_* defs below so each can be its own dashboard
  // section.
  mez_hold: {
    id: 'mez_hold',
    label: 'Hold',
    getValue: (stats) => stats.mezProtection.hold,
    format: (v) => `${Number(v).toFixed(1)} Mag`,
    color: STAT_COLORS.hold,
    tooltip: 'Hold protection (Mag)',
    showWhenZero: true,
    breakdownKey: 'protHold',
    breakdownUnit: 'Mag',
  },
  mez_stun: {
    id: 'mez_stun',
    label: 'Stun',
    getValue: (stats) => stats.mezProtection.stun,
    format: (v) => `${Number(v).toFixed(1)} Mag`,
    color: STAT_COLORS.stun,
    tooltip: 'Stun protection (Mag)',
    showWhenZero: true,
    breakdownKey: 'protStun',
    breakdownUnit: 'Mag',
  },
  mez_immob: {
    id: 'mez_immob',
    label: 'Immob',
    getValue: (stats) => stats.mezProtection.immobilize,
    format: (v) => `${Number(v).toFixed(1)} Mag`,
    color: STAT_COLORS.immobilize,
    tooltip: 'Immobilize protection (Mag)',
    showWhenZero: true,
    breakdownKey: 'protImmobilize',
    breakdownUnit: 'Mag',
  },
  mez_sleep: {
    id: 'mez_sleep',
    label: 'Sleep',
    getValue: (stats) => stats.mezProtection.sleep,
    format: (v) => `${Number(v).toFixed(1)} Mag`,
    color: STAT_COLORS.sleep,
    tooltip: 'Sleep protection (Mag)',
    showWhenZero: true,
    breakdownKey: 'protSleep',
    breakdownUnit: 'Mag',
  },
  mez_confuse: {
    id: 'mez_confuse',
    label: 'Confuse',
    getValue: (stats) => stats.mezProtection.confuse,
    format: (v) => `${Number(v).toFixed(1)} Mag`,
    color: STAT_COLORS.confuse,
    tooltip: 'Confuse protection (Mag)',
    showWhenZero: true,
    breakdownKey: 'protConfuse',
    breakdownUnit: 'Mag',
  },
  mez_fear: {
    id: 'mez_fear',
    label: 'Fear',
    getValue: (stats) => stats.mezProtection.fear,
    format: (v) => `${Number(v).toFixed(1)} Mag`,
    color: STAT_COLORS.fear,
    tooltip: 'Fear protection (Mag)',
    showWhenZero: true,
    breakdownKey: 'protFear',
    breakdownUnit: 'Mag',
  },
  mez_kb: {
    id: 'mez_kb',
    label: 'KB',
    getValue: (stats) => stats.mezProtection.knockback,
    format: (v) => `${Number(v).toFixed(1)} Mag`,
    color: STAT_COLORS.knockback,
    tooltip: 'Knockback protection (Mag)',
    showWhenZero: true,
    breakdownKey: 'protKnockback',
    breakdownUnit: 'Mag',
  },

  // (Mez resistance % defs live further down in the SEPARATE MEZ
  // RESISTANCE block as mezres_hold, mezres_stun, … — used in the
  // dashboard's Status Resistance category.)

  // Endurance
  maxend: {
    id: 'maxend',
    label: 'End',
    getValue: (stats) => stats.maxEndurance,
    format: (v) => `${Number(v).toFixed(0)}`,
    color: STAT_COLORS.maxEnd,
    tooltip: 'Maximum endurance',
    showWhenZero: true,
    breakdownKey: 'maxend',
  },
  recovery: {
    id: 'recovery',
    label: 'Rec',
    getValue: (stats) => {
      // stats.maxEndurance already includes base 100 (added in useCalculatedStats)
      const totalMaxEnd = stats.maxEndurance || 100;
      const baseRecovery = totalMaxEnd / 60;
      const endPerSec = baseRecovery * (1 + stats.recoveryBuff / 100);
      return { perSec: endPerSec, buff: stats.recoveryBuff };
    },
    format: (v) => {
      if (typeof v === 'object' && v !== null && 'perSec' in v) {
        const { perSec, buff } = v as { perSec: number; buff: number };
        return `${perSec.toFixed(2)}/s (+${pct2(buff)}%)`;
      }
      return `+${pct2(Number(v))}%`;
    },
    color: STAT_COLORS.recovery,
    tooltip: 'Endurance recovery: maxEnd/60 per second',
    showWhenZero: true,
    breakdownKey: 'recovery',
  },
  endreduction: {
    id: 'endreduction',
    label: 'End Disc',
    getValue: (stats) => stats.enduranceReduction,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.enduranceDiscount,
    tooltip: 'Endurance Discount (additive %): the sum that feeds the cost formula cost = base / (1 + EndDisc/100). Matches the value Mids shows. The in-game combat-attributes window instead shows the post-formula reduction 1 - 1/(1 + EndDisc/100), so e.g. 3.75% here reads as 3.6% in-game.',
    breakdownKey: 'endurance',
  },
  endcost: {
    id: 'endcost',
    label: 'End Cost',
    getValue: () => 0, // Requires globalBonuses, handled via override
    format: (v) => `${Number(v).toFixed(2)}/s`,
    color: 'text-orange-400',
    tooltip: 'Endurance cost per second from active toggle powers',
    showWhenZero: true,
    breakdownKey: 'toggleEndCost',
    breakdownUnit: '/s',
  },
  netend: {
    id: 'netend',
    label: 'Net End',
    getValue: () => 0, // Requires globalBonuses, handled via override
    format: (v) => {
      const n = Number(v);
      const sign = n >= 0 ? '+' : '';
      return `${sign}${n.toFixed(2)}/s`;
    },
    color: 'text-emerald-400',
    tooltip: 'Net endurance per second: recovery minus toggle costs',
    showWhenZero: true,
  },

  // Health
  health: {
    id: 'health',
    label: 'HP',
    getValue: (stats, baseHP, maxHPCap) => {
      if (baseHP <= 0) return 0;
      const buffedHP = baseHP * (1 + stats.hpBuff / 100);
      return Math.floor(maxHPCap > 0 ? Math.min(buffedHP, maxHPCap) : buffedHP);
    },
    format: (v) => `${v}`,
    color: STAT_COLORS.health,
    tooltip: 'Hit point bonuses',
    showWhenZero: true,
    breakdownKey: 'maxHP',
  },
  regeneration: {
    id: 'regeneration',
    label: 'Regn',
    getValue: (stats, baseHP, maxHPCap) => {
      if (baseHP <= 0) return { perSec: 0, buff: stats.regenBuff };
      const buffedHP = baseHP * (1 + stats.hpBuff / 100);
      const actualHP = maxHPCap > 0 ? Math.min(buffedHP, maxHPCap) : buffedHP;
      // Base regen: 100% HP in 240 seconds = actualHP/240 HP/sec
      const baseRegenRate = actualHP / 240;
      const hpPerSec = baseRegenRate * (1 + stats.regenBuff / 100);
      return { perSec: hpPerSec, buff: stats.regenBuff };
    },
    format: (v) => {
      if (typeof v === 'object' && v !== null && 'perSec' in v) {
        const { perSec, buff } = v as { perSec: number; buff: number };
        return `${perSec.toFixed(2)}/s (+${pct2(buff)}%)`;
      }
      return `+${pct2(Number(v))}%`;
    },
    color: STAT_COLORS.regen,
    tooltip: 'HP regeneration: base is 100% HP in 240s',
    showWhenZero: true,
    breakdownKey: 'regeneration',
  },

  // Movement — values display in mph (or feet for jump height); raw % shown in tooltip via dashboard override.
  // showWhenZero is true so the baseline values are always visible, even on builds with no movement buffs.
  runspeed: {
    id: 'runspeed',
    label: 'Run',
    getValue: (stats) => stats.runSpeed,
    format: (v) => {
      const { value, capped } = applyMovementBuff('runSpeed', Number(v));
      return `${value.toFixed(2)} mph${capped ? ' *' : ''}`;
    },
    color: STAT_COLORS.runSpeed,
    tooltip: 'Run speed (base 14.32 mph, cap 92.50 mph)',
    showWhenZero: true,
    breakdownKey: 'runSpeed',
  },
  flyspeed: {
    id: 'flyspeed',
    label: 'Fly',
    getValue: (stats) => stats.flySpeed,
    // Fly base is 0 (no flight without a power), so the % buff doesn't translate
    // to mph in isolation. Display the raw % until per-power fly speed is wired in.
    format: (v) => { const n = Number(v); return `${n >= 0 ? '+' : ''}${pct2(n)}%`; },
    color: STAT_COLORS.flySpeed,
    tooltip: 'Fly speed buff (cap 58.63 mph; +50% with Fly/Mystic Flight, +25% Afterburner)',
    showWhenZero: true,
    breakdownKey: 'flySpeed',
  },
  jumpspeed: {
    id: 'jumpspeed',
    label: 'Jmp Spd',
    getValue: (stats) => stats.jumpSpeed,
    format: (v) => {
      const { value, capped } = applyMovementBuff('jumpSpeed', Number(v));
      return `${value.toFixed(2)} mph${capped ? ' *' : ''}`;
    },
    color: STAT_COLORS.jumpSpeed,
    tooltip: 'Jump speed (base 21.00 mph, cap 78.18 mph)',
    showWhenZero: true,
    breakdownKey: 'jumpSpeed',
  },
  jumpheight: {
    id: 'jumpheight',
    label: 'Jmp Ht',
    getValue: (stats) => stats.jumpHeight,
    format: (v) => {
      const { value } = applyMovementBuff('jumpHeight', Number(v));
      return `${value.toFixed(2)} ft`;
    },
    color: STAT_COLORS.jumpHeight,
    tooltip: 'Jump height (base 4.00 ft)',
    showWhenZero: true,
    breakdownKey: 'jumpHeight',
  },

  // Debuff Resistance — labels omit "Debuff" / "Res" since the panel
  // header already conveys both. Long words like "Recharge" are spelled
  // out where they fit.
  debuff_slow: {
    id: 'debuff_slow',
    label: 'Slow',
    getValue: (stats) => stats.debuffResistance.slow,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.debuffResistance,
    tooltip: 'Resistance to slow/movement debuffs',
    breakdownKey: 'debuffResistSlow',
  },
  debuff_defense: {
    id: 'debuff_defense',
    label: 'Defense',
    getValue: (stats) => stats.debuffResistance.defense,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.debuffResistance,
    tooltip: 'Resistance to defense debuffs',
    breakdownKey: 'debuffResistDefense',
  },
  debuff_recharge: {
    id: 'debuff_recharge',
    label: 'Recharge',
    getValue: (stats) => stats.debuffResistance.recharge,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.debuffResistance,
    tooltip: 'Resistance to recharge debuffs',
    breakdownKey: 'debuffResistRecharge',
  },
  debuff_endurance: {
    id: 'debuff_endurance',
    label: 'End Drain',
    getValue: (stats) => stats.debuffResistance.endurance,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.debuffResistance,
    tooltip: 'Resistance to endurance drain',
    breakdownKey: 'debuffResistEndurance',
  },
  debuff_recovery: {
    id: 'debuff_recovery',
    label: 'Recovery',
    getValue: (stats) => stats.debuffResistance.recovery,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.debuffResistance,
    tooltip: 'Resistance to recovery debuffs',
    breakdownKey: 'debuffResistRecovery',
  },
  debuff_tohit: {
    id: 'debuff_tohit',
    label: 'ToHit',
    getValue: (stats) => stats.debuffResistance.tohit,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.debuffResistance,
    tooltip: 'Resistance to ToHit debuffs',
    breakdownKey: 'debuffResistToHit',
  },
  debuff_regen: {
    id: 'debuff_regen',
    label: 'Regen',
    getValue: (stats) => stats.debuffResistance.regeneration,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.debuffResistance,
    tooltip: 'Resistance to regeneration debuffs',
    breakdownKey: 'debuffResistRegeneration',
  },
  debuff_perception: {
    id: 'debuff_perception',
    label: 'Perception',
    getValue: (stats) => stats.debuffResistance.perception,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.debuffResistance,
    tooltip: 'Resistance to perception debuffs',
    breakdownKey: 'debuffResistPerception',
  },

  // ============================================
  // INDIVIDUAL DEFENSE (for Detailed Totals)
  // ============================================
  def_smashing: {
    id: 'def_smashing',
    label: 'Smashing',
    getValue: (stats) => stats.defense.smashing,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Smashing defense',
    showWhenZero: true,
    breakdownKey: 'defSmashing',
  },
  def_lethal: {
    id: 'def_lethal',
    label: 'Lethal',
    getValue: (stats) => stats.defense.lethal,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Lethal defense',
    showWhenZero: true,
    breakdownKey: 'defLethal',
  },
  def_fire: {
    id: 'def_fire',
    label: 'Fire',
    getValue: (stats) => stats.defense.fire,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Fire defense',
    showWhenZero: true,
    breakdownKey: 'defFire',
  },
  def_cold: {
    id: 'def_cold',
    label: 'Cold',
    getValue: (stats) => stats.defense.cold,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Cold defense',
    showWhenZero: true,
    breakdownKey: 'defCold',
  },
  def_energy: {
    id: 'def_energy',
    label: 'Energy',
    getValue: (stats) => stats.defense.energy,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Energy defense',
    showWhenZero: true,
    breakdownKey: 'defEnergy',
  },
  def_negative: {
    id: 'def_negative',
    label: 'Negative',
    getValue: (stats) => stats.defense.negative,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Negative energy defense',
    showWhenZero: true,
    breakdownKey: 'defNegative',
  },
  def_psionic: {
    id: 'def_psionic',
    label: 'Psionic',
    getValue: (stats) => stats.defense.psionic,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Psionic defense',
    showWhenZero: true,
    breakdownKey: 'defPsionic',
  },
  def_toxic: {
    id: 'def_toxic',
    label: 'Toxic',
    getValue: (stats) => stats.defense.toxic,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Toxic defense',
    showWhenZero: true,
    breakdownKey: 'defToxic',
  },

  // ============================================
  // INDIVIDUAL RESISTANCE (for Detailed Totals)
  // ============================================
  res_smashing: {
    id: 'res_smashing',
    label: 'Smashing',
    getValue: (stats) => stats.resistance.smashing,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Smashing resistance',
    showWhenZero: true,
    breakdownKey: 'resSmashing',
  },
  res_lethal: {
    id: 'res_lethal',
    label: 'Lethal',
    getValue: (stats) => stats.resistance.lethal,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Lethal resistance',
    showWhenZero: true,
    breakdownKey: 'resLethal',
  },
  res_fire: {
    id: 'res_fire',
    label: 'Fire',
    getValue: (stats) => stats.resistance.fire,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Fire resistance',
    showWhenZero: true,
    breakdownKey: 'resFire',
  },
  res_cold: {
    id: 'res_cold',
    label: 'Cold',
    getValue: (stats) => stats.resistance.cold,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Cold resistance',
    showWhenZero: true,
    breakdownKey: 'resCold',
  },
  res_energy: {
    id: 'res_energy',
    label: 'Energy',
    getValue: (stats) => stats.resistance.energy,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Energy resistance',
    showWhenZero: true,
    breakdownKey: 'resEnergy',
  },
  res_negative: {
    id: 'res_negative',
    label: 'Negative',
    getValue: (stats) => stats.resistance.negative,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Negative energy resistance',
    showWhenZero: true,
    breakdownKey: 'resNegative',
  },
  res_psionic: {
    id: 'res_psionic',
    label: 'Psionic',
    getValue: (stats) => stats.resistance.psionic,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Psionic resistance',
    showWhenZero: true,
    breakdownKey: 'resPsionic',
  },
  res_toxic: {
    id: 'res_toxic',
    label: 'Toxic',
    getValue: (stats) => stats.resistance.toxic,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Toxic resistance',
    showWhenZero: true,
    breakdownKey: 'resToxic',
  },

  // ============================================
  // SEPARATE MEZ PROTECTION (magnitude only)
  // ============================================
  prot_hold: {
    id: 'prot_hold',
    label: 'Hold',
    getValue: (stats) => stats.mezProtection.hold,
    format: (v) => `Mag ${Number(v).toFixed(1)}`,
    color: STAT_COLORS.hold,
    tooltip: 'Hold protection magnitude',
    showWhenZero: true,
    breakdownKey: 'protHold',
    breakdownUnit: 'Mag',
  },
  prot_stun: {
    id: 'prot_stun',
    label: 'Stun',
    getValue: (stats) => stats.mezProtection.stun,
    format: (v) => `Mag ${Number(v).toFixed(1)}`,
    color: STAT_COLORS.stun,
    tooltip: 'Stun protection magnitude',
    showWhenZero: true,
    breakdownKey: 'protStun',
    breakdownUnit: 'Mag',
  },
  prot_immob: {
    id: 'prot_immob',
    label: 'Immobilize',
    getValue: (stats) => stats.mezProtection.immobilize,
    format: (v) => `Mag ${Number(v).toFixed(1)}`,
    color: STAT_COLORS.immobilize,
    tooltip: 'Immobilize protection magnitude',
    showWhenZero: true,
    breakdownKey: 'protImmobilize',
    breakdownUnit: 'Mag',
  },
  prot_sleep: {
    id: 'prot_sleep',
    label: 'Sleep',
    getValue: (stats) => stats.mezProtection.sleep,
    format: (v) => `Mag ${Number(v).toFixed(1)}`,
    color: STAT_COLORS.sleep,
    tooltip: 'Sleep protection magnitude',
    showWhenZero: true,
    breakdownKey: 'protSleep',
    breakdownUnit: 'Mag',
  },
  prot_confuse: {
    id: 'prot_confuse',
    label: 'Confuse',
    getValue: (stats) => stats.mezProtection.confuse,
    format: (v) => `Mag ${Number(v).toFixed(1)}`,
    color: STAT_COLORS.confuse,
    tooltip: 'Confuse protection magnitude',
    showWhenZero: true,
    breakdownKey: 'protConfuse',
    breakdownUnit: 'Mag',
  },
  prot_fear: {
    id: 'prot_fear',
    label: 'Fear',
    getValue: (stats) => stats.mezProtection.fear,
    format: (v) => `Mag ${Number(v).toFixed(1)}`,
    color: STAT_COLORS.fear,
    tooltip: 'Fear/Terrorize protection magnitude',
    showWhenZero: true,
    breakdownKey: 'protFear',
    breakdownUnit: 'Mag',
  },
  prot_kb: {
    id: 'prot_kb',
    label: 'Knockback',
    getValue: (stats) => stats.mezProtection.knockback,
    format: (v) => `Mag ${Number(v).toFixed(1)}`,
    color: STAT_COLORS.knockback,
    tooltip: 'Knockback protection magnitude',
    showWhenZero: true,
    breakdownKey: 'protKnockback',
    breakdownUnit: 'Mag',
  },

  // ============================================
  // SEPARATE MEZ RESISTANCE (% only)
  // ============================================
  mezres_hold: {
    id: 'mezres_hold',
    label: 'Hold',
    getValue: (stats) => stats.mezResistance.hold,
    format: (v) => `${pct2(mezResistDurationPct(Number(v)))}%`,
    formatTotal: formatMezResistTotal,
    formatBreakdownSource: formatMezResistReduction,
    color: STAT_COLORS.hold,
    tooltip: 'Hold duration as % of base (in-game convention). Lower is better — 50% resistance → 66.67% duration, not 50%.',
    showWhenZero: true,
    breakdownKey: 'mezResistHold',
  },
  mezres_stun: {
    id: 'mezres_stun',
    label: 'Stun',
    getValue: (stats) => stats.mezResistance.stun,
    format: (v) => `${pct2(mezResistDurationPct(Number(v)))}%`,
    formatTotal: formatMezResistTotal,
    formatBreakdownSource: formatMezResistReduction,
    color: STAT_COLORS.stun,
    tooltip: 'Stun duration as % of base (in-game convention). Lower is better — 50% resistance → 66.67% duration, not 50%.',
    showWhenZero: true,
    breakdownKey: 'mezResistStun',
  },
  mezres_immob: {
    id: 'mezres_immob',
    label: 'Immob',
    getValue: (stats) => stats.mezResistance.immobilize,
    format: (v) => `${pct2(mezResistDurationPct(Number(v)))}%`,
    formatTotal: formatMezResistTotal,
    formatBreakdownSource: formatMezResistReduction,
    color: STAT_COLORS.immobilize,
    tooltip: 'Immobilize duration as % of base (in-game convention). Lower is better — 50% resistance → 66.67% duration, not 50%.',
    showWhenZero: true,
    breakdownKey: 'mezResistImmobilize',
  },
  mezres_sleep: {
    id: 'mezres_sleep',
    label: 'Sleep',
    getValue: (stats) => stats.mezResistance.sleep,
    format: (v) => `${pct2(mezResistDurationPct(Number(v)))}%`,
    formatTotal: formatMezResistTotal,
    formatBreakdownSource: formatMezResistReduction,
    color: STAT_COLORS.sleep,
    tooltip: 'Sleep duration as % of base (in-game convention). Lower is better — 50% resistance → 66.67% duration, not 50%.',
    showWhenZero: true,
    breakdownKey: 'mezResistSleep',
  },
  mezres_confuse: {
    id: 'mezres_confuse',
    label: 'Confuse',
    getValue: (stats) => stats.mezResistance.confuse,
    format: (v) => `${pct2(mezResistDurationPct(Number(v)))}%`,
    formatTotal: formatMezResistTotal,
    formatBreakdownSource: formatMezResistReduction,
    color: STAT_COLORS.confuse,
    tooltip: 'Confuse duration as % of base (in-game convention). Lower is better — 50% resistance → 66.67% duration, not 50%.',
    showWhenZero: true,
    breakdownKey: 'mezResistConfuse',
  },
  mezres_fear: {
    id: 'mezres_fear',
    label: 'Fear',
    getValue: (stats) => stats.mezResistance.fear,
    format: (v) => `${pct2(mezResistDurationPct(Number(v)))}%`,
    formatTotal: formatMezResistTotal,
    formatBreakdownSource: formatMezResistReduction,
    color: STAT_COLORS.fear,
    tooltip: 'Fear/Terrorize duration as % of base (in-game convention). Lower is better — 50% resistance → 66.67% duration, not 50%.',
    showWhenZero: true,
    breakdownKey: 'mezResistFear',
  },
  mezres_kb: {
    id: 'mezres_kb',
    label: 'KB',
    getValue: (stats) => stats.mezResistance.knockback,
    format: (v) => `${pct2(Number(v))}%`,
    color: STAT_COLORS.knockback,
    tooltip: 'Knockback resistance (%)',
    showWhenZero: true,
    breakdownKey: 'mezResistKnockback',
  },

  // ============================================
  // ADDITIONAL STATS (for Detailed Totals)
  // ============================================
  range_bonus: {
    id: 'range_bonus',
    label: 'Range',
    getValue: () => 0, // Range bonus requires globalBonuses, handled via override in DetailedTotalsModal
    format: (v) => `+${pct2(Number(v))}%`,
    color: STAT_COLORS.accuracy,
    tooltip: 'Range bonus from set bonuses',
    breakdownKey: 'range',
  },
  heal_other: {
    id: 'heal_other',
    // "Heal Bonus" (was "Heal Other"): +Heal *strength* — scales up the heals
    // you cast, including heals that land on yourself. Distinct from
    // heal_received below (incoming healing). Renamed to match the in-game
    // convention and because it isn't limited to heals cast on others.
    label: 'Heal Bonus',
    getValue: () => 0, // Requires globalBonuses, handled via override
    format: (v) => `+${pct2(Number(v))}%`,
    color: STAT_COLORS.health,
    tooltip: 'Bonus to the strength of heals you cast (including on yourself)',
    breakdownKey: 'healOther',
  },
  heal_received: {
    id: 'heal_received',
    label: 'Heal Rec',
    getValue: () => 0, // Requires globalBonuses, handled via override
    // Positive = more healing received (Res(Heal) buff, e.g. Incandescence
    // Destiny +50%). Can be negative if a power reduces healing received.
    format: (v) => `${Number(v) >= 0 ? '+' : ''}${pct2(Number(v))}%`,
    color: STAT_COLORS.health,
    tooltip: 'Bonus to healing you receive from any source (Resistance to Heal)',
    breakdownKey: 'healReceived',
  },
  threat_level: {
    id: 'threat_level',
    label: 'Threat',
    getValue: () => 0, // Requires globalBonuses, handled via override
    format: (v) => `+${pct2(Number(v))}%`,
    color: STAT_COLORS.resistance,
    tooltip: 'Threat level modifier',
    breakdownKey: 'threatLevel',
  },

  // ============================================
  // STEALTH & PERCEPTION
  // ============================================
  stealth_pve: {
    id: 'stealth_pve',
    label: 'Stealth (PvE)',
    getValue: () => 0, // Requires globalBonuses
    format: (v) => `${Number(v).toFixed(0)} ft`,
    color: STAT_COLORS.defense,
    tooltip: 'Stealth radius in PvE (feet)',
    breakdownKey: 'stealthRadiusPvE',
    breakdownUnit: ' ft',
  },
  stealth_pvp: {
    id: 'stealth_pvp',
    label: 'Stealth (PvP)',
    getValue: () => 0, // Requires globalBonuses
    format: (v) => `${Number(v).toFixed(0)} ft`,
    color: STAT_COLORS.defense,
    tooltip: 'Stealth radius in PvP (feet)',
    breakdownKey: 'stealthRadiusPvP',
    breakdownUnit: ' ft',
  },
  perception_bonus: {
    id: 'perception_bonus',
    label: 'Percep',
    getValue: () => 0, // Requires globalBonuses
    format: (v) => `+${pct2(Number(v))}%`,
    color: STAT_COLORS.accuracy,
    tooltip: 'Perception radius bonus',
    breakdownKey: 'perceptionRadius',
  },

  // ============================================
  // ADDITIONAL STATUS PROTECTION/RESISTANCE
  // ============================================
  prot_repel: {
    id: 'prot_repel',
    label: 'Repel',
    getValue: () => 0, // Requires globalBonuses
    format: (v) => `Mag ${Number(v).toFixed(1)}`,
    color: STAT_COLORS.knockback,
    tooltip: 'Repel protection magnitude',
    breakdownKey: 'protRepel',
    breakdownUnit: 'Mag',
  },
  prot_teleport: {
    id: 'prot_teleport',
    label: 'Teleport',
    getValue: () => 0, // Requires globalBonuses
    format: (v) => `${Number(v).toFixed(0)}%`,
    color: STAT_COLORS.defense,
    tooltip: 'Teleport protection',
    breakdownKey: 'protTeleport',
  },
  mezres_taunt: {
    id: 'mezres_taunt',
    label: 'Taunt',
    getValue: () => 0, // Requires globalBonuses
    format: (v) => `${pct2(mezResistDurationPct(Number(v)))}%`,
    formatTotal: formatMezResistTotal,
    formatBreakdownSource: formatMezResistReduction,
    color: STAT_COLORS.hold,
    tooltip: 'Taunt duration as % of base (in-game convention). Lower is better.',
    breakdownKey: 'mezResistTaunt',
  },
  mezres_placate: {
    id: 'mezres_placate',
    label: 'Placate',
    getValue: () => 0, // Requires globalBonuses
    format: (v) => `${pct2(mezResistDurationPct(Number(v)))}%`,
    formatTotal: formatMezResistTotal,
    formatBreakdownSource: formatMezResistReduction,
    color: STAT_COLORS.confuse,
    tooltip: 'Placate duration as % of base (in-game convention). Lower is better.',
    breakdownKey: 'mezResistPlacate',
  },

  // ============================================
  // INCARNATE
  // ============================================
  level_shift: {
    id: 'level_shift',
    label: 'Lvl Shift',
    getValue: () => 0, // Overridden by GLOBAL_BONUS_OVERRIDES → globalBonuses.levelShift
    format: (v) => Number(v) > 0 ? `+${Number(v)}` : '0',
    color: 'text-amber-400',
    tooltip: 'Incarnate level shift (from Alpha, Destiny, and Lore T3+)',
    showWhenZero: true,
    breakdownKey: 'levelShift',
    breakdownUnit: '',
  },
};

// ============================================
// VALUE RESOLUTION (shared by every stat surface)
// ============================================

/**
 * Stats whose displayed value comes from the build's `globalBonuses` rather
 * than the legacy `CalculatedStats` object — their `getValue` returns 0 as a
 * placeholder. This is the single source of truth shared by the dashboard
 * tiles, the Detailed Totals sheet, and anywhere else that renders stats, so
 * the surfaces can never diverge on how a stat is sourced.
 *
 * NOTE: mez RESISTANCE (`mezres_hold`…`mezres_kb`) is intentionally absent. Its
 * value is the per-type total — generic MezResist(All) **plus** the type-
 * specific bonus — which `getValue` computes from `stats.mezResistance`.
 * Routing it through the type-specific `globalBonuses` field alone would drop
 * the generic component (e.g. Aegis' MezResist(All)). `mezres_taunt`/`placate`
 * have no generic component and no `stats.mezResistance` entry, so they DO use
 * the override.
 */
export const GLOBAL_BONUS_OVERRIDES: Record<string, keyof GlobalBonuses> = {
  range_bonus: 'range',
  heal_other: 'healOther',
  heal_received: 'healReceived',
  threat_level: 'threatLevel',
  stealth_pve: 'stealthRadiusPvE',
  stealth_pvp: 'stealthRadiusPvP',
  perception_bonus: 'perceptionRadius',
  prot_repel: 'protRepel',
  prot_teleport: 'protTeleport',
  mezres_taunt: 'mezResistTaunt',
  mezres_placate: 'mezResistPlacate',
  level_shift: 'levelShift',
  endcost: 'toggleEndCost',
  netend: 'netEndPerSec',
};

/**
 * Resolve a stat's display value: the `globalBonuses` override when one exists,
 * otherwise the definition's own `getValue`. Used by every stat surface so they
 * compute values identically.
 */
export function resolveStatValue(
  statId: string,
  def: StatDefinition,
  stats: CalculatedStats,
  globalBonuses: GlobalBonuses,
  baseHP: number,
  maxHPCap: number,
): StatValue {
  const globalKey = GLOBAL_BONUS_OVERRIDES[statId];
  return globalKey ? globalBonuses[globalKey] : def.getValue(stats, baseHP, maxHPCap);
}

// ============================================
// SECTION PLACEMENT (single source of truth)
// ============================================

export type StatCategory =
  | 'offense'
  | 'health-endurance'
  | 'movement'
  | 'stealth-perception'
  | 'defense'
  | 'resistance'
  | 'status-protection'
  | 'status-resistance'
  | 'debuff-resistance';

/**
 * Canonical, ordered grouping of every dashboard stat into its section. This is
 * the single source of truth for stat→section placement: the dashboard tiles,
 * the Settings → Stats toggles, and the Detailed Totals sheet all derive their
 * sections from this, so moving a stat between sections is a one-line change
 * here (no longer 3 files).
 *
 * Each surface still decides *which* stats it shows (e.g. the compact `mez_*`
 * vs the detailed `prot_*` status-protection variants, or whether to include
 * End Cost / Net End) and how it names or merges sections (the dashboard folds
 * Offense + Movement into "General"; the detailed sheet calls Resistance
 * "Damage Resistance") — only membership and within-section order live here.
 */
export const STAT_SECTIONS: { category: StatCategory; stats: string[] }[] = [
  { category: 'offense', stats: ['damage', 'accuracy', 'tohit', 'recharge', 'range_bonus', 'threat_level', 'level_shift'] },
  { category: 'health-endurance', stats: ['health', 'regeneration', 'heal_other', 'heal_received', 'maxend', 'recovery', 'endreduction', 'endcost', 'netend'] },
  { category: 'movement', stats: ['runspeed', 'flyspeed', 'jumpspeed', 'jumpheight'] },
  { category: 'stealth-perception', stats: ['stealth_pve', 'stealth_pvp', 'perception_bonus'] },
  { category: 'defense', stats: ['defense_melee', 'defense_ranged', 'defense_aoe', 'def_smashing', 'def_lethal', 'def_fire', 'def_cold', 'def_energy', 'def_negative', 'def_psionic', 'def_toxic'] },
  { category: 'resistance', stats: ['res_smashing', 'res_lethal', 'res_fire', 'res_cold', 'res_energy', 'res_negative', 'res_psionic', 'res_toxic'] },
  { category: 'status-protection', stats: ['mez_hold', 'mez_stun', 'mez_immob', 'mez_sleep', 'mez_confuse', 'mez_fear', 'mez_kb', 'prot_hold', 'prot_stun', 'prot_immob', 'prot_sleep', 'prot_confuse', 'prot_fear', 'prot_kb', 'prot_repel', 'prot_teleport'] },
  { category: 'status-resistance', stats: ['mezres_hold', 'mezres_stun', 'mezres_immob', 'mezres_sleep', 'mezres_confuse', 'mezres_fear', 'mezres_kb', 'mezres_taunt', 'mezres_placate'] },
  { category: 'debuff-resistance', stats: ['debuff_slow', 'debuff_defense', 'debuff_recharge', 'debuff_endurance', 'debuff_recovery', 'debuff_tohit', 'debuff_regen', 'debuff_perception'] },
];

/** statId → section category, derived from STAT_SECTIONS. */
export const STAT_CATEGORY: Record<string, StatCategory> = Object.fromEntries(
  STAT_SECTIONS.flatMap(({ category, stats }) => stats.map((s) => [s, category] as const)),
);

/**
 * Group a surface's chosen items into its display sections, ordering items
 * within each section by the canonical STAT_SECTIONS order. `sections` lists the
 * surface's display sections (display name + which categories each contains, in
 * order); only items whose stat id is present in `items` are placed. Empty
 * sections are dropped. Generic over the item shape so callers can group plain
 * stat-id strings (dashboard/detailed) or richer `{stat, label}` rows (config).
 */
export function groupStatsBySection<T, S extends { name: string; categories: StatCategory[] }>(
  items: T[],
  getStatId: (item: T) => string,
  sections: S[],
): (S & { stats: T[] })[] {
  const byId = new Map(items.map((item) => [getStatId(item), item]));
  return sections
    .map((section) => {
      const stats: T[] = [];
      for (const cat of section.categories) {
        const canonical = STAT_SECTIONS.find((s) => s.category === cat)?.stats ?? [];
        for (const id of canonical) {
          const item = byId.get(id);
          if (item !== undefined) stats.push(item);
        }
      }
      return { ...section, stats };
    })
    .filter((section) => section.stats.length > 0);
}
