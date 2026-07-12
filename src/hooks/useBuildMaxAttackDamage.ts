/**
 * useBuildMaxAttackDamage — the highest total final damage (direct + DoT, with
 * each power's own slotting + the build's global buffs) among the build's
 * attack powers.
 *
 * The damage bar normalizes to this so bars are comparable across powers: the
 * build's hardest hitter fills the bar and everything else scales relative to
 * it — the way Mids draws damage bars. Without a shared reference, a per-power
 * "% of cap" normalization makes same-strength powers look identical (Gust vs
 * Hailstones), and a fixed scale-1.0 reference clamps every heavy hit at 100%.
 *
 * Returns 0 when the build has no damaging powers; callers fall back to a
 * per-power reference in that case.
 */
import { useMemo } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import { useGlobalBonuses } from './useCalculatedStats';
import { getIOSet } from '@/data';
import { INCARNATE_TIER_REGISTRY } from '@/data/incarnate-registry';
import {
  calculatePowerEnhancementBonuses,
  combineWithAlphaED,
  calculatePowerDamage,
  getAlphaEnhancementBonuses,
  type EnhancementBonuses,
} from '@/utils/calculations';
import { applyQuickSnipe } from '@/utils/quick-snipe';
import { warnFallback } from '@/utils/fallback-warnings';
import type { ArchetypeId, SelectedPower } from '@/types';

export function useBuildMaxAttackDamage(): number {
  const build = useBuildStore((s) => s.build);
  const globalBonuses = useGlobalBonuses();
  const exemplarMode = useUIStore((s) => s.exemplarMode);
  const exemplarLevel = useUIStore((s) => s.exemplarLevel);
  const incarnateActive = useUIStore((s) => s.incarnateActive);
  // Combat mode swaps snipe powers to their quick-cast (higher-damage) form.
  // The InfoPanel damage bars apply this too (snipeAdjustedPower), so the
  // normalization reference must as well or fast snipes self-clamp at 100%.
  const combatMode = useUIStore((s) => s.combatMode);

  const archetypeId = build.archetype?.id as ArchetypeId | undefined;
  // calculatePowerDamage expects the global damage buff as a decimal; the
  // dashboard total carries it as a percentage (and already folds in Fury /
  // Vigilance / active Build Up), matching the single-power InfoPanel path.
  const globalDamage = (globalBonuses.damage || 0) / 100;

  return useMemo(() => {
    const alphaBonuses: EnhancementBonuses = getAlphaEnhancementBonuses(build.incarnates, incarnateActive);
    const hasAlpha = Object.values(alphaBonuses).some((v) => v !== undefined && v !== 0);
    const alphaTier = build.incarnates?.alpha?.tier;
    const edBypassRatio = alphaTier
      ? (INCARNATE_TIER_REGISTRY[alphaTier]?.edBypassRatio ?? 1 / 6)
      : 1 / 6;
    const exLevel = exemplarMode ? exemplarLevel : undefined;

    const powers: SelectedPower[] = [
      ...build.primary.powers,
      ...build.secondary.powers,
      ...build.pools.flatMap((p) => p.powers),
      ...(build.epicPool?.powers ?? []),
    ];

    let max = 0;
    // Track candidates so a build that HAS damaging powers but yields max=0
    // (every power skipped as unknown/no-scale) can warn instead of silently
    // degrading every damage bar to the per-power fallback reference.
    let candidateCount = 0;
    const skipped: string[] = [];
    for (const power of powers) {
      // Apply the quick-snipe form before reading damage so the reference
      // matches the (combat-mode-boosted) value the bars render.
      const effPower = applyQuickSnipe(power, combatMode);
      if (!effPower.damage && !effPower.effects?.damage) continue;
      candidateCount++;

      // Per-power slotted Damage enhancement (post-ED, Alpha-aware) — mirrors
      // the InfoPanel single-power calculation so the max is apples-to-apples.
      let enhDamage = alphaBonuses.damage ?? 0;
      if (power.slots) {
        const bonuses = hasAlpha
          ? combineWithAlphaED({ name: power.name, slots: power.slots }, build.level, getIOSet, alphaBonuses, edBypassRatio, exLevel)
          : calculatePowerEnhancementBonuses({ name: power.name, slots: power.slots }, build.level, getIOSet, exLevel);
        enhDamage = bonuses.damage ?? 0;
      }

      const dmg = calculatePowerDamage(effPower, { level: build.level, archetypeId }, { damage: enhDamage }, globalDamage, 0);
      if (!dmg || dmg.unknown || dmg.scale == null) {
        skipped.push(power.name);
        continue;
      }

      const dot = dmg.dotDamage;
      const isPureDot = dot && Math.abs(dmg.base - dot.base) <= 0.001;
      const et = dot ? dot.effectiveTicks : 0;
      const totalFinal = isPureDot
        ? dot.final * et
        : dmg.final + (dot ? dot.final * et : 0);
      if (totalFinal > max) max = totalFinal;
    }

    // Damaging powers exist but none produced a usable number — the damage bars
    // will all fall back to per-power scaling. Surface the real values so a
    // recurrence is diagnosable instead of looking like "every bar is maxed".
    if (candidateCount > 0 && max === 0) {
      warnFallback(
        'useBuildMaxAttackDamage',
        `${candidateCount} damaging power(s) but max=0 — damage bars fall back to per-power scaling`,
        { skipped },
      );
    }
    return max;
  }, [build, archetypeId, globalDamage, exemplarMode, exemplarLevel, incarnateActive, combatMode]);
}
