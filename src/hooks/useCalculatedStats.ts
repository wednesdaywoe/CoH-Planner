/**
 * Calculated Stats Hooks
 *
 * These hooks compute derived statistics from the build state using
 * the unified calculation system that handles:
 * - Set bonuses with Rule of 5
 * - Active power buffs
 * - Inherent power bonuses
 * - Stat breakdown tracking for tooltips
 */

import { useMemo } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import { getIOSet } from '@/data';
import type { SetBonus } from '@/types';
import type { ProcSettings } from '@/stores/uiStore';
import type { BonusTracking } from '@/utils/calculations';
import {
  calculateCharacterTotals,
  type CharacterStats,
  type CharacterCalculationResult,
  type DashboardStatBreakdown,
  type StatSource,
} from '@/utils/calculations';

/** All procs disabled — used when master Proc toggle is off */
const ALL_PROCS_DISABLED: ProcSettings = {
  damage: false, recovery: false, regeneration: false, recharge: false,
  toHit: false, defense: false, resistance: false, buildUp: false, movement: false,
};

// ============================================
// RE-EXPORT TYPES
// ============================================

export type { CharacterStats, DashboardStatBreakdown, StatSource };

// ============================================
// LEGACY INTERFACE (for backward compatibility)
// ============================================

export interface CalculatedStats {
  // Damage
  damageBuff: number;

  // Accuracy
  accuracyBuff: number;
  toHitBuff: number;

  // Recharge
  rechargeBuff: number;

  // Endurance
  enduranceReduction: number;
  maxEndurance: number;
  recoveryBuff: number;

  // Defense (by type)
  defense: {
    smashing: number;
    lethal: number;
    fire: number;
    cold: number;
    energy: number;
    negative: number;
    psionic: number;
    toxic: number;
    melee: number;
    ranged: number;
    aoe: number;
  };

  // Resistance (by type)
  resistance: {
    smashing: number;
    lethal: number;
    fire: number;
    cold: number;
    energy: number;
    negative: number;
    psionic: number;
    toxic: number;
  };

  // Health
  maxHP: number;
  hpBuff: number;
  regenBuff: number;

  // Movement
  runSpeed: number;
  jumpHeight: number;
  jumpSpeed: number;
  flySpeed: number;

  // Mez Resistance
  mezResistance: {
    hold: number;
    stun: number;
    immobilize: number;
    sleep: number;
    confuse: number;
    fear: number;
    knockback: number;
  };

  // Mez Protection (magnitude points)
  mezProtection: {
    hold: number;
    stun: number;
    immobilize: number;
    sleep: number;
    confuse: number;
    fear: number;
    knockback: number;
  };

  // Debuff Resistance
  debuffResistance: {
    slow: number;
    defense: number;
    recharge: number;
    endurance: number;
    recovery: number;
    tohit: number;
    regeneration: number;
    perception: number;
  };

  // Global modifiers from set bonuses
  globalRecharge: number;
  globalAccuracy: number;
  globalDamage: number;
}

// ============================================
// CONVERSION HELPERS
// ============================================

/**
 * Convert new CharacterStats to legacy CalculatedStats format
 */
export function convertToLegacyStats(
  charStats: CharacterStats,
  result: CharacterCalculationResult
): CalculatedStats {
  const global = result.globalBonuses;

  return {
    // Offense
    damageBuff: charStats.damage,
    accuracyBuff: charStats.accuracy,
    toHitBuff: charStats.tohit,
    rechargeBuff: charStats.recharge,
    enduranceReduction: charStats.endrdx,
    maxEndurance: 100 + global.maxEndurance,
    recoveryBuff: charStats.recovery,

    // Defense
    defense: {
      smashing: global.defSmashing,
      lethal: global.defLethal,
      fire: global.defFire,
      cold: global.defCold,
      energy: global.defEnergy,
      negative: global.defNegative,
      psionic: global.defPsionic,
      toxic: global.defToxic,
      melee: global.defMelee,
      ranged: global.defRanged,
      aoe: global.defAoE,
    },

    // Resistance
    resistance: {
      smashing: global.resSmashing,
      lethal: global.resLethal,
      fire: global.resFire,
      cold: global.resCold,
      energy: global.resEnergy,
      negative: global.resNegative,
      psionic: global.resPsionic,
      toxic: global.resToxic,
    },

    // Health
    maxHP: global.maxHP,
    hpBuff: global.maxHP,
    regenBuff: charStats.regeneration,

    // Movement
    runSpeed: charStats.runspeed,
    jumpHeight: charStats.jumpheight,
    jumpSpeed: charStats.jumpspeed,
    flySpeed: charStats.flyspeed,

    // Mez Resistance: generic (from IO sets) + per-type (from active power effects)
    mezResistance: {
      hold: global.mezResist + global.mezResistHold,
      stun: global.mezResist + global.mezResistStun,
      immobilize: global.mezResist + global.mezResistImmobilize,
      sleep: global.mezResist + global.mezResistSleep,
      confuse: global.mezResist + global.mezResistConfuse,
      fear: global.mezResist + global.mezResistFear,
      knockback: global.mezResist + global.mezResistKnockback,
    },

    // Mez Protection (per-type magnitude from active powers + IO sets)
    mezProtection: {
      hold: global.protHold,
      stun: global.protStun,
      immobilize: global.protImmobilize,
      sleep: global.protSleep,
      confuse: global.protConfuse,
      fear: global.protFear,
      knockback: global.protKnockback,
    },

    // Debuff Resistance
    debuffResistance: {
      slow: charStats.debuffResistSlow,
      defense: charStats.debuffResistDefense,
      recharge: charStats.debuffResistRecharge,
      endurance: charStats.debuffResistEndurance,
      recovery: charStats.debuffResistRecovery,
      tohit: charStats.debuffResistToHit,
      regeneration: charStats.debuffResistRegeneration,
      perception: charStats.debuffResistPerception,
    },

    // Global modifiers
    globalRecharge: charStats.recharge,
    globalAccuracy: charStats.accuracy,
    globalDamage: charStats.damage,
  };
}

