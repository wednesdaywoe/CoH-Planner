/**
 * Perma tracker calculations
 *
 * A power is "perma" when its effective recharge time is equal to or less than
 * its duration, meaning it can be reactivated immediately when it expires.
 *
 * Formula:
 *   rechargeNeeded = (baseRecharge / duration) - 1  (total +rech% required for perma)
 *   totalRecharge  = slottedRecharge + globalRecharge (combined from slotting + set bonuses)
 *   permaPercent   = totalRecharge / rechargeNeeded * 100  (0% = no bonuses, 100% = perma)
 *   effectiveRecharge = baseRecharge / (1 + totalRecharge)
 */

import type { SelectedPower, Power, PowerEffects } from '@/types';
import { hasSelfDirectedPenalty } from '@/types';
import type { EnhancementBonuses } from './enhancement-values';

export interface PermaInfo {
  /** Base recharge time in seconds */
  baseRecharge: number;
  /** Power duration in seconds */
  duration: number;
  /** Effective recharge after enhancements and global bonuses */
  effectiveRecharge: number;
  /** Total +recharge% needed to reach perma (as decimal, e.g. 2.75 = 275%) */
  rechargeNeeded: number;
  /** Current total +recharge% (slotted + global, as decimal) */
  totalRecharge: number;
  /** Percentage (0-100, capped at 100) — progress toward required recharge */
  permaPercent: number;
  /** True when the power can be kept up permanently */
  isPerma: boolean;
}

/**
 * Upper bound on `recharge/duration - 1` (the +recharge% needed to perma)
 * past which the tracker can never read above ~62% no matter what the
 * player slots. Pinned to the +500% server-side global recharge cap so
 * we only show the tracker on powers where reaching perma is at least
 * theoretically possible. Excludes Rest (+900% needed), Category Five
 * (+750%), Build Up (+800%), and similar "asymptote at ~60%" cases that
 * just confuse the user.
 */
const PRACTICAL_RECHARGE_CAP = 5;

/**
 * Check if a power is eligible for perma tracking.
 *
 * A power is perma-eligible when keeping it active permanently is meaningful:
 * - Must be a Click power. Toggles re-apply on a tick cadence (their
 *   `buffDuration` is per-tick refresh, e.g. 0.75s, not a window between
 *   activations) and Auto powers fire automatically — neither has a perma
 *   gap to close. Charged Armor and other defense toggles were
 *   incorrectly tracked because both have recharge + per-tick duration.
 * - Must have both a recharge time and a duration (buff, effect, or summon)
 * - Must have a SELF-state worth keeping up: a self-buff effect or a pet
 *   summon. Foe-debuff-only attacks (e.g. Suppression's -DEF) populate
 *   `buffDuration` with the foe-debuff duration, but there's nothing on
 *   the caster to perma — the debuff just expires on the target after
 *   each hit, and we don't model debuff-stacking-via-cast-cadence.
 * - Perma must be mathematically achievable. Reject powers whose
 *   recharge/duration ratio exceeds the practical recharge cap (e.g. Rest
 *   at 300s/30s would need +900% recharge, double the practical ceiling).
 * - For powers that deal damage (attacks): require recharge >= 2× duration, since
 *   the duration is typically a hold/mez that roughly matches recharge (Dark Grasp).
 *   This still includes buff-attacks like Soul Drain (120s rech / 30s dur).
 * - For non-damage powers (buffs, summons): require recharge > duration, a looser
 *   threshold that includes Lightning Storm (90s rech / 60s dur).
 */
export function isPermaEligible(power: Power | SelectedPower): boolean {
  const effects = power.effects;
  if (!effects) return false;

  if (power.powerType === 'Toggle' || power.powerType === 'Auto') return false;

  const recharge = getRecharge(effects, power);
  const duration = getDuration(effects);
  if (recharge <= 0 || duration <= 0) return false;

  if (!hasSelfStateToKeepUp(effects)) return false;

  const rechargeNeeded = recharge / duration - 1;
  if (rechargeNeeded > PRACTICAL_RECHARGE_CAP) return false;

  const hasDamage = !!(power as Power).damage;
  return hasDamage ? recharge >= duration * 2 : recharge > duration;
}

/**
 * True when the power applies a self-buff or summons a pet — i.e. there's
 * a caster-side state whose uptime perma tracking actually measures. Foe
 * debuffs and mez don't count: those expire on the target after the cast,
 * and the planner doesn't model the implicit "keep firing the attack to
 * refresh the debuff" pattern. A self-directed debuff (`toWho:'Self'` on
 * Granite Armor etc.) IS a caster-side state, so honour it.
 */
