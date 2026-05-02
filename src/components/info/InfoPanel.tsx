/**
 * InfoPanel - Displays detailed information about the currently hovered power
 * Renders inline within the Info Panel column (column headers are in PlannerPage)
 * Shows Base/Enhanced/Final values for enhanceable stats
 */

import { useMemo, useState } from 'react';
import { useUIStore, useBuildStore, useDominationActive, useScourgeActive, useFuryLevel, useContainmentActive, useCriticalHitsActive, useStalkerHidden, useStalkerTeamSize, useStalkerCritActive, useSentinelCritActive } from '@/stores';
import { getBaseToHit } from '@/data/purple-patch';
import {
  lookupPower,
  getArchetype,
  getIOSet,
  getPowerIconPath,
  getAlphaEffects,
  getDestinyEffects,
  getHybridEffects,
  getInterfaceEffects,
  getJudgementEffects,
  getLoreEffects,
  formatEffectValue,
  isSlotToggleable,
  findProcData,
  parseProcEffect,
  interpolateProcDamage,
  calculateProcChance,
  getActiveDamageConversion,
} from '@/data';
import { useGlobalBonuses } from '@/hooks/useCalculatedStats';
import { calculatePowerEnhancementBonuses, combineWithAlphaED, calculatePowerDamage, calculateArcanaTime, getAlphaEnhancementBonuses, abbreviateDamageType, type EnhancementBonuses, isControllerPower, isCorruptorAttackPower, isBruteAttackPower, isScrapperAttackPower, isStalkerAttackPower, isSentinelAttackPower, calculateContainmentDamage, calculateScourgeDamage, calculateFuryDamage, calculateFuryDamageBonus, calculateCriticalHitDamage, calculateAssassinationDamage, calculateAssassinationDamageBonus, calculateOpportunityCritDamage, getContainmentInfo, getScourgeInfo, getCriticalHitInfo, getFuryInfo } from '@/utils/calculations';
import type { IOSetEnhancement } from '@/types';
import { INCARNATE_TIER_REGISTRY } from '@/data/incarnate-registry';
import { isPermaEligible, calculatePermaInfo } from '@/utils/calculations/perma';
import { calculatePetDamage, shouldApplyEnhancements, type PetDamageResult, type PetAbilityDamage } from '@/utils/calculations/pet-damage';
import { PET_ENTITIES, type PetAbility } from '@/data/pet-entities';
import { calculateIncarnateDamage } from '@/data/at-tables';
import { resolvePath } from '@/utils/paths';
import { EnhancementInfoContent } from './EnhancementInfoContent';
import { MechanicAdjusters } from './MechanicAdjusters';
import type {
  ArchetypeId,
  Power,
  PowerEffects,
  IncarnateSlotId,
  ToggleableIncarnateSlot,
  SummonEffect,
} from '@/types';
import { getSlotColor, getTierColor, getTierDisplayName } from '@/data';
import {
  getEffectiveBuffDebuffModifier,
  calcThreeTier as calcThreeTierUtil,
  convertGlobalBonusesToAspects,
  findSelectedPowerInBuild,
  getDamageCap,
  selectActiveConditionals,
  applyActiveConditionals,
} from './powerDisplayUtils';
import {
  RegistryEffectsDisplay,
  getConArrow,
} from './SharedPowerComponents';

export function InfoPanel() {
  const infoPanel = useUIStore((s) => s.infoPanel);
  const unlockInfoPanel = useUIStore((s) => s.unlockInfoPanel);

  // If locked, show locked content; otherwise show hover content
  const content = infoPanel.locked ? infoPanel.lockedContent : infoPanel.content;

  if (!content) {
    return (
      <div className="text-slate-500 text-xs text-center py-8 italic">
        Hover over a power to see details
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Lock indicator — locked: amber filled lock; unlocked: dim open lock as a discoverable affordance */}
      {infoPanel.locked ? (
        <button
          onClick={unlockInfoPanel}
          className="absolute top-0 right-0 text-amber-400 hover:text-amber-300 p-1 z-10"
          title="Locked — this panel won't change as you hover. Click to unlock and resume hover-to-preview."
          aria-label="Unlock info panel"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </button>
      ) : (
        <div
          className="absolute top-0 right-0 text-slate-600 p-1 z-10 pointer-events-auto cursor-help"
          title="Hover-preview mode — the panel updates as you hover. Right click any power to lock its details here."
          aria-label="Info panel: hover-preview mode"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a5 5 0 00-5 5v2H4a2 2 0 00-2 2v5a2 2 0 002 2h12a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {content.type === 'power' && (
        <PowerInfo powerName={content.powerName} powerSet={content.powerSet} />
      )}

      {content.type === 'enhancement' && (
        <EnhancementInfo enhancementId={content.enhancementId} />
      )}

      {content.type === 'slotted-enhancement' && (
        <EnhancementInfoContent powerName={content.powerName} slotIndex={content.slotIndex} />
      )}

      {content.type === 'incarnate' && (
        <IncarnateInfo slotId={content.slotId as IncarnateSlotId} powerId={content.powerId} />
      )}
    </div>
  );
}

/**
 * Check if a value (or by-type sub-values) has a perTarget field.
 */
function hasPerTargetField(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  if ('perTarget' in value) return true;
  // Check by-type sub-objects (defenseBuff, resistance, etc.)
  for (const subVal of Object.values(value as Record<string, unknown>)) {
    if (typeof subVal === 'object' && subVal !== null && 'perTarget' in subVal) return true;
  }
  return false;
}

/**
 * Data-driven detection: show stacking slider for either per-target AoE
 * scaling (perTarget metadata + maxTargets) or linear self-stacking
 * (`effects.maxStacks` set explicitly, e.g. Psychokinetic Barrier).
 */
function getStackingInfo(power: Power): { maxStacks: number; label: string } | null {
  if (!power.effects) return null;

  // AoE per-target powers (Soul Drain, Eclipse, Power Sink, etc.) — when
  // any effect carries a `perTarget` field, the slider's natural axis is
  // "targets hit" with max from stats.maxTargets. Soul Drain in particular
  // also has effects.maxStacks (self-stack on double-cast), but the
  // per-target story is the dominant one for tooltip math, so check it
  // first to prevent the smaller stack-2 cap from winning.
  const hasPerTarget = Object.values(power.effects).some(v => hasPerTargetField(v));
  if (hasPerTarget) {
    const maxTargets = power.stats?.maxTargets;
    if (maxTargets && maxTargets > 1 && maxTargets !== 255) {
      return { maxStacks: maxTargets, label: 'Targets Hit' };
    }
  }

  // Linear self-stacking — power declares maxStacks directly. Doesn't
  // require perTarget metadata; the slider just multiplies scale of any
  // effect listed in `effects.stacksLinear`. Falls through here when there
  // is no per-target scaling (e.g. Siphon Speed's caster recharge buff).
  if (power.effects.maxStacks) {
    return { maxStacks: power.effects.maxStacks, label: 'Stacks' };
  }

  return null;
}

/**
 * Adjust ScaledEffect scale values for per-target stacking.
 * At N targets: effective_scale = scale + perTarget × (N - 1)
 * Recursively handles by-type objects (defenseBuff, resistance).
 */
function adjustScaledValue(value: unknown, targetsHit: number): unknown {
  if (typeof value !== 'object' || value === null) return value;
  if ('scale' in value && 'perTarget' in value) {
    const se = value as { scale: number; table: string; perTarget?: number };
    if (se.perTarget && targetsHit > 1) {
      return { ...se, scale: se.scale + se.perTarget * (targetsHit - 1) };
    }
    return value;
  }
  // By-type object — recurse into sub-entries
  const result: Record<string, unknown> = {};
  let changed = false;
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    const adjusted = adjustScaledValue(v, targetsHit);
    result[k] = adjusted;
    if (adjusted !== v) changed = true;
  }
  return changed ? result : value;
}

/**
 * Multiply the `scale` field of a ScaledEffect (or every leaf of a by-type
 * object) by `multiplier`. Used for linear self-stacking — every additional
 * stack just adds another instance of the base magnitude.
 */
function multiplyScale(value: unknown, multiplier: number): unknown {
  if (multiplier === 1) return value;
  if (typeof value !== 'object' || value === null) return value;
  if ('scale' in value && typeof (value as { scale: unknown }).scale === 'number') {
    const se = value as { scale: number; [k: string]: unknown };
    return { ...se, scale: se.scale * multiplier };
  }
  // By-type object — recurse
  const result: Record<string, unknown> = {};
  let changed = false;
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    const adj = multiplyScale(v, multiplier);
    result[k] = adj;
    if (adj !== v) changed = true;
  }
  return changed ? result : value;
}

/**
 * Create an adjusted copy of effects with per-target scale values multiplied
 * (perTarget AoE math) and/or stacks-linear effects multiplied by stack count.
 */
function adjustEffectsForTargets(
  effects: PowerEffects,
  targetsHit: number
): PowerEffects {
  if (targetsHit <= 1) return effects;
  const stacksLinear = new Set(effects.stacksLinear || []);
  const adjusted: Record<string, unknown> = {};
  let changed = false;
  for (const [key, value] of Object.entries(effects)) {
    let adj = adjustScaledValue(value, targetsHit);
    if (stacksLinear.has(key)) {
      adj = multiplyScale(adj, targetsHit);
    }
    adjusted[key] = adj;
    if (adj !== value) changed = true;
  }
  return (changed ? adjusted : effects) as PowerEffects;
}

interface PowerInfoProps {
  powerName: string;
  powerSet: string;
}