// ============================================
// MAIN HOOKS
// ============================================

/**
 * Full calculation result with breakdown data
 */
export function useCharacterCalculation(): CharacterCalculationResult {
  const build = useBuildStore((state) => state.build);
  const exemplarMode = useUIStore((state) => state.exemplarMode);
  const exemplarLevel = useUIStore((state) => state.exemplarLevel);
  const incarnateActive = useUIStore((state) => state.incarnateActive);
  const incarnateLevelShiftActive = useUIStore((state) => state.incarnateLevelShiftActive);
  const procSettings = useUIStore((state) => state.procSettings);
  const procsEnabled = useUIStore((state) => state.includeProcDamageInDPS);
  const targetsHitValues = useUIStore((state) => state.targetsHitValues);
  const targetLevelOffset = useUIStore((state) => state.targetLevelOffset);
  const vigilanceTeamSize = useUIStore((state) => state.vigilanceTeamSize);
  const furyLevel = useUIStore((state) => state.furyLevel);
  const combatMode = useUIStore((state) => state.combatMode);

  // When master Proc toggle is off, disable all proc categories
  const effectiveProcSettings = procsEnabled ? procSettings : ALL_PROCS_DISABLED;

  return useMemo(() => {
    return calculateCharacterTotals(build, exemplarMode, incarnateActive, {
      procSettings: effectiveProcSettings,
      targetsHitValues,
      exemplarLevel: exemplarMode ? exemplarLevel : undefined,
      targetLevelOffset,
      vigilanceTeamSize,
      furyLevel,
      incarnateLevelShiftActive,
      combatMode,
    });
  }, [build, exemplarMode, exemplarLevel, incarnateActive, incarnateLevelShiftActive, effectiveProcSettings, targetsHitValues, targetLevelOffset, vigilanceTeamSize, furyLevel, combatMode]);
}

/**
 * Calculate all derived stats from the current build (legacy format)
 */
export function useCalculatedStats(): CalculatedStats {
  const build = useBuildStore((state) => state.build);
  const exemplarMode = useUIStore((state) => state.exemplarMode);
  const exemplarLevel = useUIStore((state) => state.exemplarLevel);
  const incarnateActive = useUIStore((state) => state.incarnateActive);
  const incarnateLevelShiftActive = useUIStore((state) => state.incarnateLevelShiftActive);
  const procSettings = useUIStore((state) => state.procSettings);
  const procsEnabled = useUIStore((state) => state.includeProcDamageInDPS);
  const targetsHitValues = useUIStore((state) => state.targetsHitValues);
  const vigilanceTeamSize = useUIStore((state) => state.vigilanceTeamSize);
  const furyLevel = useUIStore((state) => state.furyLevel);
  const combatMode = useUIStore((state) => state.combatMode);

  // When master Proc toggle is off, disable all proc categories
  const effectiveProcSettings = procsEnabled ? procSettings : ALL_PROCS_DISABLED;

  return useMemo(() => {
    const result = calculateCharacterTotals(build, exemplarMode, incarnateActive, {
      procSettings: effectiveProcSettings,
      targetsHitValues,
      exemplarLevel: exemplarMode ? exemplarLevel : undefined,
      vigilanceTeamSize,
      furyLevel,
      incarnateLevelShiftActive,
      combatMode,
    });
    return convertToLegacyStats(result.stats, result);
  }, [build, exemplarMode, exemplarLevel, incarnateActive, incarnateLevelShiftActive, effectiveProcSettings, targetsHitValues, vigilanceTeamSize, furyLevel, combatMode]);
}

/**
 * Get character stats in new format
 */
export function useCharacterStats(): CharacterStats {
  const result = useCharacterCalculation();
  return result.stats;
}

/**
 * Get global bonuses that affect all powers
 */
export function useGlobalBonuses() {
  const result = useCharacterCalculation();
  return result.globalBonuses;
}

