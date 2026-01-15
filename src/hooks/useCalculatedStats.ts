/**
 * Calculated Stats Hooks
 *
 * These hooks compute derived statistics from the build state.
 * They handle enhancement values, set bonuses, and archetype modifiers.
 */

import { useMemo } from 'react';
import { useBuildStore } from '@/stores';
import { getIOSet } from '@/data';
import type { SetBonus, Build } from '@/types';

// ============================================
// STAT CATEGORIES
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

  // Global modifiers from set bonuses
  globalRecharge: number;
  globalAccuracy: number;
  globalDamage: number;
}

// ============================================
// DEFAULT STATS
// ============================================

const createDefaultStats = (): CalculatedStats => ({
  damageBuff: 0,
  accuracyBuff: 0,
  toHitBuff: 0,
  rechargeBuff: 0,
  enduranceReduction: 0,
  maxEndurance: 100,
  recoveryBuff: 0,
  defense: {
    smashing: 0,
    lethal: 0,
    fire: 0,
    cold: 0,
    energy: 0,
    negative: 0,
    psionic: 0,
    melee: 0,
    ranged: 0,
    aoe: 0,
  },
  resistance: {
    smashing: 0,
    lethal: 0,
    fire: 0,
    cold: 0,
    energy: 0,
    negative: 0,
    psionic: 0,
    toxic: 0,
  },
  maxHP: 0,
  hpBuff: 0,
  regenBuff: 0,
  runSpeed: 0,
  jumpHeight: 0,
  flySpeed: 0,
  mezResistance: {
    hold: 0,
    stun: 0,
    immobilize: 0,
    sleep: 0,
    confuse: 0,
    fear: 0,
    knockback: 0,
  },
  globalRecharge: 0,
  globalAccuracy: 0,
  globalDamage: 0,
});

// ============================================
// SET BONUS CALCULATION
// ============================================

/**
 * Calculate all active set bonuses from the build
 */
function calculateSetBonuses(build: Build): Map<string, number> {
  const bonusMap = new Map<string, number>();

  for (const [setId, tracking] of Object.entries(build.sets)) {
    const ioSet = getIOSet(setId);
    if (!ioSet) continue;

    // Get bonuses for the number of pieces slotted
    for (const bonus of ioSet.bonuses) {
      if (bonus.pieces <= tracking.count) {
        for (const effect of bonus.effects) {
          const currentValue = bonusMap.get(effect.stat) || 0;
          bonusMap.set(effect.stat, currentValue + effect.value);
        }
      }
    }
  }

  return bonusMap;
}

/**
 * Map set bonus stat names to our stat structure
 */
function applySetBonusToStats(
  stats: CalculatedStats,
  bonuses: Map<string, number>
): void {
  for (const [stat, value] of bonuses) {
    const lowerStat = stat.toLowerCase();

    // Damage
    if (lowerStat.includes('damage') && !lowerStat.includes('resistance')) {
      stats.globalDamage += value;
    }

    // Accuracy
    if (lowerStat.includes('accuracy')) {
      stats.globalAccuracy += value;
    }

    // Recharge
    if (lowerStat.includes('recharge') && !lowerStat.includes('debuff')) {
      stats.globalRecharge += value;
    }

    // Recovery
    if (lowerStat.includes('recovery')) {
      stats.recoveryBuff += value;
    }

    // Max HP
    if (lowerStat.includes('hit points') || lowerStat.includes('max hp')) {
      stats.hpBuff += value;
    }

    // Regeneration
    if (lowerStat.includes('regeneration') || lowerStat.includes('regen')) {
      stats.regenBuff += value;
    }

    // Max Endurance
    if (lowerStat.includes('max endurance')) {
      stats.maxEndurance += value;
    }

    // Defense
    if (lowerStat.includes('defense')) {
      if (lowerStat.includes('smashing') || lowerStat.includes('lethal')) {
        stats.defense.smashing += value;
        stats.defense.lethal += value;
      }
      if (lowerStat.includes('fire') || lowerStat.includes('cold')) {
        stats.defense.fire += value;
        stats.defense.cold += value;
      }
      if (lowerStat.includes('energy') || lowerStat.includes('negative')) {
        stats.defense.energy += value;
        stats.defense.negative += value;
      }
      if (lowerStat.includes('psionic')) {
        stats.defense.psionic += value;
      }
      if (lowerStat.includes('melee')) {
        stats.defense.melee += value;
      }
      if (lowerStat.includes('ranged')) {
        stats.defense.ranged += value;
      }
      if (lowerStat.includes('aoe') || lowerStat.includes('area')) {
        stats.defense.aoe += value;
      }
    }

    // Resistance
    if (lowerStat.includes('resistance') && !lowerStat.includes('mez')) {
      if (lowerStat.includes('smashing') || lowerStat.includes('lethal')) {
        stats.resistance.smashing += value;
        stats.resistance.lethal += value;
      }
      if (lowerStat.includes('fire') || lowerStat.includes('cold')) {
        stats.resistance.fire += value;
        stats.resistance.cold += value;
      }
      if (lowerStat.includes('energy') || lowerStat.includes('negative')) {
        stats.resistance.energy += value;
        stats.resistance.negative += value;
      }
      if (lowerStat.includes('psionic')) {
        stats.resistance.psionic += value;
      }
      if (lowerStat.includes('toxic')) {
        stats.resistance.toxic += value;
      }
    }

    // Mez Resistance
    if (lowerStat.includes('mez') && lowerStat.includes('resistance')) {
      stats.mezResistance.hold += value;
      stats.mezResistance.stun += value;
      stats.mezResistance.immobilize += value;
      stats.mezResistance.sleep += value;
      stats.mezResistance.confuse += value;
      stats.mezResistance.fear += value;
    }

    // Movement
    if (lowerStat.includes('run speed') || lowerStat.includes('running')) {
      stats.runSpeed += value;
    }
    if (lowerStat.includes('jump') || lowerStat.includes('jumping')) {
      stats.jumpHeight += value;
    }
    if (lowerStat.includes('fly') || lowerStat.includes('flight')) {
      stats.flySpeed += value;
    }
  }
}

// ============================================
// MAIN HOOK
// ============================================

/**
 * Calculate all derived stats from the current build
 */
export function useCalculatedStats(): CalculatedStats {
  const build = useBuildStore((state) => state.build);

  return useMemo(() => {
    const stats = createDefaultStats();

    // Apply archetype base stats
    if (build.archetype.stats) {
      stats.maxHP = build.archetype.stats.maxHP;
    }

    // Calculate set bonuses
    const setBonuses = calculateSetBonuses(build);
    applySetBonusToStats(stats, setBonuses);

    return stats;
  }, [build]);
}

// ============================================
// INDIVIDUAL STAT HOOKS
// ============================================

/**
 * Get just the global recharge bonus
 */
export function useGlobalRecharge(): number {
  const stats = useCalculatedStats();
  return stats.globalRecharge;
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
  const stats = useCalculatedStats();
  return {
    maxHP: stats.maxHP,
    hpBuff: stats.hpBuff,
    regenBuff: stats.regenBuff,
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
