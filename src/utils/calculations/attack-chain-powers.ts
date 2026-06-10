/**
 * Attack Chain Builder — data wiring.
 *
 * Derives `ChainPower[]` and the character endurance parameters from the LIVE
 * build, reusing the same calc functions the power tooltips use so the chain's
 * numbers match the rest of the app. Pure scheduling/endurance math lives in
 * `attack-chain.ts`; this layer is the only part that touches build/data.
 */

import type { Build, SelectedPower } from '@/types';
import { getIOSet, arcToDegrees } from '@/data';
import {
  calculatePowerEnhancementBonuses,
  calculatePowerDamage,
  calculateArcanaTime,
  calculateCharacterTotals,
} from '@/utils/calculations';
import { calcThreeTier, convertGlobalBonusesToAspects } from '@/components/info/powerDisplayUtils';
import { calculateSlottedProcDamagePerCast } from './power-proc-damage';
import { atMechanicMultiplier, type AtMechanicContext } from './power-at-mechanics';
import type { ChainPower, ChainPowerType, EnduranceParams } from './attack-chain';

type CalcResult = ReturnType<typeof calculateCharacterTotals>;
type GlobalBonuses = CalcResult['globalBonuses'];

interface Candidate {
  power: SelectedPower;
  powersetName: string;
  /** Powerset id (e.g. "scrapper/dark-melee") — gates the AT crit mechanic. */
  powersetId: string;
  category?: 'PRIMARY' | 'SECONDARY';
  /** stable bucket prefix so ids don't collide across sets/pools. */
  bucket: string;
}

/** Click powers (attacks, click buffs, click controls) from every powerset.
 *  Toggles/autos/passives can't sit in an attack chain, so they're excluded. */
function collectCandidates(build: Build): Candidate[] {
  const out: Candidate[] = [];
  const add = (
    powers: SelectedPower[] | undefined,
    powersetName: string,
    powersetId: string,
    bucket: string,
    category?: 'PRIMARY' | 'SECONDARY',
  ) => {
    powers?.forEach((p) => {
      if (p.powerType !== 'Click') return;
      if (p.isAutoGranted) return;
      if (p.stats?.castTime === undefined) return;
      out.push({ power: p, powersetName, powersetId, category, bucket });
    });
  };
  add(build.primary?.powers, build.primary?.name ?? 'Primary', build.primary?.id ?? '', 'pri', 'PRIMARY');
  add(build.secondary?.powers, build.secondary?.name ?? 'Secondary', build.secondary?.id ?? '', 'sec', 'SECONDARY');
  build.pools?.forEach((pool, i) => add(pool.powers, pool.name ?? 'Pool', pool.id ?? '', `pool${i}`));
  add(build.epicPool?.powers, build.epicPool?.name ?? 'Epic', build.epicPool?.id ?? '', 'epic');
  return out;
}

