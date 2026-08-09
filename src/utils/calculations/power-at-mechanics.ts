/**
 * Archetype hit-time damage mechanic resolution — the single source for the
 * InfoPanel's "w/ Crit / Scourge / Containment" column and the Attack Chain
 * builder's DPS. These apply at hit time, OUTSIDE the damage cap:
 * Scrapper/Stalker/Sentinel crits, Corruptor Scourge, Controller Containment.
 *
 * The Scrapper crit is the one mechanic whose per-power truth the display
 * surfaces now read instead of a multiplier: the export gives each power its
 * own crit rows (scale, table, chance, rank fork), the engine resolves them
 * against a named target rank (`usePowerDamageVsRank`), and the helpers below
 * (`critComponents` / `critBranchSummary`) reduce that ledger for display.
 * `resolveAtMechanic`'s flat ×1.10 crit remains ONLY as the Attack Chain's
 * chance-averaged DPS model.
 *
 * NOT here: Brute Fury / Defender Vigilance — those are additive
 * damage-strength buffs already folded into globalBonuses.damage (the capped
 * Final), so they're in the base damage and must not be re-applied. And the
 * mechanics do NOT apply to procs (the game crits procs at hit time, but the
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
import type { PowerDamage, PowerDamageComponent } from '@/engine/engineTotalsMap';

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
 * and the relevant toggle being on — the same gating the InfoPanel applies
 * (for `kind: 'crit'` the panel keeps the gate but swaps the multiplier for
 * the power's own crit rows — see module doc).
 */
export function resolveAtMechanic(
  powersetId: string,
  ctx: AtMechanicContext,
  fromHideBonus?: number,
): ResolvedAtMechanic | null {
  const at = ctx.archetypeId;
  if (at === 'corruptor' && isCorruptorAttackPower(powersetId) && ctx.scourgeActive)
    return { kind: 'scourge', multiplier: calculateScourgeDamage(1) };
  if (at === 'scrapper' && isScrapperAttackPower(powersetId) && ctx.criticalHitsActive)
    // Chance-averaged model, read ONLY by the Attack Chain's DPS. The info surfaces
    // override this kind with the power's own crit rows (see module doc).
    return { kind: 'crit', multiplier: calculateCriticalHitDamage(1, 'higher') };
  if (at === 'stalker' && isStalkerAttackPower(powersetId) && ctx.stalkerCritActive)
    // fromHideBonus is per-power (Assassin's Strike): when hidden it replaces the
    // generic +100% crit with the real Assassination multiplier (+208–240%).
    return { kind: 'assassination', multiplier: calculateAssassinationDamage(1, ctx.effectiveHidden, ctx.stalkerTeamSize, fromHideBonus) };
  if (at === 'controller' && isControllerPower(powersetId) && ctx.containmentActive)
    return { kind: 'containment', multiplier: calculateContainmentDamage(1, true) };
  if (at === 'sentinel' && isSentinelAttackPower(powersetId) && ctx.sentinelCritActive)
    return { kind: 'opportunity', multiplier: calculateOpportunityCritDamage(1) };
  return null;
}

/** Convenience: the multiplier (1 when no mechanic is active). */
export function atMechanicMultiplier(powersetId: string, ctx: AtMechanicContext, fromHideBonus?: number): number {
  return resolveAtMechanic(powersetId, ctx, fromHideBonus)?.multiplier ?? 1;
}

/**
 * The export's own rank segments the crit surfaces project against. Presentation-level
 * choices, not data: the "w/ Crit" column has always claimed the crit's vs-higher branch
 * (the lieutenant rank is its lowest member), and the info card's second line shows the
 * vs-minion branch. The tokens themselves stay the export's — the segment only picks a rank
 * out of the engine's derived vocabulary (`targetRanksJson`), mirroring the rebuild combat
 * panel's `LIEUTENANT_SEGMENT` precedent.
 */
export const VS_HIGHER_RANK_SEGMENT = 'Lt';
export const VS_MINION_RANK_SEGMENT = 'Minion';

/**
 * The chance components of a target-resolved damage ledger — the further-hit rows the
 * export states with their own scale, table and probability. Against a critter target of a
 * single rank these are the archetype's crit for that rank (the Scrapper crit rows gate on
 * rank; certain components are `'always'`, inert riders `'dormant'`).
 */
export function critComponents(damage: PowerDamage | null): PowerDamageComponent[] {
  return (damage?.components ?? []).filter((c) => typeof c.application === 'number');
}

/**
 * One branch of the crit fork, summarized for a display row: what a critical actually adds
 * (`finalTotal`, at the build's enhancement) and the export's own odds. `null` when the
 * power ships no crit row against this target — the surface shows nothing rather than a
 * flat archetype constant (the ×1.10 this replaced understated One Thousand Cuts' crit
 * component 8×, and misstated Sweeping Strike's 15% roll as 10%).
 */
export function critBranchSummary(damage: PowerDamage | null): { finalTotal: number; chanceLabel: string } | null {
  const rows = critComponents(damage);
  if (rows.length === 0) return null;
  const finalTotal = rows.reduce((sum, c) => sum + c.total.final, 0);
  const chances = [...new Set(rows.map((c) => `${Math.round((c.application as number) * 100)}%`))];
  return { finalTotal, chanceLabel: chances.join('/') };
}

/**
 * Apply a hit-time mechanic multiplier to a final damage value, stepping around the
 * slice that the mechanic does not multiply.
 *
 * `exempt` is the part of `value` carried by damage entries flagged
 * `excludeFromAtMechanic` — Gravity Control's Impact, whose bonus group the game
 * never duplicates onto an `*_InherentDamage` table. Containment therefore doubles
 * Propel's base damage and leaves Impact alone: `1.96 × 2 + 0.49`, not
 * `(1.96 + 0.49) × 2` (which overstates a Controller's Propel by ~11%).
 *
 * With `exempt = 0` this is the plain `value × multiplier` every other power gets.
 */
export function applyAtMechanicBonus(value: number, multiplier: number, exempt = 0): number {
  // Clamp so a caller that mismatches the two (e.g. a pure-DoT power whose direct
  // tier isn't in `value`) can never subtract more than is there.
  const safeExempt = Math.min(Math.max(exempt, 0), value);
  return (value - safeExempt) * multiplier + safeExempt;
}