function hasSelfStateToKeepUp(effects: PowerEffects): boolean {
  if (effects.summon?.duration && effects.summon.duration > 0) return true;

  const selfBuffPresent =
    effects.tohitBuff !== undefined ||
    effects.damageBuff !== undefined ||
    effects.defenseBuff !== undefined ||
    effects.defenseBuffSuppressible !== undefined ||
    effects.rechargeBuff !== undefined ||
    effects.recoveryBuff !== undefined ||
    effects.regenBuff !== undefined ||
    effects.regenBuffUnenhanced !== undefined ||
    effects.speedBuff !== undefined ||
    effects.enduranceBuff !== undefined ||
    effects.enduranceGain !== undefined ||
    effects.maxHPBuff !== undefined ||
    effects.maxEndBuff !== undefined ||
    effects.rangeBuff !== undefined ||
    effects.enduranceDiscount !== undefined ||
    effects.perceptionBuff !== undefined ||
    effects.absorb !== undefined ||
    effects.defense !== undefined ||
    effects.resistance !== undefined ||
    effects.elusivity !== undefined ||
    effects.movement !== undefined ||
    effects.stealth !== undefined ||
    effects.debuffResistance !== undefined ||
    effects.mezResistance !== undefined ||
    effects.protection !== undefined ||
    effects.untouchable !== undefined ||
    effects.fly !== undefined;
  if (selfBuffPresent) return true;

  // Self-penalty powers (Granite Armor's -damage, Defensive Adaptation's
  // -recharge) carry a caster-side downside — a self-state whose uptime is
  // worth perma-tracking. Detected per-effect via `toWho:'Self'`.
  if (hasSelfDirectedPenalty(effects)) return true;

  // Absorb shields whose magnitude the converter couldn't fully model still
  // record a duration (Nature Affinity's Wild Bastion delivers its absorb via
  // an Expression-typed template, so only `durations.absorb` survives). An
  // absorb duration is unambiguously a caster/ally buff window — never a foe
  // debuff — so it's a legitimate self-state to perma-track even when the
  // top-level `absorb` value is absent.
  if (effects.durations?.absorb && effects.durations.absorb > 0) return true;

  return false;
}

/**
 * Calculate perma info for a power.
 *
 * @param power - The power definition
 * @param enhBonuses - Enhancement bonuses for the power (from calculatePowerEnhancementBonuses)
 * @param globalRecharge - Global recharge bonus as a decimal (e.g., 0.7 for 70%)
 */
export function calculatePermaInfo(
  power: Power | SelectedPower,
  enhBonuses: EnhancementBonuses,
  globalRecharge: number,
): PermaInfo | null {
  const effects = power.effects;
  if (!effects) return null;

  // Toggles and autos don't have a perma cycle (see isPermaEligible).
  if (power.powerType === 'Toggle' || power.powerType === 'Auto') return null;

  const baseRecharge = getRecharge(effects, power);
  const duration = getDuration(effects);
  if (baseRecharge <= 0 || duration <= 0) return null;

  // StrengthsDisallowed('RechargeTime'): the game applies NO recharge strength
  // to this power — Hasten, set bonuses, and slotted IOs are all ignored (Rune
  // of Protection, the armor T9s, some MM summons). GlobalStrengthsDisallowed
  // keeps slotted enhancement but ignores globals (Kuji-In Rin). Server-side
  // .powers data, HC only; see Power.strengthsDisallowed.
  const rechargeLocked = power.strengthsDisallowed?.includes('RechargeTime') ?? false;
  const globalLocked = rechargeLocked
    || (power.globalStrengthsDisallowed?.includes('RechargeTime') ?? false);
  const slottedRecharge = rechargeLocked ? 0 : (enhBonuses.recharge ?? 0);
  const totalRecharge = slottedRecharge + (globalLocked ? 0 : globalRecharge);
  const effectiveRecharge = baseRecharge / Math.max(1, 1 + totalRecharge);
  const rechargeNeeded = (baseRecharge / duration) - 1; // e.g. 450/120 - 1 = 2.75
  const permaPercent = rechargeNeeded > 0
    ? Math.min(100, (totalRecharge / rechargeNeeded) * 100)
    : 100;

  return {
    baseRecharge,
    duration,
    effectiveRecharge,
    rechargeNeeded,
    totalRecharge,
    permaPercent,
    isPerma: effectiveRecharge <= duration,
  };
}

/** Extract recharge time from effects, falling back to power.stats */
function getRecharge(effects: PowerEffects, power: Power | SelectedPower): number {
  if (typeof effects.recharge === 'number' && effects.recharge > 0) return effects.recharge;
  if (power.stats?.recharge && power.stats.recharge > 0) return power.stats.recharge;
  return 0;
}

/** Extract duration from effects (buffDuration, effectDuration, or summon duration) */
function getDuration(effects: PowerEffects): number {
  if (typeof effects.buffDuration === 'number' && effects.buffDuration > 0) return effects.buffDuration;
  if (typeof effects.effectDuration === 'number' && effects.effectDuration > 0) return effects.effectDuration;
  if (effects.summon?.duration && effects.summon.duration > 0) return effects.summon.duration;
  return 0;
}
