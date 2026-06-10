/**
 * Archetype hit-time damage mechanic resolution — the single source for the
 * InfoPanel's "w/ Crit / Scourge / Containment" column and the Attack Chain
 * builder's DPS. These are MULTIPLICATIVE bonuses applied at hit time, OUTSIDE
 * the damage cap: Scrapper/Stalker/Sentinel crits, Corruptor Scourge,
 * Controller Containment.
 *
 * NOT here: Brute Fury / Defender Vigilance — those are additive
 * damage-strength buffs already folded into globalBonuses.damage (the capped
 * Final), so they're in the base damage and must not be re-applied. And the
 * multiplier does NOT apply to procs (the game crits procs at hit time, but the
 * planner keeps proc averages flat — see power-proc-damage.ts).
 */

import {
  isControllerPower,
  isCorruptorAttackPower,
  isScrapperAttackPower,
  isStalkerAttackPower,
  isSentinelAttackPower,
  calculateScourgeDamage,
  calculateCriticalHitDamage,
  calculateAssassinationDamage,
  calculateContainmentDamage,
  calculateOpportunityCritDamage,
} from './inherents';

export type AtMechanicKind = 'scourge' | 'crit' | 'assassination' | 'containment' | 'opportunity';

export interface AtMechanicContext {
  archetypeId?: string;
  containmentActive: boolean;
  scourgeActive: boolean;
  criticalHitsActive: boolean;
  stalkerCritActive: boolean;
  sentinelCritActive: boolean;
  /** Stalker is hidden (alpha strike) — boosts the assassination crit. */
  effectiveHidden: boolean;
  stalkerTeamSize: number;
}

export interface ResolvedAtMechanic {
  kind: AtMechanicKind;
  /** Linear damage multiplier (≥ 1) — applied to base damage, never procs. */
  multiplier: number;
}

/**
 * The active hit-time AT mechanic for a power in `powersetId` (e.g.
 * "scrapper/dark-melee"), or null when none applies. The mechanic gates on the
 * archetype, the power belonging to a primary/secondary set (not pool/epic),
 * and the relevant toggle being on — mirroring the InfoPanel exactly.
 */
export function resolveAtMechanic(
  powersetId: string,
  ctx: AtMechanicContext,
): ResolvedAtMechanic | null {
  const at = ctx.archetypeId;
  if (at === 'corruptor' && isCorruptorAttackPower(powersetId) && ctx.scourgeActive)
    return { kind: 'scourge', multiplier: calculateScourgeDamage(1) };
  if (at === 'scrapper' && isScrapperAttackPower(powersetId) && ctx.criticalHitsActive)
    return { kind: 'crit', multiplier: calculateCriticalHitDamage(1, 'higher') };
  if (at === 'stalker' && isStalkerAttackPower(powersetId) && ctx.stalkerCritActive)
    return { kind: 'assassination', multiplier: calculateAssassinationDamage(1, ctx.effectiveHidden, ctx.stalkerTeamSize) };
  if (at === 'controller' && isControllerPower(powersetId) && ctx.containmentActive)
    return { kind: 'containment', multiplier: calculateContainmentDamage(1, true) };
  if (at === 'sentinel' && isSentinelAttackPower(powersetId) && ctx.sentinelCritActive)
    return { kind: 'opportunity', multiplier: calculateOpportunityCritDamage(1) };
  return null;
}

/** Convenience: the multiplier (1 when no mechanic is active). */
export function atMechanicMultiplier(powersetId: string, ctx: AtMechanicContext): number {
  return resolveAtMechanic(powersetId, ctx)?.multiplier ?? 1;
}
