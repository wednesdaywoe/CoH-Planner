/**
 * Perma tracker calculations
 *
 * A power is "perma" when its effective recharge time is equal to or less than
 * its duration, meaning it can be reactivated immediately when it expires.
 *
 * Formula:
 *   effectiveRecharge = baseRecharge / (1 + slottedRecharge) / (1 + globalRecharge)
 *   permaRatio = duration / effectiveRecharge  (1.0 = perma, <1.0 = not perma)
 */

import type { SelectedPower, Power, PowerEffects } from '@/types';
import type { EnhancementBonuses } from './enhancement-values';

export interface PermaInfo {
  /** Base recharge time in seconds */
  baseRecharge: number;
  /** Power duration in seconds */
  duration: number;
  /** Effective recharge after enhancements and global bonuses */
  effectiveRecharge: number;
  /** Duration / effectiveRecharge — at 1.0+ the power is perma */
  permaRatio: number;
  /** Percentage (0-100, capped at 100) */
  permaPercent: number;
  /** True when the power can be kept up permanently */
  isPerma: boolean;
}

/**
 * Check if a power is eligible for perma tracking.
 *
 * A power is perma-eligible when keeping it active permanently is meaningful:
 * - Must have both a recharge time and a duration (buff, effect, or summon)
 * - For powers that deal damage (attacks): require recharge >= 2× duration, since
 *   the duration is typically a hold/mez that roughly matches recharge (Dark Grasp).
 *   This still includes buff-attacks like Soul Drain (120s rech / 30s dur).
 * - For non-damage powers (buffs, summons): require recharge > duration, a looser
 *   threshold that includes Lightning Storm (90s rech / 60s dur).
 */
export function isPermaEligible(power: Power | SelectedPower): boolean {
  const effects = power.effects;
  if (!effects) return false;

  const recharge = getRecharge(effects, power);
  const duration = getDuration(effects);
  if (recharge <= 0 || duration <= 0) return false;

  const hasDamage = !!(power as Power).damage;
  return hasDamage ? recharge >= duration * 2 : recharge > duration;
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

  const baseRecharge = getRecharge(effects, power);
  const duration = getDuration(effects);
  if (baseRecharge <= 0 || duration <= 0) return null;

  const slottedRecharge = enhBonuses.recharge ?? 0;
  const effectiveRecharge = baseRecharge / Math.max(1, 1 + slottedRecharge) / Math.max(1, 1 + globalRecharge);
  const permaRatio = duration / effectiveRecharge;
  const permaPercent = Math.min(100, permaRatio * 100);

  return {
    baseRecharge,
    duration,
    effectiveRecharge,
    permaRatio,
    permaPercent,
    isPerma: permaRatio >= 1.0,
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