/**
 * Get breakdown for a specific stat (for tooltips)
 */
export function useStatBreakdown(stat: string): DashboardStatBreakdown | undefined {
  const result = useCharacterCalculation();
  return result.breakdown.get(stat);
}

// ============================================
// INDIVIDUAL STAT HOOKS
// ============================================

/**
 * Get just the global recharge bonus
 */
export function useGlobalRecharge(): number {
  const result = useCharacterCalculation();
  return result.globalBonuses.recharge;
}

/**
 * Get defense stats
 */
export function useDefenseStats(): CalculatedStats['defense'] {
  const stats = useCalculatedStats();
  return stats.defense;
}

/**
 * Get resistance stats
 */
export function useResistanceStats(): CalculatedStats['resistance'] {
  const stats = useCalculatedStats();
  return stats.resistance;
}

/**
 * Get HP-related stats
 */
export function useHealthStats() {
  const result = useCharacterCalculation();
  return {
    maxHP: result.globalBonuses.maxHP,
    hpBuff: result.globalBonuses.maxHP,
    regenBuff: result.globalBonuses.regeneration,
  };
}

// ============================================
// SLOT COUNTING HOOKS
// ============================================

/**
 * Count total enhancement slots used
 */
export function useTotalSlotsUsed(): number {
  return useBuildStore((state) => state.getTotalSlotsUsed());
}

/**
 * Count remaining enhancement slots
 */
export function useSlotsRemaining(): number {
  return useBuildStore((state) => state.getSlotsRemaining());
}

/**
 * Count powers taken at each level
 */
export function usePowersPerLevel(): Map<number, number> {
  const build = useBuildStore((state) => state.build);

  return useMemo(() => {
    const levelMap = new Map<number, number>();

    const countPowers = (powers: { level: number }[]) => {
      for (const power of powers) {
        const current = levelMap.get(power.level) || 0;
        levelMap.set(power.level, current + 1);
      }
    };

    countPowers(build.primary.powers);
    countPowers(build.secondary.powers);
    build.pools.forEach((pool) => countPowers(pool.powers));
    if (build.epicPool) countPowers(build.epicPool.powers);

    return levelMap;
  }, [build]);
}

/**
 * Get all active set bonuses with details
 */
export function useActiveSetBonuses(): Array<{
  setId: string;
  setName: string;
  piecesSlotted: number;
  bonuses: SetBonus[];
}> {
  const build = useBuildStore((state) => state.build);

  return useMemo(() => {
    const results: Array<{
      setId: string;
      setName: string;
      piecesSlotted: number;
      bonuses: SetBonus[];
    }> = [];

    for (const [setId, tracking] of Object.entries(build.sets)) {
      const ioSet = getIOSet(setId);
      if (!ioSet) continue;

      const activeBonuses = ioSet.bonuses.filter((b) => b.pieces <= tracking.count);

      if (activeBonuses.length > 0) {
        results.push({
          setId,
          setName: ioSet.name,
          piecesSlotted: tracking.count,
          bonuses: activeBonuses,
        });
      }
    }

    return results;
  }, [build.sets]);
}

/**
 * Get Rule of 5 bonus tracking data for displaying (x/5) indicators
 */
export function useBonusTracking(): BonusTracking {
  const result = useCharacterCalculation();
  return result.bonusTracking;
}

/**
 * Set of `power.name` values that contribute to *any* (stat, value) bucket
 * that's hit the Rule of 5 — including the 5 accepted sources, not just the
 * rejected 6th+. Highlighting only the rejected source would imply that
 * removing that specific power is the fix, but the 6 powers are
 * interchangeable: any of them being unslotted resolves the cap. Returns an
 * empty set when Bonus Cap Alert is disabled so callers can ungate without
 * an extra branch.
 */
export function useOffendingPowerNames(): Set<string> {
  const enabled = useUIStore((s) => s.ruleOf5AlertEnabled);
  const { breakdown } = useCharacterCalculation();

  return useMemo(() => {
    const offending = new Set<string>();
    if (!enabled) return offending;
    for (const stat of breakdown.values()) {
      // Group this stat's sources by value (the Rule of 5 fires per
      // (stat, value) bucket). If any source in a bucket is capped, every
      // power in that bucket is part of the issue.
      const byValue = new Map<string, { capped: boolean; powerNames: string[] }>();
      for (const source of stat.sources) {
        if (!source.powerName) continue;
        const key = source.value.toFixed(2);
        const entry = byValue.get(key);
        if (entry) {
          entry.powerNames.push(source.powerName);
          if (source.capped) entry.capped = true;
        } else {
          byValue.set(key, {
            capped: !!source.capped,
            powerNames: [source.powerName],
          });
        }
      }
      for (const entry of byValue.values()) {
        if (!entry.capped) continue;
        for (const name of entry.powerNames) offending.add(name);
      }
    }
    return offending;
  }, [breakdown, enabled]);
}
