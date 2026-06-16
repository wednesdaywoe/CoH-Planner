/**
 * Quick-cast snipe form.
 *
 * Snipe powers carry a `quickSnipe` variant (fast cast, higher damage) that
 * applies when the build is in combat mode (Experienced Marksman / sustained
 * combat ToHit). This returns the power with the quick-snipe stats and damage
 * merged in, or the power unchanged when combat mode is off or the power has no
 * snipe form.
 *
 * Single-sourced so the InfoPanel damage display and `useBuildMaxAttackDamage`
 * (the damage-bar normalization reference) apply the SAME adjustment. If they
 * diverged, a fast snipe's bar numerator (boosted damage) would be normalized
 * against a reference computed from its slow damage and clamp to 100% — and the
 * understated reference could push other powers' bars to 100% too.
 */
import type { Power } from '@/types';

export function applyQuickSnipe<T extends Power>(power: T, combatMode: boolean): T {
  if (!combatMode || !power.quickSnipe) return power;
  const qs = power.quickSnipe;
  return {
    ...power,
    // The fast (in-combat) snipe has no interruptible channel, so clear the base
    // form's interruptTime when swapping — otherwise it carries over stale.
    stats: power.stats ? { ...power.stats, ...qs.stats, interruptTime: undefined } : power.stats,
    damage: qs.damage,
    // Epic-pool powers store cast/range/accuracy in `effects` rather than `stats`.
    effects: power.effects
      ? {
          ...power.effects,
          ...(qs.stats.castTime != null && { castTime: qs.stats.castTime }),
          ...(qs.stats.range != null && { range: qs.stats.range }),
          ...(qs.stats.accuracy != null && { accuracy: qs.stats.accuracy }),
        }
      : power.effects,
  } as T;
}
