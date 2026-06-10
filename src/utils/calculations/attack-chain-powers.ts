/**
 * Attack Chain Builder — data wiring.
 *
 * Derives `ChainPower[]` and the character endurance parameters from the LIVE
 * build, reusing the same calc functions the power tooltips use so the chain's
 * numbers match the rest of the app. Pure scheduling/endurance math lives in
 * `attack-chain.ts`; this layer is the only part that touches build/data.
 */

import type { Build, SelectedPower } from '@/types';
import { getIOSet } from '@/data';
import {
  calculatePowerEnhancementBonuses,
  calculatePowerDamage,
  calculateArcanaTime,
  calculateCharacterTotals,
} from '@/utils/calculations';
import { calcThreeTier, convertGlobalBonusesToAspects } from '@/components/info/powerDisplayUtils';
import type { ChainPower, ChainPowerType, EnduranceParams } from './attack-chain';

type CalcResult = ReturnType<typeof calculateCharacterTotals>;
type GlobalBonuses = CalcResult['globalBonuses'];

interface Candidate {
  power: SelectedPower;
  powersetName: string;
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
    bucket: string,
    category?: 'PRIMARY' | 'SECONDARY',
  ) => {
    powers?.forEach((p) => {
      if (p.powerType !== 'Click') return;
      if (p.isAutoGranted) return;
      if (p.stats?.castTime === undefined) return;
      out.push({ power: p, powersetName, category, bucket });
    });
  };
  add(build.primary?.powers, build.primary?.name ?? 'Primary', 'pri', 'PRIMARY');
  add(build.secondary?.powers, build.secondary?.name ?? 'Secondary', 'sec', 'SECONDARY');
  build.pools?.forEach((pool, i) => add(pool.powers, pool.name ?? 'Pool', `pool${i}`));
  add(build.epicPool?.powers, build.epicPool?.name ?? 'Epic', 'epic');
  return out;
}

/** Build the per-power chain data for the current build. */
export function buildChainPowers(build: Build, globalBonuses: GlobalBonuses): ChainPower[] {
  const globalForCalc = convertGlobalBonusesToAspects(globalBonuses);
  const archetypeId = build.archetype?.id ?? undefined;

  return collectCandidates(build).map(({ power, powersetName, category, bucket }) => {
    const enh = calculatePowerEnhancementBonuses(
      { name: power.name, slots: power.slots },
      build.level,
      getIOSet,
    );

    const baseRecharge = power.stats?.recharge ?? 0;
    const baseEnd = power.stats?.endurance ?? 0;
    const cast = calculateArcanaTime(power.stats?.castTime ?? 0);
    const endCost = calcThreeTier('endurance', baseEnd, enh, globalForCalc).final;

    // Direct + DoT damage, fully enhanced + global +damage. Procs and AT crit
    // mechanics (scourge/containment/fury/crits) aren't folded in yet — v1
    // shows base+DoT, which is what most attacks read on the tooltip.
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

    const direct = dmg?.final ?? 0;
    const dot = dmg?.dotDamage
      ? { ticks: dmg.dotDamage.ticks, period: dmg.dotDamage.tickRate, perTick: dmg.dotDamage.final }
      : null;
    const type: ChainPowerType = direct > 0 || dot ? 'attack' : 'utility';

    return {
      id: `${bucket}:${power.internalName}`,
      name: power.name,
      type,
      cast,
      baseRecharge,
      rechargeEnh: enh.recharge || 0,
      endCost,
      damage: direct, // DoT is added per-tick by the chain math (no double-count)
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
