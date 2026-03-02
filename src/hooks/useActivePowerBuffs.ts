/**
 * Hook to aggregate active per-target power buffs.
 *
 * Scans all selected powers in the build for active per-target buffs
 * (powers with `perTarget` on their effects). Returns resolved buff
 * values adjusted for the user's targets-hit slider setting.
 *
 * Used by InfoPanel to pass active damage buffs into calculatePowerDamage
 * for other powers (e.g., Soul Drain's damageBuff affecting Shadow Punch).
 */

import { useMemo } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import { getTableValue } from '@/data/at-tables';
import type { SelectedPower, ScaledEffect } from '@/types';

interface ActiveBuffs {
  /** Total active damage buff as a decimal (e.g., 0.80 = 80%) */
  damageBuff: number;
  /** Total active to-hit buff as a decimal (e.g., 0.12 = 12%) */
  tohitBuff: number;
}

/**
 * Check if a ScaledEffect has per-target stacking metadata.
 */
function isPerTargetScaled(value: unknown): value is ScaledEffect & { perTarget: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'scale' in value &&
    'table' in value &&
    'perTarget' in value &&
    typeof (value as Record<string, unknown>).perTarget === 'number'
  );
}

/**
 * Resolve a per-target buff value: scale adjusted for targets, multiplied by AT table value.
 * Returns the buff as a decimal (e.g., 0.80 for 80%).
 */
function resolvePerTargetBuff(
  effect: ScaledEffect & { perTarget: number },
  targetsHit: number,
  archetypeId: string,
  level: number
): number {
  const adjustedScale = effect.scale + effect.perTarget * (targetsHit - 1);
  const tableVal = getTableValue(archetypeId, effect.table, level);
  if (tableVal === undefined) return 0;
  return adjustedScale * tableVal;
}

/**
 * Aggregate active per-target buffs from all selected powers.
 * Only includes buffs from powers that:
 * - Are in the build (selected)
 * - Are not toggled off (Toggle/Auto powers with isActive === false)
 * - Have per-target effects with a targets-hit slider value > 0
 */
export function useActivePowerBuffs(): ActiveBuffs {
  const build = useBuildStore((s) => s.build);
  const targetsHitValues = useUIStore((s) => s.targetsHitValues);

  return useMemo(() => {
    let totalDamageBuff = 0;
    let totalToHitBuff = 0;
    const archetypeId = build.archetype.id;
    if (!archetypeId) return { damageBuff: 0, tohitBuff: 0 };
    const level = build.level;

    // Collect all selected powers across all categories
    const allPowers: SelectedPower[] = [
      ...build.primary.powers,
      ...build.secondary.powers,
      ...build.pools.flatMap(p => p.powers),
      ...(build.epicPool?.powers ?? []),
    ];

    for (const power of allPowers) {
      // Skip toggled-off powers (Toggle/Auto with isActive === false)
      if (power.isActive === false) continue;

      // Check targets-hit value — 0 means buff is inactive
      const targetsHit = targetsHitValues[power.name] ?? 0;
      if (targetsHit <= 0) continue;

      const effects = power.effects;
      if (!effects) continue;

      // Check for per-target damage buff
      if (isPerTargetScaled(effects.damageBuff)) {
        totalDamageBuff += resolvePerTargetBuff(
          effects.damageBuff,
          targetsHit,
          archetypeId,
          level
        );
      }

      // Check for per-target to-hit buff
      if (isPerTargetScaled(effects.tohitBuff)) {
        totalToHitBuff += resolvePerTargetBuff(
          effects.tohitBuff,
          targetsHit,
          archetypeId,
          level
        );
      }
    }

    return { damageBuff: totalDamageBuff, tohitBuff: totalToHitBuff };
  }, [build.primary.powers, build.secondary.powers, build.pools, build.epicPool,
      build.archetype.id, build.level, targetsHitValues]);
}