function PowerInfo({ powerName, powerSet }: PowerInfoProps) {
  const build = useBuildStore((s) => s.build);
  const archetypeId = build.archetype.id;
  const globalBonuses = useGlobalBonuses();
  const targetLevelOffset = useUIStore((s) => s.targetLevelOffset);
  const incarnateActive = useUIStore((s) => s.incarnateActive);
  const dominationActive = useDominationActive();
  const scourgeActive = useScourgeActive();
  const furyLevel = useFuryLevel();
  const containmentActive = useContainmentActive();
  const criticalHitsActive = useCriticalHitsActive();
  const stalkerHidden = useStalkerHidden();
  const stalkerTeamSize = useStalkerTeamSize();
  const stalkerCritActive = useStalkerCritActive();
  const sentinelCritActive = useSentinelCritActive();
  // Alpha-strike scenario only applies if the build has the Hide power
  const hasHide = build.secondary.powers.some((p) => p.internalName === 'Hide');
  const effectiveHidden = stalkerHidden && hasHide;
  const procSettings = useUIStore((s) => s.procSettings);
  const includeProcDamageToggle = useUIStore((s) => s.includeProcDamageInDPS) && procSettings.damage;
  const useArcanaTimeToggle = useUIStore((s) => s.useArcanaTime);
  const damageDisplayMode = useUIStore((s) => s.damageDisplayMode);
  const combatMode = useUIStore((s) => s.combatMode);

  // Unified power lookup across all categories
  const result = lookupPower(powerSet, powerName);
  let power: Power | undefined = result?.power;
  let powersetName = result?.powersetName || '';

  // Archetype inherent fallback (dynamically created, not in static data)
  if (!power && powerSet === 'Inherent') {
    powersetName = 'Inherent';
    const selectedInherent = build.inherents.find((p) => p.internalName === powerName);
    if (selectedInherent) {
      power = selectedInherent;
      if (selectedInherent.inherentCategory === 'archetype') {
        powersetName = `${build.archetype.name} Inherent`;
      }
    }
  }

  // Find the selected power from build to get its slots
  const selectedPower = findSelectedPowerInBuild(powerName, build);

  // Get Alpha incarnate enhancement bonuses (apply to all powers)
  const alphaBonuses = useMemo<EnhancementBonuses>(() => {
    return getAlphaEnhancementBonuses(build.incarnates, incarnateActive);
  }, [build.incarnates, incarnateActive]);

  const exemplarMode = useUIStore((s) => s.exemplarMode);
  const exemplarLevel = useUIStore((s) => s.exemplarLevel);

  // Calculate enhancement bonuses if power is slotted, plus Alpha bonuses.
  // Alpha bonuses interact with ED: a portion (based on tier) bypasses ED,
  // the rest is added to raw IO bonuses before ED is applied.
  const enhancementBonuses = useMemo<EnhancementBonuses>(() => {
    const hasAlpha = Object.values(alphaBonuses).some((v) => v !== undefined && v !== 0);
    const alphaTier = build.incarnates?.alpha?.tier;
    const edBypassRatio = alphaTier
      ? (INCARNATE_TIER_REGISTRY[alphaTier]?.edBypassRatio ?? 1 / 6)
      : 1 / 6;

    if (hasAlpha && selectedPower?.slots) {
      // Use combined calculation that properly splits alpha through/around ED
      return combineWithAlphaED(
        { name: selectedPower.name, slots: selectedPower.slots },
        build.level,
        getIOSet,
        alphaBonuses,
        edBypassRatio,
        exemplarMode ? exemplarLevel : undefined
      );
    }

    // No alpha — standard ED-only calculation
    if (selectedPower?.slots) {
      return calculatePowerEnhancementBonuses(
        { name: selectedPower.name, slots: selectedPower.slots },
        build.level,
        getIOSet,
        exemplarMode ? exemplarLevel : undefined
      );
    }

    return { ...alphaBonuses };
  }, [selectedPower, build.level, alphaBonuses, exemplarMode, exemplarLevel, build.incarnates?.alpha?.tier]);

  // Convert global bonuses to enhancement-aspect-keyed decimals for three-tier display
  const globalBonusesForCalc = useMemo(
    () => convertGlobalBonusesToAspects(globalBonuses),
    [globalBonuses]
  );

  // When combatMode is active and power has quickSnipe, use Quick-cast stats/damage
  const isQuickSnipe = combatMode && !!power?.quickSnipe;
  const snipeAdjustedPower = useMemo(() => {
    if (!power) return power;
    if (!isQuickSnipe || !power.quickSnipe) return power;
    return {
      ...power,
      stats: power.stats ? { ...power.stats, ...power.quickSnipe.stats } : power.stats,
      damage: power.quickSnipe.damage,
      // For epic pool powers that store stats in effects
      effects: power.effects ? {
        ...power.effects,
        ...(power.quickSnipe.stats.castTime != null && { castTime: power.quickSnipe.stats.castTime }),
        ...(power.quickSnipe.stats.range != null && { range: power.quickSnipe.stats.range }),
        ...(power.quickSnipe.stats.accuracy != null && { accuracy: power.quickSnipe.stats.accuracy }),
      } : power.effects,
    } as Power;
  }, [power, isQuickSnipe]);

  // Layer active Mechanic Adjuster contributions on top of the snipe-
  // adjusted power so damage / effects display reflect toggle state
  // (drowning bonus, Disintegrating, Bio Armor adaptation, etc.).
  // AT-inherent ids (Domination etc.) read the existing Header state
  // instead of the per-power adjuster maps so the dashboard toggle is
  // the single source of truth.
  const mechanicAdjusters = useUIStore((s) => s.mechanicAdjusters);
  const globalAdjusters = useUIStore((s) => s.globalAdjusters);
  const effectivePower = useMemo(() => {
    if (!snipeAdjustedPower) return snipeAdjustedPower;
    const active = selectActiveConditionals(
      snipeAdjustedPower,
      mechanicAdjusters,
      globalAdjusters,
      { dominationActive },
    );
    return active.length === 0 ? snipeAdjustedPower : applyActiveConditionals(snipeAdjustedPower, active);
  }, [snipeAdjustedPower, mechanicAdjusters, globalAdjusters, dominationActive]);

  // Calculate actual damage using archetype modifiers and level
  const calculatedDamage = useMemo(() => {
    if (!effectivePower?.damage && !effectivePower?.effects?.damage) return null;

    // Determine if this is a primary or secondary powerset
    const isPrimary = powerSet === build.primary.id;
    const isSecondary = powerSet === build.secondary.id;

    // Derive the powerset category for melee vs ranged determination
    const powersetCategory = isPrimary ? 'PRIMARY' : isSecondary ? 'SECONDARY' : undefined;

    const result = calculatePowerDamage(
      effectivePower,
      {
        level: build.level,
        archetypeId: archetypeId as ArchetypeId | undefined,
        primaryName: powersetName,
        primaryCategory: powersetCategory,
      },
      { damage: enhancementBonuses.damage || 0 },
      globalBonusesForCalc.damage,
      0
    );

    // Apply damage type conversion (e.g., Dual Pistols ammo swap)
    if (result) {
      const powersetPowers = isPrimary ? build.primary.powers
        : isSecondary ? build.secondary.powers : [];
      const conversion = getActiveDamageConversion(powersetPowers);
      if (conversion && result.type === conversion.from) {
        result.type = conversion.to;
      }
    }

    return result;
  }, [effectivePower, build.level, archetypeId, powersetName, enhancementBonuses.damage, globalBonusesForCalc.damage, powerSet, build.primary.id, build.secondary.id, build.primary.powers, build.secondary.powers]);

  // Calculate archetype inherent damage bonus info (Containment, Scourge, Fury, etc.)
  const inherentInfo = useMemo(() => {
    if (!calculatedDamage) return null;

    const isController = archetypeId === 'controller';
    const isCorruptor = archetypeId === 'corruptor';
    const isBrute = archetypeId === 'brute';
    const isScrapper = archetypeId === 'scrapper';
    const isStalker = archetypeId === 'stalker';
    const isSentinel = archetypeId === 'sentinel';

    const showContainment = isController && isControllerPower(powerSet) && containmentActive;
    const showScourge = isCorruptor && isCorruptorAttackPower(powerSet) && scourgeActive;
    const showFury = isBrute && isBruteAttackPower(powerSet) && furyLevel > 0;
    const showCriticalHits = isScrapper && isScrapperAttackPower(powerSet) && criticalHitsActive;
    const showAssassination = isStalker && isStalkerAttackPower(powerSet) && stalkerCritActive;
    const showOpportunityCrit = isSentinel && isSentinelAttackPower(powerSet) && sentinelCritActive;

    const hasInherent = showContainment || showScourge || showFury || showCriticalHits || showAssassination || showOpportunityCrit;
    if (!hasInherent) return null;

    const header = showScourge ? 'w/ Scourge'
      : showFury ? 'w/ Fury'
      : showCriticalHits ? 'w/ Crit'
      : showAssassination ? (effectiveHidden ? 'w/ Crit' : 'w/ Assassin')
      : showContainment ? 'w/ Contain'
      : showOpportunityCrit ? 'w/ Crit'
      : 'Final';

    const color = showScourge ? 'text-sk-magenta'
      : showFury ? 'text-sk-magenta'
      : showCriticalHits ? 'text-sk-magenta'
      : showAssassination ? 'text-sk-magenta'
      : showContainment ? 'text-sk-magenta'
      : showOpportunityCrit ? 'text-sk-magenta'
      : 'text-amber-400';

    const applyBonus = (damage: number) => {
      if (showScourge) return calculateScourgeDamage(damage);
      if (showFury) return calculateFuryDamage(damage, furyLevel);
      if (showCriticalHits) return calculateCriticalHitDamage(damage, 'higher');
      if (showAssassination) return calculateAssassinationDamage(damage, effectiveHidden, stalkerTeamSize);
      if (showContainment) return calculateContainmentDamage(damage, true);
      if (showOpportunityCrit) return calculateOpportunityCritDamage(damage);
      return damage;
    };

    return { header, color, applyBonus, showContainment };
  }, [calculatedDamage, archetypeId, powerSet, containmentActive, scourgeActive, furyLevel,
      criticalHitsActive, effectiveHidden, stalkerTeamSize, stalkerCritActive, sentinelCritActive]);

  // Proc-only damage contributions for non-damaging powers. Powers like
  // Infrigidate, Siphon Speed, etc. carry no base damage but commonly host
  // damage procs (Annihilation, Achilles, Bombardment, etc.). When that's
  // the case we synthesize a Damage section so users can see what their
  // procs are actually doing on the cycle.
  const procDamageEntries = useMemo(() => {
    if (calculatedDamage) return null; // base damage already shown
    if (!selectedPower?.slots) return null;
    const baseRecharge = effectivePower?.stats?.recharge ?? effectivePower?.effects?.recharge ?? 0;
    const castTime = effectivePower?.stats?.castTime ?? effectivePower?.effects?.castTime ?? 0;
    const radius = effectivePower?.stats?.radius ?? effectivePower?.effects?.radius ?? 0;
    if (!baseRecharge && !castTime) return null;

    const entries: { name: string; setName: string; type: string; chance: number; avgDamage: number; perActivation: number; dps: number }[] = [];
    for (const slot of selectedPower.slots) {
      if (!slot || slot.type !== 'io-set') continue;
      const ioSlot = slot as IOSetEnhancement;
      if (!ioSlot.isProc) continue;
      const procData = findProcData(ioSlot.name, ioSlot.setName);
      if (!procData || procData.ppm === null) continue;
      const effect = parseProcEffect(procData.mechanics);
      if (effect.category !== 'Damage' || effect.value == null || effect.valueMax == null) continue;

      const slotLevel = ioSlot.level ?? build.level;
      const avgDamage = interpolateProcDamage(effect.value, effect.valueMax, procData.levelRange, slotLevel);
      const chance = calculateProcChance(procData.ppm, baseRecharge, castTime, radius);
      const perActivation = chance * avgDamage;
      const cycleTime = (baseRecharge + castTime) || 1;
      const dps = perActivation / cycleTime;
      entries.push({
        name: ioSlot.name,
        setName: ioSlot.setName,
        type: effect.effectType ?? 'Damage',
        chance,
        avgDamage,
        perActivation,
        dps,
      });
    }
    return entries.length > 0 ? entries : null;
  }, [calculatedDamage, selectedPower, effectivePower, build.level]);

  // Per-target buff scaling (stored in UI store so it persists across power switches)
  const stackingInfo = useMemo(() => power ? getStackingInfo(power) : null, [power]);
  const targetsHit = useUIStore((s) => s.targetsHitValues[powerName] ?? 0);
  const setTargetsHit = useUIStore((s) => s.setTargetsHit);

  if (!power || !effectivePower) {
    return <div className="text-slate-500 text-xs">Power not found</div>;
  }

  const baseEffects = effectivePower.effects;

  // Extract healing from damage field (e.g., Life Drain, Reconstruction)
  // Handles both single object { type: "Heal", scale, table } and array entries
  let healFromDamage: { scale: number; table?: string } | undefined;
  if (!baseEffects?.healing) {
    const dmg = effectivePower.damage ?? effectivePower.effects?.damage;
    if (!Array.isArray(dmg) && typeof dmg === 'object' && dmg && 'type' in dmg && (dmg as { type: string }).type === 'Heal') {
      const entry = dmg as { scale: number; table?: string };
      healFromDamage = { scale: entry.scale, table: entry.table };
    } else if (Array.isArray(dmg)) {
      const healEntry = (dmg as Array<{ type: string; scale: number; table?: string }>)
        .find(e => e.type === 'Heal');
      if (healEntry) {
        healFromDamage = { scale: healEntry.scale, table: healEntry.table };
      }
    }
  }

  // Use effective stats (quickSnipe-aware) for display
  const effectiveStats = effectivePower.stats;

  // Merge power.stats into effects for registry-driven display
  // Map stats field names to registry-expected names
  const effects = {
    ...baseEffects,
    // Execution stats from power.stats
    ...(effectiveStats?.endurance && { enduranceCost: effectivePower.powerType === 'Toggle' ? effectiveStats.endurance / (effectiveStats.activatePeriod ?? 0.5) : effectiveStats.endurance }),
    ...(effectiveStats?.recharge && { recharge: effectiveStats.recharge }),
    ...(effectiveStats?.accuracy && { accuracy: effectiveStats.accuracy }),
    ...(effectiveStats?.range && { range: effectiveStats.range }),
    ...(effectiveStats?.castTime && { castTime: effectiveStats.castTime }),
    // AoE stats
    ...(effectiveStats?.radius && { radius: effectiveStats.radius }),
    ...(effectiveStats?.arc && { arc: effectiveStats.arc <= 2 * Math.PI ? effectiveStats.arc * (180 / Math.PI) : effectiveStats.arc }),
    ...(effectiveStats?.maxTargets && { maxTargets: effectiveStats.maxTargets }),
    // Healing from damage array
    ...(healFromDamage && { healing: healFromDamage }),
    // Surface summon duration as buffDuration when no explicit duration exists
    ...(!baseEffects?.buffDuration && !baseEffects?.effectDuration && baseEffects?.summon?.duration && {
      buffDuration: baseEffects.summon.duration,
    }),
    // Flatten nested movement object (e.g., Super Jump, Fly, Sprint)
    ...(baseEffects?.movement && typeof baseEffects.movement === 'object' && (() => {
      const mov = baseEffects.movement as Record<string, unknown>;
      const flat: Record<string, unknown> = {};
      if (mov.flySpeed) flat.fly = mov.flySpeed;
      if (mov.runSpeed) flat.runSpeed = mov.runSpeed;
      if (mov.jumpSpeed) flat.jumpSpeed = mov.jumpSpeed;
      if (mov.jumpHeight) flat.jumpHeight = mov.jumpHeight;
      return flat;
    })()),
  };

  // Get archetype modifier for buff/debuff calculations
  const archetype = archetypeId ? getArchetype(archetypeId as ArchetypeId) : null;
  const buffDebuffMod = archetype?.stats?.buffDebuffModifier ?? 1.0;

  // Get the effective buff/debuff modifier for this powerset
  const effectiveMod = getEffectiveBuffDebuffModifier(powerSet, buffDebuffMod);

  // Calculate three-tier stats for key values (wrapper for shared utility)
  const calcThreeTier = (aspect: string, baseValue: number) =>
    calcThreeTierUtil(aspect, baseValue, enhancementBonuses, globalBonusesForCalc);

  // Check if power has any enhancements
  const hasEnhancements = selectedPower && selectedPower.slots.some(s => s !== null);

  const getIconPath = (): string => getPowerIconPath(power.icon);

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-start gap-2">
        <img
          src={getIconPath()}
          alt=""
          className="w-8 h-8 rounded flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
          }}
        />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-blue-400 leading-tight">
            {power.name}
            {isQuickSnipe && (
              <span className="text-[9px] text-amber-400 ml-1 font-normal">(Quick)</span>
            )}
            {hasEnhancements && (
              <span className="text-[9px] text-green-500 ml-1 font-normal">(enhanced)</span>
            )}
          </h3>
          <span className="text-[10px] text-slate-400 capitalize">{power.powerType}</span>
        </div>
      </div>

      {/* Short Help (quick summary) */}
      {power.shortHelp && (
        <div className="text-[10px] text-amber-400/80 italic">
          {power.shortHelp}
        </div>
      )}

      {/* Summon/Pet Info with DPS */}
      {effects?.summon && (
        <PetDamageDisplay
          summon={effects.summon}
          level={build.level}
          enhancementDamageBonus={enhancementBonuses.damage || 0}
          globalDamageBonus={globalBonusesForCalc.damage || 0}
          archetypeId={archetypeId ?? undefined}
        />
      )}

      {/* Stacking slider (per-target or per-stack) */}
      {stackingInfo && (() => {
        // Disable slider when Toggle/Auto power is toggled off
        const isToggleOff = selectedPower &&
          (selectedPower.powerType === 'Toggle' || selectedPower.powerType === 'Auto') &&
          selectedPower.isActive === false;
        const effectiveTargets = isToggleOff ? 0 : targetsHit;

        return (
          <div className={`flex items-center gap-2 bg-slate-800/50 rounded px-2 py-1.5 ${isToggleOff ? 'opacity-50' : ''}`}>
            <span className="text-[10px] text-slate-400 whitespace-nowrap">{stackingInfo.label}</span>
            <input
              type="range"
              min={0}
              max={stackingInfo.maxStacks}
              value={effectiveTargets}
              onChange={(e) => setTargetsHit(powerName, Number(e.target.value))}
              disabled={!!isToggleOff}
              className="flex-1 h-1 accent-blue-500 cursor-pointer disabled:opacity-50"
            />
            <span className="text-[10px] text-slate-200 font-mono w-10 text-right">
              {effectiveTargets === 0 ? 'Off' : `${effectiveTargets} / ${stackingInfo.maxStacks}`}
            </span>
          </div>
        );
      })()}

      {/* Mechanic Adjusters — toggles for power.conditionalEffects (drowning,
        * Disintegrating, Bio Armor adaptation, etc.). Toggle state is
        * persisted in uiStore; calc-pipeline integration is a follow-up. */}
      <MechanicAdjusters power={power} />

      {/* Registry-driven Power Effects display */}
      <RegistryEffectsDisplay
        effects={stackingInfo && targetsHit > 1 ? adjustEffectsForTargets(effects, targetsHit) : effects}
        allowedEnhancements={power?.allowedEnhancements || []}
        enhancementBonuses={enhancementBonuses}
        globalBonuses={globalBonusesForCalc}
        buffDebuffMod={effectiveMod}
        archetypeId={archetypeId ?? undefined}
        level={build.level}
        categories={['execution', 'buff', 'debuff', 'control', 'protection', 'movement']}
        dominationActive={dominationActive}
        header="Power Effects"
        duration={effects?.buffDuration}
        purplePatchInfo={{
          factor: Math.min(0.95, Math.max(0.05, getBaseToHit(targetLevelOffset - globalBonuses.levelShift) + globalBonuses.toHit / 100)) / 0.75,
          offset: targetLevelOffset,
          toHitBonus: globalBonuses.toHit,
          combatModifier: globalBonuses.combatModifier ?? 1,
        }}
      />

      {/* Damage with three-tier display - using actual damage calculation */}
      {/* Damage from slotted procs (only shown for non-damaging powers — base
       * damage already has its own section below). Useful for utility powers
       * like Infrigidate / Siphon Speed that get most/all of their damage
       * from procs the player slots. */}
      {procDamageEntries && procDamageEntries.length > 0 && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Damage from Procs <span className="text-slate-600 font-normal">(Lvl {build.level})</span>
          </h4>
          <div className="bg-slate-800/50 rounded p-2 space-y-1">
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 text-[9px] text-slate-500 uppercase border-b border-slate-700 pb-0.5">
              <span>Proc</span>
              <span className="text-right">Type</span>
              <span className="text-right">Chance</span>
              <span className="text-right">Avg/Cast</span>
              <span className="text-right">DPS</span>
            </div>
            {procDamageEntries.map((p, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 text-[10px]">
                <span className="text-slate-300 truncate" title={`${p.setName}: ${p.name}`}>{p.name}</span>
                <span className="text-right text-orange-400">{p.type}</span>
                <span className="text-right text-slate-400 tabular-nums">{(p.chance * 100).toFixed(0)}%</span>
                <span className="text-right text-amber-300 tabular-nums">{p.perActivation.toFixed(1)}</span>
                <span className="text-right text-amber-400 tabular-nums">{p.dps.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-slate-700 pt-0.5 flex justify-between text-[9px]">
              <span className="text-slate-500 uppercase">Total</span>
              <span className="text-amber-400 tabular-nums">
                {procDamageEntries.reduce((s, p) => s + p.perActivation, 0).toFixed(1)} avg / {' '}
                {procDamageEntries.reduce((s, p) => s + p.dps, 0).toFixed(2)} DPS
              </span>
            </div>
          </div>
        </div>
      )}

      {calculatedDamage && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Damage <span className="text-slate-600 font-normal">(Lvl {build.level})</span>
          </h4>
          <div className="bg-slate-800/50 rounded p-2">
            {(() => {
              const gridCols = inherentInfo ? 'grid-cols-[4rem_1fr_1fr_1fr_1fr]' : 'grid-cols-[4rem_1fr_1fr_1fr]';
              const dot = calculatedDamage.dotDamage;
              // Mixed = direct damage is different from DoT (both exist separately)
              const hasDirectDamage = dot ? Math.abs(calculatedDamage.base - dot.base) > 0.001 : true;
              const isPureDot = dot && !hasDirectDamage;

              const hasEnh = Math.abs(calculatedDamage.enhanced - calculatedDamage.base) > 0.001;
              const hasGlobal = Math.abs(calculatedDamage.final - calculatedDamage.enhanced) > 0.001;
              const inherentFinal = inherentInfo ? inherentInfo.applyBonus(calculatedDamage.final) : calculatedDamage.final;
              const hasInherentDiff = inherentInfo != null && Math.abs(inherentFinal - calculatedDamage.final) > 0.001;

              // Purple patch combat modifier for damage display
              const combatMod = globalBonuses.combatModifier ?? 1;
              const showCombatMod = targetLevelOffset !== 0 && combatMod !== 1;
              const dmgConArrow = showCombatMod ? getConArrow(targetLevelOffset) : null;
              const cappedClass = calculatedDamage.capped ? 'underline decoration-dotted decoration-amber-400/50' : '';

              // Apply combat modifier to final and inherent values for display
              const displayFinal = showCombatMod ? calculatedDamage.final * combatMod : calculatedDamage.final;
              const displayInherentFinal = showCombatMod ? inherentFinal * combatMod : inherentFinal;

              // DoT per-tick values (for inherent bonus on DoT)
              const dotInherentFinal = dot && inherentInfo ? inherentInfo.applyBonus(dot.final) : dot?.final ?? 0;
              const displayDotFinal = dot ? (showCombatMod ? dot.final * combatMod : dot.final) : 0;
              const displayDotInherentFinal = showCombatMod ? dotInherentFinal * combatMod : dotInherentFinal;

              // DoT totals
              const dotTotalBase = dot ? dot.base * dot.ticks : 0;
              const dotTotalEnhanced = dot ? dot.enhanced * dot.ticks : 0;
              const dotTotalFinal = dot ? displayDotFinal * dot.ticks : 0;
              const dotTotalInherent = dot && inherentInfo ? displayDotInherentFinal * dot.ticks : dotTotalFinal;

              return (
                <>
                  <div className={`grid ${gridCols} gap-1 text-[9px] text-slate-500 uppercase mb-0.5 border-b border-slate-700 pb-0.5`}>
                    <span>Type</span>
                    <span>Base</span>
                    <span>Enhanced</span>
                    <span>Final</span>
                    {inherentInfo && <span className={inherentInfo.color}>{inherentInfo.header}</span>}
                  </div>

                  {/* Direct damage row (or per-tick for pure DoT) */}
                  <div className={`grid ${gridCols} gap-1 items-baseline text-xs`}>
                    <span className="text-red-400">{isPureDot ? `${abbreviateDamageType(calculatedDamage.type)}/tick` : abbreviateDamageType(calculatedDamage.type)}</span>
                    <span className="text-slate-200">{calculatedDamage.base.toFixed(2)}</span>
                    <span className={hasEnh ? 'text-green-400' : 'text-slate-600'}>
                      {hasEnh ? `→ ${calculatedDamage.enhanced.toFixed(2)}` : '—'}
                    </span>
                    <span className={`${hasGlobal || showCombatMod ? 'text-amber-400' : 'text-slate-600'} ${cappedClass}`}>
                      {hasGlobal || showCombatMod ? <>→ {displayFinal.toFixed(2)}{dmgConArrow && <span className={`${dmgConArrow.colorClass} ml-0.5 text-[9px]`}>{dmgConArrow.symbol}</span>}</> : '—'}
                    </span>
                    {inherentInfo && (
                      <span className={`${hasInherentDiff || showCombatMod ? inherentInfo.color : 'text-slate-600'} ${cappedClass}`}>
                        {hasInherentDiff || showCombatMod ? <>→ {displayInherentFinal.toFixed(2)}{dmgConArrow && <span className={`${dmgConArrow.colorClass} ml-0.5 text-[9px]`}>{dmgConArrow.symbol}</span>}</> : '—'}
                      </span>
                    )}
                  </div>

                  {/* DoT per-tick row (only for mixed direct+DoT powers) */}
                  {dot && hasDirectDamage && (() => {
                    const dotHasEnh = Math.abs(dot.enhanced - dot.base) > 0.001;
                    const dotHasGlobal = Math.abs(dot.final - dot.enhanced) > 0.001;
                    const dotHasInherent = inherentInfo != null && Math.abs(dotInherentFinal - dot.final) > 0.001;
                    return (
                      <div className={`grid ${gridCols} gap-1 items-baseline text-xs`}>
                        <span className="text-red-400">{abbreviateDamageType(dot.type)}/tick</span>
                        <span className="text-slate-200">{dot.base.toFixed(2)}</span>
                        <span className={dotHasEnh ? 'text-green-400' : 'text-slate-600'}>
                          {dotHasEnh ? `→ ${dot.enhanced.toFixed(2)}` : '—'}
                        </span>
                        <span className={`${dotHasGlobal || showCombatMod ? 'text-amber-400' : 'text-slate-600'} ${cappedClass}`}>
                          {dotHasGlobal || showCombatMod ? <>→ {displayDotFinal.toFixed(2)}{dmgConArrow && <span className={`${dmgConArrow.colorClass} ml-0.5 text-[9px]`}>{dmgConArrow.symbol}</span>}</> : '—'}
                        </span>
                        {inherentInfo && (
                          <span className={`${dotHasInherent || showCombatMod ? inherentInfo.color : 'text-slate-600'} ${cappedClass}`}>
                            {dotHasInherent || showCombatMod ? <>→ {displayDotInherentFinal.toFixed(2)}{dmgConArrow && <span className={`${dmgConArrow.colorClass} ml-0.5 text-[9px]`}>{dmgConArrow.symbol}</span>}</> : '—'}
                          </span>
                        )}
                      </div>
                    );
                  })()}

                  {/* DoT total row */}
                  {dot && (() => {
                    const hasTotalEnh = Math.abs(dotTotalEnhanced - dotTotalBase) > 0.001;
                    const hasTotalGlobal = Math.abs(dotTotalFinal - dotTotalEnhanced) > 0.001;
                    const hasTotalInherent = inherentInfo != null && Math.abs(dotTotalInherent - dotTotalFinal) > 0.001;
                    return (
                      <>
                        <div className={`grid ${gridCols} gap-1 items-baseline text-xs mt-1 pt-1 border-t border-slate-700/50`}>
                          <span className="text-orange-400">DoT</span>
                          <span className="text-slate-200">{dotTotalBase.toFixed(2)}</span>
                          <span className={hasTotalEnh ? 'text-green-400' : 'text-slate-600'}>
                            {hasTotalEnh ? `→ ${dotTotalEnhanced.toFixed(2)}` : '—'}
                          </span>
                          <span className={`${hasTotalGlobal || showCombatMod ? 'text-amber-400' : 'text-slate-600'} ${cappedClass}`}>
                            {hasTotalGlobal || showCombatMod ? <>→ {dotTotalFinal.toFixed(2)}{dmgConArrow && <span className={`${dmgConArrow.colorClass} ml-0.5 text-[9px]`}>{dmgConArrow.symbol}</span>}</> : '—'}
                          </span>
                          {inherentInfo && (
                            <span className={`${hasTotalInherent || showCombatMod ? inherentInfo.color : 'text-slate-600'} ${cappedClass}`}>
                              {hasTotalInherent || showCombatMod ? <>→ {dotTotalInherent.toFixed(2)}{dmgConArrow && <span className={`${dmgConArrow.colorClass} ml-0.5 text-[9px]`}>{dmgConArrow.symbol}</span>}</> : '—'}
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] text-orange-400/70 italic mt-0.5 ml-1">
                          {dot.ticks} ticks over {dot.duration}s ({dot.tickRate}s/tick)
                        </div>
                      </>
                    );
                  })()}
                </>
              );
            })()}
            {/* Damage bar - overlaid base/enhanced/final relative to AT cap */}
            {!calculatedDamage.unknown && calculatedDamage.scale && (() => {
              const damageCap = getDamageCap(archetypeId ?? '');
              // Fixed reference: AT's damage at scale 1.0 × damageCap
              // Since base ∝ scale, (base/scale) gives AT base at scale 1.0
              const referenceDamage = (calculatedDamage.base / calculatedDamage.scale) * damageCap;

              // Include DoT total damage in the bar (direct + DoT×ticks)
              const dot = calculatedDamage.dotDamage;
              const isPureDot = dot && Math.abs(calculatedDamage.base - dot.base) <= 0.001;
              const totalBase = isPureDot
                ? dot.base * dot.ticks
                : calculatedDamage.base + (dot ? dot.base * dot.ticks : 0);
              const totalEnhanced = isPureDot
                ? dot.enhanced * dot.ticks
                : calculatedDamage.enhanced + (dot ? dot.enhanced * dot.ticks : 0);
              const totalFinal = isPureDot
                ? dot.final * dot.ticks
                : calculatedDamage.final + (dot ? dot.final * dot.ticks : 0);

              const basePercent = Math.min((totalBase / referenceDamage) * 100, 100);
              const enhPercent = Math.min((totalEnhanced / referenceDamage) * 100, 100);
              const finalPercent = Math.min((totalFinal / referenceDamage) * 100, 100);

              return (
                <div className="relative h-2.5 bg-slate-700/30 rounded overflow-hidden mt-2" title={`Damage cap: ${(damageCap * 100).toFixed(0)}%`}>
                  {/* Final (back layer) */}
                  <div
                    className="absolute inset-y-0 left-0 bg-amber-500 rounded-l transition-all duration-300"
                    style={{ width: `${finalPercent}%` }}
                  />
                  {/* Enhanced (middle layer) */}
                  <div
                    className="absolute inset-y-0 left-0 bg-green-500 rounded-l transition-all duration-300"
                    style={{ width: `${enhPercent}%` }}
                  />
                  {/* Base (front layer) */}
                  <div
                    className="absolute inset-y-0 left-0 bg-slate-400 rounded-l transition-all duration-300"
                    style={{ width: `${basePercent}%` }}
                  />
                </div>
              );
            })()}
            {calculatedDamage.unknown && (
              <div className="text-[9px] text-slate-500 italic mt-1">
                * Actual damage varies (pseudo-pet or redirect power)
              </div>
            )}
            {/* DPS Calculation */}
            {!calculatedDamage.unknown && effects?.recharge && effects?.castTime && (
              (() => {
                // Calculate enhanced recharge time
                const rechargeStats = calcThreeTier('recharge', effects.recharge);
                const rawCastTime = effects.castTime;
                const arcanaTimeEnabled = useArcanaTimeToggle;
                const effectiveCastTime = arcanaTimeEnabled ? calculateArcanaTime(rawCastTime) : rawCastTime;

                // Cycle time = cast time + recharge time
                const baseCycleTime = effectiveCastTime + effects.recharge;
                const finalCycleTime = effectiveCastTime + rechargeStats.final;

                // DPS = total damage (direct + DoT total + proc damage) / cycle time.
                // For pure-DoT powers, `calculatedDamage.base` IS the per-tick value
                // (calc copies it into `dotDamage.base`), so adding both double-counts
                // one tick. Detect that case and use only the DoT total.
                const dot = calculatedDamage.dotDamage;
                const isPureDotForDps = dot ? Math.abs(calculatedDamage.base - dot.base) <= 0.001 : false;
                const dotTotalBase = dot ? dot.base * dot.ticks : 0;
                const dotTotalFinal = dot ? dot.final * dot.ticks : 0;

                // Calculate proc damage per activation if toggle is enabled
                let procDamagePerActivation = 0;
                if (includeProcDamageToggle && selectedPower?.slots) {
                  const radius = effects?.radius || 0;
                  for (const slot of selectedPower.slots) {
                    if (!slot || slot.type !== 'io-set') continue;
                    const ioEnh = slot as IOSetEnhancement;
                    if (!ioEnh.isProc) continue;
                    const procData = findProcData(ioEnh.name, ioEnh.setName);
                    if (!procData || procData.ppm === null) continue;
                    const effect = parseProcEffect(procData.mechanics);
                    if (effect.category !== 'Damage' || effect.value === undefined || effect.valueMax === undefined) continue;
                    // Interpolate damage at the enhancement's effective level
                    const enhLevel = ioEnh.attuned ? build.level : (ioEnh.level ?? build.level);
                    const dmgAtLevel = interpolateProcDamage(effect.value, effect.valueMax, procData.levelRange, enhLevel);
                    // Proc chance uses base recharge and raw cast time (not ArcanaTime)
                    const procChance = calculateProcChance(procData.ppm, effects.recharge, rawCastTime, radius);
                    procDamagePerActivation += dmgAtLevel * procChance;
                  }
                }

                const totalDmgBase = isPureDotForDps
                  ? dotTotalBase
                  : calculatedDamage.base + dotTotalBase;
                const totalDmgFinal = isPureDotForDps
                  ? dotTotalFinal + procDamagePerActivation
                  : calculatedDamage.final + dotTotalFinal + procDamagePerActivation;

                const baseDPS = totalDmgBase / baseCycleTime;
                const finalDPS = totalDmgFinal / finalCycleTime;

                return (
                  <div className="mt-2 pt-2 border-t border-slate-700">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">
                          Cycle Time{arcanaTimeEnabled && <span className="text-cyan-500 text-[9px] ml-0.5" title="Using ArcanaTime (server-tick-adjusted cast time)">A</span>}
                        </span>
                        <div className="text-slate-300">
                          {finalCycleTime.toFixed(2)}s
                          {finalCycleTime < baseCycleTime - 0.01 && (
                            <span className="text-green-400 text-[10px] ml-1">
                              (was {baseCycleTime.toFixed(1)}s)
                            </span>
                          )}
                        </div>
                      </div>
                      {(() => {
                        // Resolve the displayed figure based on the current mode.
                        // - 'damage'        → totalDmg
                        // - 'damagePerAnim' → totalDmg / cast time (honors ArcanaTime via effectiveCastTime)
                        // - 'damagePerSec'  → totalDmg / full cycle time
                        // - 'damagePerEnd'  → totalDmg / endurance cost
                        const endCost = effects?.enduranceCost ?? 0;
                        let label: string;
                        let title: string;
                        let valueBase: number;
                        let valueFinal: number;
                        let unavailableReason: string | null = null;

                        switch (damageDisplayMode) {
                          case 'damage':
                            label = 'Damage';
                            title = 'Total damage of one activation';
                            valueBase = totalDmgBase;
                            valueFinal = totalDmgFinal;
                            break;
                          case 'damagePerAnim':
                            label = 'DPA';
                            title = `Damage per Animation — damage / ${arcanaTimeEnabled ? 'ArcanaTime' : 'cast time'}`;
                            if (effectiveCastTime <= 0) {
                              unavailableReason = 'No cast time';
                              valueBase = 0;
                              valueFinal = 0;
                            } else {
                              valueBase = totalDmgBase / effectiveCastTime;
                              valueFinal = totalDmgFinal / effectiveCastTime;
                            }
                            break;
                          case 'damagePerEnd':
                            label = 'DPE';
                            title = 'Damage per Endurance — damage / endurance cost';
                            if (endCost <= 0) {
                              unavailableReason = 'No endurance cost';
                              valueBase = 0;
                              valueFinal = 0;
                            } else {
                              valueBase = totalDmgBase / endCost;
                              valueFinal = totalDmgFinal / endCost;
                            }
                            break;
                          case 'damagePerSec':
                          default:
                            label = 'DPS';
                            title = 'Damage per Second — damage / full cycle time (cast + recharge)';
                            valueBase = baseDPS;
                            valueFinal = finalDPS;
                            break;
                        }

                        const improved = valueFinal > valueBase * 1.01;
                        const procContribution =
                          damageDisplayMode === 'damagePerSec' && finalCycleTime > 0
                            ? procDamagePerActivation / finalCycleTime
                            : damageDisplayMode === 'damagePerAnim' && effectiveCastTime > 0
                            ? procDamagePerActivation / effectiveCastTime
                            : damageDisplayMode === 'damagePerEnd' && endCost > 0
                            ? procDamagePerActivation / endCost
                            : procDamagePerActivation;

                        return (
                          <div>
                            <span className="text-slate-500" title={title}>{label}</span>
                            {unavailableReason ? (
                              <div className="text-slate-500" title={unavailableReason}>—</div>
                            ) : (
                              <div className={improved ? 'text-amber-400' : 'text-slate-300'}>
                                {valueFinal.toFixed(2)}
                                {improved && valueBase > 0 && (
                                  <span className="text-green-400 text-[10px] ml-1">
                                    (+{((valueFinal / valueBase - 1) * 100).toFixed(0)}%)
                                  </span>
                                )}
                                {procDamagePerActivation > 0 && (
                                  <span className="text-cyan-400 text-[10px] ml-1" title="Includes proc damage">
                                    +{procContribution.toFixed(1)} proc
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}

      {/* Inherent AT damage bonus info panels */}
      {inherentInfo && calculatedDamage && (
        <>
          {/* Scourge (Corruptor) */}
          {archetypeId === 'corruptor' && isCorruptorAttackPower(powerSet) && (() => {
            const scourgeInfo = getScourgeInfo();
            return (
              <div className={`text-[10px] rounded px-2 py-1.5 border ${
                scourgeActive
                  ? 'bg-sk-magenta/10 border-sk-magenta/30'
                  : 'bg-slate-800/50 border-slate-700/30'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${scourgeActive ? 'text-sk-magenta' : 'text-slate-400'}`}>
                    Scourge
                  </span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                    scourgeActive ? 'bg-sk-magenta/20 text-sk-magenta' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {scourgeActive ? 'SHOWING AVG' : 'Hidden'}
                  </span>
                </div>
                {scourgeActive && (
                  <div className="mt-1 text-[9px]">
                    <span className="text-sk-magenta/70">+{(scourgeInfo.averageDamageBonus * 100).toFixed(0)}% avg dmg</span>
                    <span className="text-slate-500 ml-1">(×{(1 + scourgeInfo.averageDamageBonus).toFixed(2)} multiplier)</span>
                  </div>
                )}
                {!scourgeActive && (
                  <div className="text-[8px] text-slate-500 mt-0.5">
                    {scourgeInfo.chanceFormula}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Fury (Brute) */}
          {archetypeId === 'brute' && isBruteAttackPower(powerSet) && (() => {
            const furyInfo = getFuryInfo();
            const currentBonus = calculateFuryDamageBonus(furyLevel);
            return (
              <div className={`text-[10px] rounded px-2 py-1.5 border ${
                furyLevel > 0
                  ? 'bg-sk-magenta/10 border-sk-magenta/30'
                  : 'bg-slate-800/50 border-slate-700/30'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${furyLevel > 0 ? 'text-sk-magenta' : 'text-slate-400'}`}>
                    Fury
                  </span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                    furyLevel > 0 ? 'bg-sk-magenta/20 text-sk-magenta' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {furyLevel}/{furyInfo.maxFury}
                  </span>
                </div>
                <div className="mt-1 text-[9px]">
                  <span className="text-sk-magenta/70">+{(currentBonus * 100).toFixed(0)}% damage</span>
                  <span className="text-slate-500 ml-1">({furyInfo.damagePerFury * 100}% per fury)</span>
                </div>
              </div>
            );
          })()}

          {/* Critical Hits (Scrapper) */}
          {archetypeId === 'scrapper' && isScrapperAttackPower(powerSet) && (() => {
            const criticalHitInfo = getCriticalHitInfo();
            return (
              <div className={`text-[10px] rounded px-2 py-1.5 border ${
                criticalHitsActive
                  ? 'bg-sk-magenta/10 border-sk-magenta/30'
                  : 'bg-slate-800/50 border-slate-700/30'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${criticalHitsActive ? 'text-sk-magenta' : 'text-slate-400'}`}>
                    Critical Hits
                  </span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                    criticalHitsActive ? 'bg-sk-magenta/20 text-sk-magenta' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {criticalHitsActive ? 'SHOWING AVG' : 'Hidden'}
                  </span>
                </div>
                {criticalHitsActive && (
                  <div className="mt-1 space-y-0.5 text-[9px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">vs Minions:</span>
                      <span className="text-sk-magenta/70">
                        {(criticalHitInfo.chanceVsMinions * 100).toFixed(0)}% → +{(criticalHitInfo.averageBonusVsMinions * 100).toFixed(0)}% avg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">vs Lt/Boss+:</span>
                      <span className="text-sk-magenta/70">
                        {(criticalHitInfo.chanceVsHigher * 100).toFixed(0)}% → +{(criticalHitInfo.averageBonusVsHigher * 100).toFixed(0)}% avg
                      </span>
                    </div>
                  </div>
                )}
                {!criticalHitsActive && (
                  <div className="text-[8px] text-slate-500 mt-0.5">
                    5% crit vs minions, 10% vs higher ranks
                  </div>
                )}
              </div>
            );
          })()}

          {/* Assassination (Stalker) */}
          {archetypeId === 'stalker' && isStalkerAttackPower(powerSet) && (() => {
            const currentBonus = calculateAssassinationDamageBonus(effectiveHidden, stalkerTeamSize);
            return (
              <div className={`text-[10px] rounded px-2 py-1.5 border ${
                effectiveHidden
                  ? 'bg-sk-magenta/15 border-sk-magenta/40'
                  : currentBonus > 0
                    ? 'bg-sk-magenta/10 border-sk-magenta/30'
                    : 'bg-slate-800/50 border-slate-700/30'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${effectiveHidden || currentBonus > 0 ? 'text-sk-magenta' : 'text-slate-400'}`}>
                    Assassination
                  </span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                    effectiveHidden ? 'bg-sk-magenta/25 text-sk-magenta' : 'bg-sk-magenta/20 text-sk-magenta'
                  }`}>
                    {effectiveHidden ? 'ALPHA STRIKE' : `${stalkerTeamSize === 0 ? 'Solo' : `+${stalkerTeamSize}`}`}
                  </span>
                </div>
                <div className="mt-1 text-[9px]">
                  {effectiveHidden ? (
                    <span className="text-sk-magenta/70 font-medium">100% critical from Hide — +100% avg damage on opening attack</span>
                  ) : (
                    <span className="text-sk-magenta/70">+{(currentBonus * 100).toFixed(0)}% avg from Assassination</span>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Containment (Controller) */}
          {archetypeId === 'controller' && isControllerPower(powerSet) && (() => {
            const containmentInfo = getContainmentInfo();
            return (
              <div className={`text-[10px] rounded px-2 py-1.5 border ${
                containmentActive
                  ? 'bg-sk-magenta/15 border-sk-magenta/40'
                  : 'bg-slate-800/50 border-slate-700/30'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${containmentActive ? 'text-sk-magenta' : 'text-slate-400'}`}>
                    Containment
                  </span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                    containmentActive ? 'bg-sk-magenta/20 text-sk-magenta' : 'bg-slate-700/50 text-slate-400'
                  }`}>
                    {containmentActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="mt-1 space-y-0.5 text-[9px]">
                  <div className={containmentActive ? 'text-sk-magenta/70' : 'text-slate-500'}>
                    {containmentInfo.description}
                  </div>
                  {containmentActive && (
                    <div className="text-sk-magenta font-medium">
                      +{((containmentInfo.damageMultiplier - 1) * 100).toFixed(0)}% damage bonus
                    </div>
                  )}
                </div>
                <div className="text-[8px] text-slate-500 mt-1 pt-1 border-t border-sk-magenta/30">
                  Toggle in header to show damage vs controlled targets
                </div>
              </div>
            );
          })()}
        </>
      )}

      {/* Enhancement Bonuses Summary */}
      {hasEnhancements && Object.keys(enhancementBonuses).length > 0 && (() => {
        const hasAlpha = Object.values(alphaBonuses).some((v) => v !== undefined && v !== 0);
        return (
          <div className="border-t border-slate-700 pt-2 mt-2">
            <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Enhancement Bonuses (after ED)
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
              {Object.entries(enhancementBonuses).map(([aspect, value]) => {
                const total = (value || 0) * 100;
                const alphaVal = (alphaBonuses[aspect] || 0) * 100;
                const hasAlphaForAspect = alphaVal > 0;
                const ioOnly = total - alphaVal;
                return (
                  <div key={aspect} className="flex justify-between">
                    <span className="text-slate-400 capitalize">{aspect}</span>
                    <span className="text-green-400">
                      +{total.toFixed(2)}%
                      {hasAlpha && hasAlphaForAspect && (
                        <span className="text-slate-500 text-[10px]"> ({ioOnly.toFixed(0)}%)</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
            {hasAlpha && (
              <p className="text-[9px] text-slate-600 mt-1">Includes Alpha incarnate</p>
            )}
          </div>
        );
      })()}

      {/* Perma Tracker */}
      {isPermaEligible(power) && (() => {
        const permaTracked = useUIStore.getState().permaTrackedPowers.includes(power.internalName);
        const togglePerma = useUIStore.getState().togglePermaTracked;
        const permaInfo = calculatePermaInfo(power, enhancementBonuses, (globalBonuses.recharge ?? 0) / 100);

        return (
          <div className="border-t border-slate-700 pt-2 mt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide">
                Perma Tracker
              </h4>
              <button
                onClick={() => togglePerma(power.internalName)}
                className={`text-[9px] px-2 py-0.5 rounded border transition-colors ${
                  permaTracked
                    ? 'bg-sk-magenta/20 border-sk-magenta/50 text-sk-magenta'
                    : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'
                }`}
              >
                {permaTracked ? 'Tracking' : 'Track'}
              </button>
            </div>
            {permaInfo && (
              <div className="mt-1.5 bg-slate-800/50 rounded p-2 space-y-1">
                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all bg-sk-magenta"
                      style={{ width: `${permaInfo.permaPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-semibold min-w-[3rem] text-right text-sk-magenta">
                    {permaInfo.isPerma ? 'PERMA' : `${permaInfo.permaPercent.toFixed(1)}%`}
                  </span>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">+Recharge</span>
                    <span className={permaInfo.totalRecharge > 0 ? 'text-green-400' : 'text-slate-300'}>
                      {(permaInfo.totalRecharge * 100).toFixed(0)}% / {(permaInfo.rechargeNeeded * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Eff. Rchg</span>
                    <span className={permaInfo.effectiveRecharge < permaInfo.baseRecharge ? 'text-green-400' : 'text-slate-300'}>
                      {permaInfo.effectiveRecharge.toFixed(1)}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Base / Duration</span>
                    <span className="text-slate-300">{permaInfo.baseRecharge}s / {permaInfo.duration}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gap</span>
                    <span className={permaInfo.isPerma ? 'text-green-400' : 'text-red-400'}>
                      {permaInfo.isPerma ? 'None' : `${(permaInfo.effectiveRecharge - permaInfo.duration).toFixed(1)}s`}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Description (at bottom - least important info) */}
      <div className="border-t border-slate-700 pt-2 mt-2">
        <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
          Description
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: power.description
            .replace(/<br\s*\/?>/gi, ' ')
            .replace(/<[^>]+>/g, '')
            .replace(/NOTE:\s*(.*?)(?:\.|$)/g, '<span class="block mt-1 text-amber-400 font-semibold">NOTE: $1.</span>')
          }}
        />
      </div>
    </div>
  );
}

interface EnhancementInfoProps {
  enhancementId: string;
}

function EnhancementInfo({ enhancementId }: EnhancementInfoProps) {
  // TODO: Implement enhancement info display
  return (
    <div className="text-slate-500 text-xs">
      Enhancement: {enhancementId}
    </div>
  );
}

// ============================================
// INCARNATE INFO
// ============================================

interface IncarnateInfoProps {
  slotId: IncarnateSlotId;
  powerId: string;
}

function IncarnateInfo({ slotId, powerId }: IncarnateInfoProps) {
  const build = useBuildStore((s) => s.build);
  const incarnateActive = useUIStore((s) => s.incarnateActive);

  const selectedPower = build.incarnates?.[slotId];
  if (!selectedPower) {
    return (
      <div className="text-slate-500 text-xs">
        No incarnate power selected for this slot.
      </div>
    );
  }

  const slotColor = getSlotColor(slotId);
  const tierColor = getTierColor(selectedPower.tier);
  const tierName = getTierDisplayName(selectedPower.tier);
  const isToggleable = isSlotToggleable(slotId);
  const isActive = isToggleable ? incarnateActive[slotId as ToggleableIncarnateSlot] : false;
  const iconPath = getPowerIconPath(selectedPower.icon);

  // Get the effects based on slot type
  const alphaEffects = slotId === 'alpha' ? getAlphaEffects(powerId) : null;
  const destinyEffects = slotId === 'destiny' ? getDestinyEffects(powerId) : null;
  const hybridEffects = slotId === 'hybrid' ? getHybridEffects(powerId) : null;
  const interfaceEffects = slotId === 'interface' ? getInterfaceEffects(powerId) : null;
  const judgementEffects = slotId === 'judgement' ? getJudgementEffects(powerId) : null;
  const loreEffects = slotId === 'lore' ? getLoreEffects(powerId) : null;

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-start gap-2">
        <div
          className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0"
          style={{
            boxShadow: `0 0 6px ${tierColor}60`,
            border: `2px solid ${tierColor}`,
          }}
        >
          <img
            src={iconPath}
            alt={selectedPower.displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-tight" style={{ color: slotColor }}>
            {selectedPower.displayName}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-slate-400 capitalize">{slotId}</span>
            <span className="text-[10px]" style={{ color: tierColor }}>
              {tierName}
            </span>
          </div>
          {isToggleable && (
            <div className={`text-[9px] mt-0.5 ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
              {isActive ? 'Active - bonuses applied' : 'Inactive - bonuses not applied'}
            </div>
          )}
        </div>
      </div>

      {/* Tree info */}
      <div className="text-[10px] text-slate-400">
        Tree: <span className="text-slate-300">{selectedPower.treeName}</span>
      </div>

      {/* Alpha Effects (Enhancement bonuses) */}
      {alphaEffects && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Enhancement Bonuses
          </h4>
          <p className="text-[9px] text-slate-500 mb-1">
            Applies to all powers that accept these enhancement types.
          </p>
          <div className="bg-slate-800/50 rounded p-2 space-y-0.5">
            {/* Header row for Alpha effects */}
            <div className="grid grid-cols-[5rem_1fr_1fr] gap-1 text-[9px] text-slate-500 uppercase mb-0.5 border-b border-slate-700 pb-0.5">
              <span>Aspect</span>
              <span>Total</span>
              <span>ED Bypass</span>
            </div>
            {alphaEffects.damage !== undefined && (
              <AlphaEffectRow label="Damage" value={alphaEffects.damage} edBypass={alphaEffects.edBypass} colorClass="text-red-400" />
            )}
            {alphaEffects.accuracy !== undefined && (
              <AlphaEffectRow label="Accuracy" value={alphaEffects.accuracy} edBypass={alphaEffects.edBypass} colorClass="text-yellow-400" />
            )}
            {alphaEffects.recharge !== undefined && (
              <AlphaEffectRow label="Recharge" value={alphaEffects.recharge} edBypass={alphaEffects.edBypass} colorClass="text-cyan-400" />
            )}
            {alphaEffects.enduranceReduction !== undefined && (
              <AlphaEffectRow label="End Reduc" value={alphaEffects.enduranceReduction} edBypass={alphaEffects.edBypass} colorClass="text-blue-400" />
            )}
            {alphaEffects.heal !== undefined && (
              <AlphaEffectRow label="Heal" value={alphaEffects.heal} edBypass={alphaEffects.edBypass} colorClass="text-green-400" />
            )}
            {alphaEffects.defense !== undefined && (
              <AlphaEffectRow label="Defense" value={alphaEffects.defense} edBypass={alphaEffects.edBypass} colorClass="text-purple-400" />
            )}
            {alphaEffects.resistance !== undefined && (
              <AlphaEffectRow label="Resistance" value={alphaEffects.resistance} edBypass={alphaEffects.edBypass} colorClass="text-orange-400" />
            )}
            {alphaEffects.range !== undefined && (
              <AlphaEffectRow label="Range" value={alphaEffects.range} edBypass={alphaEffects.edBypass} colorClass="text-slate-300" />
            )}
            {alphaEffects.hold !== undefined && (
              <AlphaEffectRow label="Hold" value={alphaEffects.hold} edBypass={alphaEffects.edBypass} colorClass="text-purple-400" />
            )}
            {alphaEffects.stun !== undefined && (
              <AlphaEffectRow label="Stun" value={alphaEffects.stun} edBypass={alphaEffects.edBypass} colorClass="text-purple-400" />
            )}
            {alphaEffects.immobilize !== undefined && (
              <AlphaEffectRow label="Immobilize" value={alphaEffects.immobilize} edBypass={alphaEffects.edBypass} colorClass="text-purple-400" />
            )}
            {alphaEffects.sleep !== undefined && (
              <AlphaEffectRow label="Sleep" value={alphaEffects.sleep} edBypass={alphaEffects.edBypass} colorClass="text-purple-400" />
            )}
            {alphaEffects.fear !== undefined && (
              <AlphaEffectRow label="Fear" value={alphaEffects.fear} edBypass={alphaEffects.edBypass} colorClass="text-purple-400" />
            )}
            {alphaEffects.confuse !== undefined && (
              <AlphaEffectRow label="Confuse" value={alphaEffects.confuse} edBypass={alphaEffects.edBypass} colorClass="text-purple-400" />
            )}
            {alphaEffects.slow !== undefined && (
              <AlphaEffectRow label="Slow" value={alphaEffects.slow} edBypass={alphaEffects.edBypass} colorClass="text-cyan-400" />
            )}
            {alphaEffects.toHitBuff !== undefined && (
              <AlphaEffectRow label="ToHit Buff" value={alphaEffects.toHitBuff} edBypass={alphaEffects.edBypass} colorClass="text-yellow-400" />
            )}
            {alphaEffects.toHitDebuff !== undefined && (
              <AlphaEffectRow label="ToHit Debuff" value={alphaEffects.toHitDebuff} edBypass={alphaEffects.edBypass} colorClass="text-yellow-400" />
            )}
            {alphaEffects.defenseDebuff !== undefined && (
              <AlphaEffectRow label="Def Debuff" value={alphaEffects.defenseDebuff} edBypass={alphaEffects.edBypass} colorClass="text-purple-400" />
            )}
            {alphaEffects.taunt !== undefined && (
              <AlphaEffectRow label="Taunt" value={alphaEffects.taunt} edBypass={alphaEffects.edBypass} colorClass="text-slate-300" />
            )}
            {alphaEffects.runSpeed !== undefined && (
              <AlphaEffectRow label="Run Speed" value={alphaEffects.runSpeed} edBypass={alphaEffects.edBypass} colorClass="text-cyan-400" />
            )}
            {alphaEffects.jumpSpeed !== undefined && (
              <AlphaEffectRow label="Jump Speed" value={alphaEffects.jumpSpeed} edBypass={alphaEffects.edBypass} colorClass="text-cyan-400" />
            )}
            {alphaEffects.flySpeed !== undefined && (
              <AlphaEffectRow label="Fly Speed" value={alphaEffects.flySpeed} edBypass={alphaEffects.edBypass} colorClass="text-cyan-400" />
            )}
            {alphaEffects.absorb !== undefined && (
              <AlphaEffectRow label="Absorb" value={alphaEffects.absorb} edBypass={alphaEffects.edBypass} colorClass="text-blue-400" />
            )}
          </div>
          {/* Level Shift and ED Bypass info */}
          <div className="mt-1.5 space-y-0.5">
            {alphaEffects.levelShift !== undefined && alphaEffects.levelShift > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-amber-400">Level Shift</span>
                <span className="text-amber-400">+{alphaEffects.levelShift}</span>
              </div>
            )}
            {alphaEffects.edBypass !== undefined && (
              <div className="text-[9px] text-slate-500 mt-1">
                ED Bypass: {(alphaEffects.edBypass * 100).toFixed(1)}% of bonuses ignore Enhancement Diversification
              </div>
            )}
          </div>
        </div>
      )}

      {/* Destiny Effects (Direct stat bonuses) */}
      {destinyEffects && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Buff Effects <span className="text-slate-600 font-normal">(initial values)</span>
          </h4>
          <div className="bg-slate-800/50 rounded p-2 space-y-0.5">
            {destinyEffects.defenseAll !== undefined && (
              <IncarnateEffectRow label="Defense (All)" value={destinyEffects.defenseAll} colorClass="text-purple-400" />
            )}
            {destinyEffects.resistanceAll !== undefined && (
              <IncarnateEffectRow label="Resistance (All)" value={destinyEffects.resistanceAll} colorClass="text-orange-400" />
            )}
            {destinyEffects.regeneration !== undefined && (
              <IncarnateEffectRow label="Regeneration" value={destinyEffects.regeneration} colorClass="text-green-400" />
            )}
            {destinyEffects.recovery !== undefined && (
              <IncarnateEffectRow label="Recovery" value={destinyEffects.recovery} colorClass="text-blue-400" />
            )}
            {destinyEffects.damage !== undefined && (
              <IncarnateEffectRow label="Damage" value={destinyEffects.damage} colorClass="text-red-400" />
            )}
            {destinyEffects.toHit !== undefined && (
              <IncarnateEffectRow label="ToHit" value={destinyEffects.toHit} colorClass="text-yellow-400" />
            )}
            {destinyEffects.recharge !== undefined && (
              <IncarnateEffectRow label="Recharge" value={destinyEffects.recharge} colorClass="text-cyan-400" />
            )}
            {destinyEffects.healPercent !== undefined && (
              <IncarnateEffectRow label="Heal" value={destinyEffects.healPercent} colorClass="text-green-400" />
            )}
            {destinyEffects.mezProtection !== undefined && (
              <div className="flex justify-between text-xs">
                <span className="text-purple-400">Mez Protection</span>
                <span className="text-purple-400">Mag {destinyEffects.mezProtection}</span>
              </div>
            )}
            {destinyEffects.levelShift !== undefined && destinyEffects.levelShift > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-amber-400">Level Shift</span>
                <span className="text-amber-400">+{destinyEffects.levelShift}</span>
              </div>
            )}
          </div>
          {destinyEffects.initialDuration !== undefined && (
            <div className="text-[9px] text-slate-500 mt-1">
              Duration: {destinyEffects.initialDuration}s peak / {destinyEffects.totalDuration}s total
            </div>
          )}
        </div>
      )}

      {/* Hybrid Effects */}
      {hybridEffects && (
        <div>
          {/* Passive bonuses (always-on) */}
          {Object.keys(hybridEffects.passive).length > 0 && (
            <>
              <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Passive (Always-On)
              </h4>
              <div className="bg-slate-800/50 rounded p-2 space-y-0.5 mb-2">
                {Object.entries(hybridEffects.passive).map(([stat, value]) => (
                  <IncarnateEffectRow key={stat} label={formatHybridStatName(stat)} value={value} colorClass={hybridStatColor(stat)} />
                ))}
              </div>
            </>
          )}
          {/* Front-loaded toggle bonuses */}
          {Object.keys(hybridEffects.frontLoaded).length > 0 && (
            <>
              <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Toggle (Baseline)
              </h4>
              <div className="bg-slate-800/50 rounded p-2 space-y-0.5 mb-2">
                {Object.entries(hybridEffects.frontLoaded).map(([stat, value]) => (
                  <IncarnateEffectRow key={stat} label={formatHybridStatName(stat)} value={value} colorClass={hybridStatColor(stat)} />
                ))}
              </div>
            </>
          )}
          {/* Per-target stacking */}
          {Object.keys(hybridEffects.perTarget).length > 0 && (
            <>
              <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Per Enemy (max {hybridEffects.maxTargets})
              </h4>
              <div className="bg-slate-800/50 rounded p-2 space-y-0.5 mb-2">
                {Object.entries(hybridEffects.perTarget).map(([stat, value]) => (
                  <IncarnateEffectRow key={stat} label={formatHybridStatName(stat)} value={value} colorClass={hybridStatColor(stat)} />
                ))}
              </div>
            </>
          )}
          <div className="text-[9px] text-slate-500 mt-1">
            Duration: {hybridEffects.duration}s / Recharge: {hybridEffects.recharge}s
          </div>
        </div>
      )}

      {/* Interface Effects (Proc-based) */}
      {interfaceEffects && (() => {
        const dotDmg = interfaceEffects.dotDamage && interfaceEffects.dotTableName
          ? calculateIncarnateDamage(interfaceEffects.dotDamage, interfaceEffects.dotTableName, build.archetype.id ?? '', build.level)
          : null;
        return (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Proc Effects
          </h4>
          <div className="bg-slate-800/50 rounded p-2 space-y-0.5">
            {interfaceEffects.debuffType && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Debuff</span>
                <span className="text-orange-400">{interfaceEffects.debuffType}</span>
              </div>
            )}
            {interfaceEffects.debuffMagnitude !== undefined && (
              <IncarnateEffectRow label="Magnitude" value={interfaceEffects.debuffMagnitude} colorClass="text-orange-400" />
            )}
            {interfaceEffects.dotType && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">DoT ({interfaceEffects.dotType})</span>
                <span className="text-red-400">
                  {dotDmg !== null ? `${dotDmg.toFixed(1)}` : `${((interfaceEffects.dotDamage || 0) * 100).toFixed(0)}% scale`}
                </span>
              </div>
            )}
            {interfaceEffects.procChance !== undefined && (
              <IncarnateEffectRow label="Proc Chance" value={interfaceEffects.procChance} colorClass="text-cyan-400" />
            )}
          </div>
        </div>
        ); })()}

      {/* Judgement Effects (Click attack) */}
      {judgementEffects && (() => {
        const judgementDamage = calculateIncarnateDamage(
          judgementEffects.damageScale, judgementEffects.tableName,
          build.archetype.id ?? '', build.level
        );
        return (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Attack Details
          </h4>
          <div className="bg-slate-800/50 rounded p-2 space-y-0.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Damage ({judgementEffects.damageType})</span>
              <span className="text-red-400">
                {judgementDamage !== null ? `${judgementDamage.toFixed(1)}` : `${judgementEffects.damageScale} scale`}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Effect Area</span>
              <span className="text-cyan-400">{judgementEffects.effectArea}</span>
            </div>
            {judgementEffects.range > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Range</span>
                <span className="text-slate-300">{judgementEffects.range} ft</span>
              </div>
            )}
            {judgementEffects.radius > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Radius</span>
                <span className="text-slate-300">{judgementEffects.radius} ft</span>
              </div>
            )}
            {judgementEffects.arc > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Arc</span>
                <span className="text-slate-300">{judgementEffects.arc}&deg;</span>
              </div>
            )}
            {judgementEffects.maxTargets > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Max Targets</span>
                <span className="text-slate-300">{judgementEffects.maxTargets}</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Activation</span>
              <span className="text-slate-300">{judgementEffects.activationTime}s</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Recharge</span>
              <span className="text-slate-300">{judgementEffects.rechargeTime}s</span>
            </div>
          </div>
          {judgementEffects.secondaryEffects.length > 0 && (
            <div className="mt-1">
              <div className="text-[9px] text-slate-500 mb-0.5">Secondary Effects:</div>
              <div className="flex flex-wrap gap-1">
                {judgementEffects.secondaryEffects.map((effect, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 bg-slate-700/50 rounded text-amber-400">
                    {effect}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        ); })()}

      {/* Lore Effects (Pet summon) */}
      {loreEffects && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Summon Details
          </h4>
          <div className="bg-slate-800/50 rounded p-2 space-y-0.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Faction</span>
              <span className="text-cyan-400">{loreEffects.faction}</span>
            </div>
            <div className="text-xs mt-1">
              <span className="text-slate-400">Pets:</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {loreEffects.pets.map((pet, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 bg-slate-700/50 rounded text-green-400">
                    {pet}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-slate-400">Duration</span>
              <span className="text-slate-300">{loreEffects.duration}s ({Math.round(loreEffects.duration / 60)}m)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Recharge</span>
              <span className="text-slate-300">{loreEffects.rechargeTime}s ({Math.round(loreEffects.rechargeTime / 60)}m)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Convert hybrid stat keys (e.g. 'resSmashing', 'defMelee', 'regeneration') to display names */
function formatHybridStatName(stat: string): string {
  const map: Record<string, string> = {
    damage: 'Damage', regeneration: 'Regeneration', recovery: 'Recovery',
    enduranceDiscount: 'End Discount', statusResistance: 'Status Resistance',
    resSmashing: 'Res Smashing', resLethal: 'Res Lethal', resFire: 'Res Fire',
    resCold: 'Res Cold', resEnergy: 'Res Energy', resNegative: 'Res Negative',
    resPsionic: 'Res Psionic', resToxic: 'Res Toxic',
    defMelee: 'Def Melee', defRanged: 'Def Ranged', defAoE: 'Def AoE',
    defSmashing: 'Def Smashing', defLethal: 'Def Lethal', defFire: 'Def Fire',
    defCold: 'Def Cold', defEnergy: 'Def Energy', defNegative: 'Def Negative',
    defPsionic: 'Def Psionic', defToxic: 'Def Toxic',
    protHold: 'Prot Hold', protStun: 'Prot Stun', protImmobilize: 'Prot Immobilize',
    protSleep: 'Prot Sleep', protConfuse: 'Prot Confuse', protFear: 'Prot Fear',
  };
  return map[stat] || stat;
}

function hybridStatColor(stat: string): string {
  if (stat.startsWith('res')) return 'text-orange-400';
  if (stat.startsWith('def')) return 'text-purple-400';
  if (stat.startsWith('prot')) return 'text-purple-400';
  if (stat === 'regeneration') return 'text-green-400';
  if (stat === 'damage') return 'text-red-400';
  if (stat === 'statusResistance') return 'text-purple-400';
  if (stat === 'enduranceDiscount') return 'text-blue-400';
  return 'text-slate-400';
}

function IncarnateEffectRow({
  label,
  value,
  colorClass,
  suffix = '',
}: {
  label: string;
  value: number;
  colorClass: string;
  suffix?: string;
}) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-slate-400">{label}</span>
      <span className={colorClass}>{formatEffectValue(value)}{suffix}</span>
    </div>
  );
}

/**
 * Alpha effect row with ED bypass calculation
 * Shows total bonus and the portion that bypasses ED
 */
function AlphaEffectRow({
  label,
  value,
  edBypass,
  colorClass,
}: {
  label: string;
  value: number;
  edBypass?: number;
  colorClass: string;
}) {
  const bypassValue = edBypass !== undefined ? value * edBypass : 0;
  return (
    <div className="grid grid-cols-[5rem_1fr_1fr] gap-1 items-baseline text-xs">
      <span className="text-slate-400">{label}</span>
      <span className={colorClass}>{formatEffectValue(value)}</span>
      <span className="text-green-400">
        {edBypass !== undefined ? formatEffectValue(bypassValue) : '—'}
      </span>
    </div>
  );
}

// ============================================
// PET DAMAGE DISPLAY
// ============================================

interface PetDamageDisplayProps {
  summon: SummonEffect;
  level: number;
  enhancementDamageBonus: number;
  globalDamageBonus: number;
  /** Power's archetype id — used to label the aggregate row "Henchmen"
   *  (Mastermind) vs the more neutral "Pet" for everyone else. */
  archetypeId?: string;
}

/** Effect type display info */
const EFFECT_DISPLAY: Record<string, { label: string; color: string }> = {
  Heal: { label: 'Heal', color: 'text-green-400' },
  Sleep: { label: 'Sleep', color: 'text-purple-400' },
  Hold: { label: 'Hold', color: 'text-purple-400' },
  Stun: { label: 'Stun', color: 'text-purple-400' },
  Fear: { label: 'Fear', color: 'text-purple-400' },
  Confuse: { label: 'Confuse', color: 'text-purple-400' },
  Immobilize: { label: 'Immobilize', color: 'text-purple-400' },
  Knockback: { label: 'Knockback', color: 'text-cyan-400' },
  Knockup: { label: 'Knockup', color: 'text-cyan-400' },
  Taunt: { label: 'Taunt', color: 'text-yellow-400' },
  EndDrain: { label: '-End', color: 'text-blue-400' },
  RecoveryDebuff: { label: '-Recovery', color: 'text-blue-400' },
  ToHitDebuff: { label: '-ToHit', color: 'text-orange-400' },
  DefenseDebuff: { label: '-Defense', color: 'text-orange-400' },
  Slow: { label: 'Slow', color: 'text-teal-400' },
};

/** Expandable row for a single pet ability with damage */
function PetAbilityRow({ ad }: { ad: PetAbilityDamage }) {
  const [open, setOpen] = useState(false);
  const ability = ad.ability;
  const abilityHasEnh = ad.damagePerHitEnhanced !== ad.damagePerHit;
  const abilityHasBuff = ad.damagePerHitFinal !== ad.damagePerHitEnhanced;

  return (
    <div>
      <div
        role="button"
        aria-expanded={open}
        title={open ? `Hide details for ${ability.displayName}` : `Show damage breakdown by type for ${ability.displayName}`}
        className="grid grid-cols-[1fr_3rem_3rem_3rem_3rem] gap-0.5 text-[9px] items-baseline cursor-pointer select-none hover:bg-slate-800/40 rounded px-0.5"
        onClick={() => setOpen(!open)}
      >
        <span className="text-slate-300 truncate flex items-center gap-0.5">
          <span className="text-[8px] text-slate-600">{open ? '▼' : '▶'}</span>
          {ability.displayName}
          {ability.type === 'Auto' && <span className="text-slate-500 text-[7px]">auto</span>}
        </span>
        <span className="text-red-400 text-right">{ad.damagePerHit.toFixed(1)}</span>
        <span className={`text-right ${abilityHasEnh ? 'text-green-400' : 'text-slate-600'}`}>
          {abilityHasEnh ? ad.damagePerHitEnhanced.toFixed(1) : '—'}
        </span>
        <span className={`text-right ${abilityHasBuff ? 'text-amber-400' : 'text-slate-600'}`}>
          {abilityHasBuff ? ad.damagePerHitFinal.toFixed(1) : '—'}
        </span>
        <span className="text-slate-400 text-right">{ad.dpsFinal.toFixed(1)}</span>
      </div>
      {open && <PetAbilityDetails ability={ability} cycleTime={ad.cycleTime} damageByType={ad.damageByType} />}
    </div>
  );
}

/** Expandable row for a pet ability with effects only (no damage) */
function PetEffectAbilityRow({ ability }: { ability: PetAbility }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div
        role="button"
        aria-expanded={open}
        title={open ? `Hide effects for ${ability.displayName}` : `Show effect details for ${ability.displayName}`}
        className="grid grid-cols-[1fr_3rem_3rem_3rem_3rem] gap-0.5 text-[9px] items-baseline cursor-pointer select-none hover:bg-slate-800/40 rounded px-0.5"
        onClick={() => setOpen(!open)}
      >
        <span className="text-slate-300 truncate flex items-center gap-0.5">
          <span className="text-[8px] text-slate-600">{open ? '▼' : '▶'}</span>
          {ability.displayName}
          {ability.type === 'Auto' && <span className="text-slate-500 text-[7px]">auto</span>}
        </span>
        <span className="text-slate-600 text-right col-span-3">
          {ability.effects?.map(e => {
            const d = EFFECT_DISPLAY[e.type];
            return d?.label || e.type;
          }).join(', ')}
        </span>
        <span className="text-slate-600 text-right">—</span>
      </div>
      {open && <PetAbilityDetails ability={ability} />}
    </div>
  );
}

/** Detail panel shown when a pet ability row is expanded */
function PetAbilityDetails({ ability, cycleTime, damageByType }: {
  ability: PetAbility;
  cycleTime?: number;
  damageByType?: { type: string; base: number; enhanced: number; final: number }[];
}) {
  const stats: { label: string; value: string }[] = [];

  if (ability.type !== 'Auto' || !ability.activatePeriod) {
    if (ability.castTime) stats.push({ label: 'Cast', value: `${ability.castTime}s` });
    if (ability.recharge) stats.push({ label: 'Recharge', value: `${ability.recharge}s` });
  }
  if (ability.activatePeriod) stats.push({ label: 'Period', value: `${ability.activatePeriod}s` });
  if (cycleTime) stats.push({ label: 'Cycle', value: `${cycleTime.toFixed(2)}s` });
  if (ability.effectArea && ability.effectArea !== 'Character') {
    stats.push({ label: 'Area', value: ability.effectArea });
  }
  if (ability.range) stats.push({ label: 'Range', value: `${ability.range}ft` });
  if (ability.radius) stats.push({ label: 'Radius', value: `${ability.radius}ft` });
  if (ability.maxTargets && ability.maxTargets > 1) stats.push({ label: 'Max Targets', value: `${ability.maxTargets}` });
  if (ability.attackTypes?.length) stats.push({ label: 'Attack', value: ability.attackTypes.join(', ') });

  return (
    <div className="ml-3 mb-1 mt-0.5 pl-2 border-l border-slate-700/50">
      {/* Stats grid */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-0 text-[9px]">
          {stats.map((s) => (
            <div key={s.label} className="flex justify-between">
              <span className="text-slate-500">{s.label}</span>
              <span className="text-slate-300">{s.value}</span>
            </div>
          ))}
        </div>
      )}
      {/* Damage type breakdown */}
      {damageByType && damageByType.length > 0 && (
        <div className="mt-0.5">
          {damageByType.map((d) => (
            <div key={d.type} className="flex items-center gap-2 text-[9px]">
              <span className="text-red-400 w-12">{abbreviateDamageType(d.type)}</span>
              <span className="text-slate-300">{d.base.toFixed(1)}</span>
              {d.enhanced !== d.base && <span className="text-green-400">→ {d.enhanced.toFixed(1)}</span>}
              {d.final !== d.enhanced && <span className="text-amber-400">→ {d.final.toFixed(1)}</span>}
            </div>
          ))}
        </div>
      )}
      {/* Effects */}
      {ability.effects && ability.effects.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-0.5">
          {ability.effects.map((eff, i) => {
            const display = EFFECT_DISPLAY[eff.type] || { label: eff.type, color: 'text-slate-400' };
            const magLabel = eff.magnitude ? ` ${eff.magnitude}` : '';
            const chanceLabel = eff.chance && eff.chance < 1 ? ` ${(eff.chance * 100).toFixed(0)}%` : '';
            return (
              <span key={`${eff.type}-${i}`} className={`text-[8px] px-1 py-0.5 rounded bg-slate-800/60 ${display.color}`}>
                {display.label}{magLabel}{chanceLabel}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Single entity DPS display (used inside PetDamageDisplay) */
function SingleEntityDisplay({
  petDamage,
  entityCount,
  label,
  showHeader,
  isPseudoPet,
  duration,
}: {
  petDamage: PetDamageResult | null;
  entityCount: number;
  label: string;
  showHeader: boolean;
  isPseudoPet: boolean;
  duration?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [effectsExpanded, setEffectsExpanded] = useState(false);

  const durationLabel = duration ? `${duration}s` : 'permanent';
  const countLabel = entityCount > 1 ? ` x${entityCount}` : '';

  const hasDamage = petDamage && petDamage.aggregateDpsBase > 0;
  const hasEnh = petDamage && petDamage.aggregateDpsEnhanced !== petDamage.aggregateDpsBase;
  const hasBuff = petDamage && petDamage.aggregateDpsFinal !== petDamage.aggregateDpsEnhanced;
  const hasEffects = petDamage && petDamage.allEffects.length > 0;
  const hasContent = hasDamage || hasEffects;

  return (
    <div>
      {/* Entity header */}
      {showHeader && (
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 text-xs font-medium">
            {isPseudoPet ? '⚡ Creates' : '🐾 Summons'}
          </span>
          <span className="text-slate-200 text-xs">
            {label}{countLabel}
          </span>
          <span className="text-slate-500 text-[10px]">({durationLabel})</span>
        </div>
      )}

      {/* Pet DPS + Effects */}
      {hasContent && (
        <div className="mt-1">
          {hasDamage && (
            <>
              <div
                role="button"
                aria-expanded={expanded}
                title={expanded ? 'Hide per-ability damage breakdown' : 'Show per-ability damage breakdown'}
                className="flex items-center gap-1 cursor-pointer select-none"
                onClick={() => setExpanded(!expanded)}
              >
                <span className="text-[9px] text-slate-500">{expanded ? '▼' : '▶'}</span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {entityCount > 1 ? 'Total' : 'Pet'} DPS:
                </span>
                <span className="text-[10px] text-red-400 font-medium">
                  {petDamage!.aggregateDpsBase.toFixed(1)}
                </span>
                {hasEnh && (
                  <span className="text-[10px] text-green-400">
                    → {petDamage!.aggregateDpsEnhanced.toFixed(1)}
                  </span>
                )}
                {hasBuff && (
                  <span className="text-[10px] text-amber-400">
                    → {petDamage!.aggregateDpsFinal.toFixed(1)}
                  </span>
                )}
              </div>

              {entityCount > 1 && (
                <div className="text-[9px] text-slate-500 ml-3">
                  Per pet: {petDamage!.totalDpsBase.toFixed(1)}
                  {hasEnh && ` → ${petDamage!.totalDpsEnhanced.toFixed(1)}`}
                  {hasBuff && ` → ${petDamage!.totalDpsFinal.toFixed(1)}`}
                </div>
              )}
            </>
          )}

          {/* Expanded ability breakdown */}
          {expanded && (
            <div className="mt-1.5 ml-1 space-y-0">
              <div className="grid grid-cols-[1fr_3rem_3rem_3rem_3rem] gap-0.5 text-[8px] text-slate-500 font-medium border-b border-slate-700/50 pb-0.5 mb-0.5">
                <span>Ability</span>
                <span className="text-right">Base</span>
                <span className="text-right">Enh</span>
                <span className="text-right">Final</span>
                <span className="text-right">DPS</span>
              </div>
              {petDamage!.abilities.map((ad) => (
                <PetAbilityRow key={ad.ability.name} ad={ad} />
              ))}
              {petDamage!.effectOnlyAbilities.map((ability) => (
                <PetEffectAbilityRow key={ability.name} ability={ability} />
              ))}
            </div>
          )}

          {/* Effects expandable section */}
          {hasEffects && (
            <div className="mt-1">
              <div
                role="button"
                aria-expanded={effectsExpanded}
                title={effectsExpanded ? 'Hide pet effect list' : 'Show full list of effects this pet applies'}
                className="flex items-center gap-1 cursor-pointer select-none"
                onClick={() => setEffectsExpanded(!effectsExpanded)}
              >
                <span className="text-[9px] text-slate-500">{effectsExpanded ? '▼' : '▶'}</span>
                <span className="text-[10px] text-slate-400 font-medium">Effects</span>
              </div>
              {effectsExpanded && (
                <div className="mt-0.5 ml-3 space-y-0">
                  {petDamage!.allEffects.map((eff) => {
                    const display = EFFECT_DISPLAY[eff.type] || { label: eff.type, color: 'text-slate-400' };
                    const chanceLabel = eff.chance && eff.chance < 1 ? ` (${(eff.chance * 100).toFixed(0)}%)` : '';
                    return (
                      <div key={eff.type} className="grid grid-cols-[1fr_auto] gap-2 text-[9px] py-0.5">
                        <span className={display.color}>
                          {display.label}{chanceLabel}
                        </span>
                        <span className="text-slate-300 text-right tabular-nums">
                          {eff.value !== undefined ? eff.value.toFixed(1) : '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function PetDamageDisplay({ summon, level, enhancementDamageBonus, globalDamageBonus, archetypeId }: PetDamageDisplayProps) {
  const [upgradeTier, setUpgradeTier] = useState(0);

  // Build entity list from either entities array or single entity. Filter out
  // entries we don't have damage data for AND that look visual-only (e.g. Rain
  // of Arrows summons a `P4047293352` visual entity alongside its real damage
  // pseudopet `Pets_RainofArrows`). The visual marker has no abilities and
  // surfaces no useful info to the user — drop it. We keep entries that lack
  // PET_ENTITIES data IF they at least look like a real entity name (e.g.
  // `Pets_*`, `MastermindPets_*`) so unmodeled-but-real pets still show up.
  const entityList = useMemo(() => {
    const raw = summon.entities
      ? summon.entities.map(e => ({ entityName: e.entity, count: e.count }))
      : summon.entity
        ? [{ entityName: summon.entity, count: summon.entityCount || 1 }]
        : [];
    return raw.filter(({ entityName }) => {
      // Has model data → keep
      if (PET_ENTITIES[entityName]) return true;
      // Looks like a real (un-modeled) pet name → keep so we can still surface it
      if (/^(Pets_|MastermindPets_|Villain_Pets_|VillainPets_)/i.test(entityName)) return true;
      // P-hashes and other opaque identifiers without model data are
      // almost always FX / visual placeholders. Drop.
      return false;
    });
  }, [summon.entities, summon.entity, summon.entityCount]);

  // Check max upgrade tier available across all entities
  const maxUpgradeTier = useMemo(() => {
    let max = 0;
    for (const e of entityList) {
      const entity = PET_ENTITIES[e.entityName];
      if (entity?.upgradeTiers) {
        for (const t of entity.upgradeTiers) {
          if (t.tier === 2) max = Math.max(max, 1);
          if (t.tier === 3) max = Math.max(max, 2);
        }
      }
    }
    return max;
  }, [entityList]);

  // Calculate pet damage for each entity
  const petResults = useMemo(() => {
    return entityList.map(e => {
      const applyEnh = shouldApplyEnhancements(e.entityName, summon.copyBoosts);
      const enhBonus = applyEnh ? enhancementDamageBonus : 0;
      return {
        entityName: e.entityName,
        count: e.count,
        result: calculatePetDamage(
          e.entityName, level, e.count, summon.duration,
          enhBonus, applyEnh, globalDamageBonus, upgradeTier
        ),
      };
    });
  }, [entityList, level, enhancementDamageBonus, globalDamageBonus, upgradeTier, summon.copyBoosts, summon.duration]);

  // Aggregate totals across all entities
  const totals = useMemo(() => {
    let base = 0, enhanced = 0, final_ = 0;
    for (const r of petResults) {
      if (r.result) {
        base += r.result.aggregateDpsBase;
        enhanced += r.result.aggregateDpsEnhanced;
        final_ += r.result.aggregateDpsFinal;
      }
    }
    return { base, enhanced, final: final_ };
  }, [petResults]);

  const isMultiEntity = entityList.length > 1;
  const isSingleEntity = entityList.length === 1;
  const hasDamage = totals.base > 0;
  const hasEnh = totals.enhanced !== totals.base;
  const hasBuff = totals.final !== totals.enhanced;
  const durationLabel = summon.duration ? `${summon.duration}s` : 'permanent';

  return (
    <div className="bg-indigo-900/30 rounded p-2 border border-indigo-500/30">
      {/* Upgrade Toggles */}
      {maxUpgradeTier > 0 && (
        <div className="flex items-center gap-3 mb-2 pb-1.5 border-b border-indigo-500/20">
          <span className="text-[10px] text-indigo-400 font-medium">Upgrades:</span>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={upgradeTier >= 1}
              onChange={(e) => setUpgradeTier(e.target.checked ? Math.max(upgradeTier, 1) : 0)}
              className="w-3 h-3 accent-indigo-500"
            />
            <span className={`text-[10px] ${upgradeTier >= 1 ? 'text-indigo-300' : 'text-slate-500'}`}>
              Upgrade 1
            </span>
          </label>
          {maxUpgradeTier >= 2 && (
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={upgradeTier >= 2}
                onChange={(e) => setUpgradeTier(e.target.checked ? 2 : 1)}
                className="w-3 h-3 accent-indigo-500"
                disabled={upgradeTier < 1}
              />
              <span className={`text-[10px] ${upgradeTier >= 2 ? 'text-indigo-300' : 'text-slate-500'}`}>
                Upgrade 2
              </span>
            </label>
          )}
        </div>
      )}

      {/* Single entity display (same as before) */}
      {isSingleEntity && (
        <SingleEntityDisplay
          petDamage={petResults[0]?.result ?? null}
          entityCount={entityList[0].count}
          label={petResults[0]?.result?.displayName || summon.displayName || summon.entity || 'Entity'}
          showHeader={true}
          isPseudoPet={summon.isPseudoPet}
          duration={summon.duration}
        />
      )}

      {/* Multi-entity display */}
      {isMultiEntity && (
        <div className="space-y-2">
          {petResults.map((pr) => (
            <SingleEntityDisplay
              key={pr.entityName}
              petDamage={pr.result}
              entityCount={pr.count}
              label={pr.result?.displayName || pr.entityName.replace(/^(Pets_|MastermindPets_)/i, '').replace(/_/g, ' ')}
              showHeader={true}
              isPseudoPet={summon.isPseudoPet}
              duration={summon.duration}
            />
          ))}

          {/* Aggregate total across all entity types. "Henchmen" only fits
              Mastermind primary summons; everything else (Lore incarnates,
              Phantom Army, summons from epic pools, etc.) gets a neutral label. */}
          {hasDamage && (
            <div className="border-t border-indigo-500/30 pt-1.5 mt-1.5">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-medium">
                  {archetypeId === 'mastermind' ? 'Total Henchmen DPS:' : 'Total Pet DPS:'}
                </span>
                <span className="text-[10px] text-red-400 font-medium">{totals.base.toFixed(1)}</span>
                {hasEnh && <span className="text-[10px] text-green-400">→ {totals.enhanced.toFixed(1)}</span>}
                {hasBuff && <span className="text-[10px] text-amber-400">→ {totals.final.toFixed(1)}</span>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No entity display (pseudopets with no data) */}
      {entityList.length === 0 && (
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 text-xs font-medium">
            {summon.isPseudoPet ? '⚡ Creates' : '🐾 Summons'}
          </span>
          <span className="text-slate-200 text-xs">
            {summon.displayName || 'Entity'}
          </span>
          <span className="text-slate-500 text-[10px]">({durationLabel})</span>
        </div>
      )}

      {/* Fallback: show powers list if no pet data at all */}
      {entityList.length === 0 && summon.powers && summon.powers.length > 0 && (
        <div className="text-[10px] text-slate-500 mt-0.5">
          Powers: {summon.powers.map(p => p.split('.').pop()).join(', ')}
        </div>
      )}
    </div>
  );
}