/** Build the per-power chain data for the current build. */
export function buildChainPowers(
  build: Build,
  globalBonuses: GlobalBonuses,
  mechCtx: AtMechanicContext,
): ChainPower[] {
  const globalForCalc = convertGlobalBonusesToAspects(globalBonuses);
  const archetypeId = build.archetype?.id ?? undefined;

  return collectCandidates(build).map(({ power, powersetName, powersetId, category, bucket }) => {
    const enh = calculatePowerEnhancementBonuses(
      { name: power.name, slots: power.slots },
      build.level,
      getIOSet,
    );

    const baseRecharge = power.stats?.recharge ?? 0;
    const baseEnd = power.stats?.endurance ?? 0;
    const cast = calculateArcanaTime(power.stats?.castTime ?? 0);
    const endCost = calcThreeTier('endurance', baseEnd, enh, globalForCalc).final;

    // Direct + DoT damage, fully enhanced + global +damage (which already folds
    // in additive strength buffs like Brute Fury / Defender Vigilance). The
    // multiplicative AT mechanics (crit/scourge/containment) are applied below.
    const hasDamage = !!power.damage || !!power.effects?.damage;
    const dmg = hasDamage
      ? calculatePowerDamage(
          power,
          { level: build.level, archetypeId, primaryName: powersetName, primaryCategory: category },
          { damage: enh.damage || 0 },
          globalForCalc.damage ?? 0,
          0,
        )
      : null;

    // Pure-DoT powers (Shadow Maul, Gloom, Disintegrate) carry the PER-TICK
    // value in `final` (the calc copies dotDamage.base into base), so there's
    // no separate direct hit and the real damage is the DoT total. Mirror
    // DamageBlock's pure-DoT detection so a tick isn't double-counted.
    const dotData = dmg?.dotDamage ?? null;
    const isPureDot = dotData ? Math.abs((dmg?.base ?? 0) - dotData.base) <= 0.001 : false;
    const directHit = isPureDot ? 0 : (dmg?.final ?? 0);
    const dotTotal = dotData ? dotData.final * dotData.ticks : 0;

    // In-cast vs after-cast DoT. A DoT whose duration fits inside the cast
    // animation ticks DURING the swing — only Shadow Maul-style flurries — so
    // fold it into the hit, draw no trailing marks, and never truncate it. A
    // DoT that outlasts the animation lingers AFTER the cast (Midnight Grasp,
    // Gloom, Disintegrate, the fire-blast burns) — draw trailing marks and let
    // them truncate at the loop boundary. Verified against in-game DoT timing.
    const rawCast = power.stats?.castTime ?? 0;
    const dotInCast = !!dotData && dotData.duration > 0 && dotData.duration <= rawCast + 0.05;

    // Expected slotted-proc damage per cast — the same helper the DamageBlock
    // "+proc" annotation uses, so the chain DPS matches the power tooltip.
    // Proc chance keys off base + LOCAL recharge, never global.
    const radius = power.stats?.radius ?? 0;
    const procDmg = calculateSlottedProcDamagePerCast({
      slots: power.slots,
      baseRecharge,
      castTime: rawCast,
      radius,
      arcDegrees: radius > 0 ? (arcToDegrees(power.stats?.arc) || 360) : 360,
      rechargeEnh: enh.recharge || 0,
      buildLevel: build.level,
    });

    // AT hit-time multiplier (crit / scourge / containment / assassination /
    // opportunity) — applies to base damage + DoT, NOT procs. Single-sourced
    // with the InfoPanel via resolveAtMechanic. 1.0 when no mechanic is active.
    const mechMult = atMechanicMultiplier(powersetId, mechCtx);

    // Trailing marks only for after-cast DoT; in-cast DoT is already in `damage`.
    const dot = dotData && !dotInCast
      ? { ticks: dotData.ticks, period: dotData.tickRate, perTick: dotData.final * mechMult }
      : null;
    // Always-counted damage = (hit + in-cast DoT) × AT mult + procs. After-cast
    // DoT ticks (already × mult) are added per-tick by the chain math.
    const damage = mechMult * (directHit + (dotInCast ? dotTotal : 0)) + procDmg;
    const type: ChainPowerType = damage > 0 || dot ? 'attack' : 'utility';

    return {
      id: `${bucket}:${power.internalName}`,
      name: power.name,
      type,
      cast,
      baseRecharge,
      rechargeEnh: enh.recharge || 0,
      endCost,
      damage,
      dot,
    } satisfies ChainPower;
  });
}

/** Character endurance parameters for the sustainability sim. */
export function getEnduranceParams(globalBonuses: GlobalBonuses): EnduranceParams {
  const maxEnd = 100 + (globalBonuses.maxEndurance || 0);
  return {
    maxEnd,
    recoveryPerSec: (maxEnd / 60) * (1 + (globalBonuses.recovery || 0) / 100),
    togglePerSec: globalBonuses.toggleEndCost || 0,
  };
}

/** The build's global recharge bonus as a percentage (e.g. 70 = +70%). */
export function getBuildGlobalRecharge(globalBonuses: GlobalBonuses): number {
  return globalBonuses.recharge || 0;
}

// ---------------------------------------------------------------------------
// Saved-chain persistence: convert between the runtime pi-sequence (indices
// into ChainPower[]) and the stable id list stored on the build. Storing
// indices would break the moment the build's power set changes; ids
// ("bucket:internalName") are stable, so a saved chain survives reload, export,
// and share — and gracefully drops any power that's no longer picked.
// ---------------------------------------------------------------------------

/** The stable internalName portion of a ChainPower id ("bucket:internalName").
 *  Fallback match key so a saved chain survives pool-slot reshuffles (which can
 *  change the bucket prefix) as long as the power is still in the build. */
function chainIdInternalName(id: string): string {
  const i = id.indexOf(':');
  return i >= 0 ? id.slice(i + 1) : id;
}

/** A working pi-sequence → the stable id list stored in a saved AttackChain. */
export function sequenceToIds(powers: ChainPower[], sequence: number[]): string[] {
  return sequence.map((pi) => powers[pi]?.id).filter((id): id is string => !!id);
}

/** A saved AttackChain's id list → a pi-sequence for the CURRENT build's
 *  powers. Matches each id exactly, then falls back to its internalName; ids
 *  with no surviving power are dropped. */
export function idsToSequence(powers: ChainPower[], ids: string[]): number[] {
  const out: number[] = [];
  for (const id of ids) {
    let pi = powers.findIndex((p) => p.id === id);
    if (pi < 0) {
      const inm = chainIdInternalName(id);
      pi = powers.findIndex((p) => chainIdInternalName(p.id) === inm);
    }
    if (pi >= 0) out.push(pi);
  }
  return out;
}
