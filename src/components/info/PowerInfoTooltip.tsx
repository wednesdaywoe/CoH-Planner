/**
 * PowerInfoTooltip - Floating tooltip that displays power or enhancement info on hover
 * Shows all power stats with Base/Enhanced/Final values
 * Remains responsive to hover changes even when info panel is locked
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useUIStore, useBuildStore, useDominationActive, useScourgeActive, useFuryLevel, useSupremacyActive, useVigilanceTeamSize, useCriticalHitsActive, useStalkerHidden, useStalkerTeamSize, useStalkerCritActive, useContainmentActive, useSentinelCritActive } from '@/stores';
import { getBaseToHit } from '@/data/purple-patch';
import { useGlobalBonuses } from '@/hooks/useCalculatedStats';
import { lookupPower, getArchetype, getIOSet, getPowerset } from '@/data';
import type { Power } from '@/types';
import {
  calculatePowerEnhancementBonuses,
  calculatePowerDamage,
  calculateDefiance,
  getDominationInfo,
  isDominatorControlPower,
  getScourgeInfo,
  calculateScourgeDamage,
  isCorruptorAttackPower,
  getFuryInfo,
  calculateFuryDamageBonus,
  calculateFuryDamage,
  isBruteAttackPower,
  getSupremacyInfo,
  getBodyguardInfo,
  isMastermindPower,
  getVigilanceInfo,
  calculateVigilanceDamageBonus,
  calculateVigilanceDamage,
  isDefenderPower,
  getCriticalHitInfo,
  calculateCriticalHitDamage,
  isScrapperAttackPower,
  getAssassinationInfo,
  calculateAssassinationDamageBonus,
  calculateAssassinationDamage,
  isStalkerAttackPower,
  getGauntletInfo,
  isTankerPower,
  getContainmentInfo,
  calculateContainmentDamage,
  isControllerPower,
  getOpportunityCritBonus,
  calculateOpportunityCritDamage,
  isSentinelAttackPower,
  getAlphaEnhancementBonuses,
  type EnhancementBonuses,
} from '@/utils/calculations';
import { calculatePetDamage, shouldApplyEnhancements, type PetDamageResult } from '@/utils/calculations/pet-damage';
import type { ArchetypeId } from '@/types';
import {
  getEffectiveBuffDebuffModifier,
  convertGlobalBonusesToAspects,
  findSelectedPowerInBuild,
  getDamageCap,
} from './powerDisplayUtils';
import {
  RegistryEffectsDisplay,
} from './SharedPowerComponents';

interface PowerInfoContentProps {
  powerName: string;
  powerSet: string;
}

function PowerInfoContent({ powerName, powerSet }: PowerInfoContentProps) {
  const build = useBuildStore((s) => s.build);
  const archetypeId = build.archetype.id;
  const globalBonuses = useGlobalBonuses();
  const targetLevelOffset = useUIStore((s) => s.targetLevelOffset);
  const incarnateActive = useUIStore((s) => s.incarnateActive);
  const dominationActive = useDominationActive();
  const scourgeActive = useScourgeActive();
  const furyLevel = useFuryLevel();
  const supremacyActive = useSupremacyActive();
  const vigilanceTeamSize = useVigilanceTeamSize();
  const criticalHitsActive = useCriticalHitsActive();
  const stalkerHidden = useStalkerHidden();
  const stalkerTeamSize = useStalkerTeamSize();
  const stalkerCritActive = useStalkerCritActive();
  const containmentActive = useContainmentActive();
  const sentinelCritActive = useSentinelCritActive();

  // Check if Fiery Embrace is active in the build
  const isFieryEmbraceActive = useMemo(() => {
    // Check secondary powers for Fiery Embrace
    const fieryEmbrace = build.secondary.powers.find(p => p.internalName === 'Fiery_Embrace');
    if (fieryEmbrace && fieryEmbrace.isActive) return true;
    // Also check primary (some ATs might have it there)
    const primaryFE = build.primary.powers.find(p => p.internalName === 'Fiery_Embrace');
    if (primaryFE && primaryFE.isActive) return true;
    return false;
  }, [build.secondary.powers, build.primary.powers]);

  // Unified power lookup across all categories
  const lookupResult = lookupPower(powerSet, powerName);
  let basePower: Power | undefined = lookupResult?.power;

  // Archetype inherent fallback (dynamically created, not in static data)
  if (!basePower && powerSet === 'Inherent') {
    const selectedInherent = build.inherents.find((p) => p.internalName === powerName);
    if (selectedInherent) {
      basePower = { ...selectedInherent };
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

  // Calculate enhancement bonuses if power is slotted, plus Alpha bonuses
  const enhancementBonuses = useMemo<EnhancementBonuses>(() => {
    let bonuses: EnhancementBonuses = {};
    if (selectedPower?.slots) {
      bonuses = calculatePowerEnhancementBonuses(
        { name: selectedPower.name, slots: selectedPower.slots },
        build.level,
        getIOSet,
        exemplarMode ? exemplarLevel : undefined
      );
    }

    // Add Alpha incarnate bonuses (these apply universally to all powers)
    for (const [aspect, value] of Object.entries(alphaBonuses)) {
      if (value !== undefined) {
        bonuses[aspect] = (bonuses[aspect] || 0) + value;
      }
    }

    return bonuses;
  }, [selectedPower, build.level, alphaBonuses, exemplarMode, exemplarLevel]);

  // Convert global bonuses to enhancement-aspect-keyed decimals for three-tier display
  const globalBonusesForCalc = useMemo(
    () => convertGlobalBonusesToAspects(globalBonuses),
    [globalBonuses]
  );

  // Get powerset for determining damage type
  const powerset = getPowerset(powerSet);

  // Calculate actual damage using archetype modifiers and level
  const calculatedDamage = useMemo(() => {
    if (!basePower?.damage && !basePower?.effects?.damage) return null;

    // Determine if this is a primary or secondary powerset
    const isPrimary = powerSet === build.primary.id;
    const isSecondary = powerSet === build.secondary.id;

    // Get the powerset category to help determine melee vs ranged
    const powersetCategory = isPrimary
      ? powerset?.category?.toUpperCase()
      : isSecondary
        ? powerset?.category?.toUpperCase()
        : undefined;

    // Get powerset display name
    const powersetName = powerset?.name || '';

    return calculatePowerDamage(
      basePower,
      {
        level: build.level,
        archetypeId: archetypeId as ArchetypeId | undefined,
        primaryName: powersetName,
        primaryCategory: powersetCategory,
      },
      { damage: enhancementBonuses.damage || 0 },
      globalBonusesForCalc.damage,
      0 // active buffs
    );
  }, [basePower, build.level, archetypeId, enhancementBonuses.damage, globalBonusesForCalc.damage, powerSet, build.primary.id, build.secondary.id, powerset]);

  // Extract healing from damage field (e.g., Life Drain, Dark Regeneration, Reconstruction)
  // Powers can define healing as { type: "Heal", scale, table } either as a single object or array entry
  const healFromDamageArray = useMemo(() => {
    const dmg = basePower?.damage ?? basePower?.effects?.damage;
    if (!dmg) return undefined;
    // Single object: { type: "Heal", scale, table }
    if (!Array.isArray(dmg) && typeof dmg === 'object' && 'type' in dmg && (dmg as { type: string }).type === 'Heal') {
      const entry = dmg as { scale: number; table?: string };
      return { scale: entry.scale, table: entry.table };
    }
    // Array: find Heal entry
    if (Array.isArray(dmg)) {
      const healEntry = (dmg as Array<{ type: string; scale: number; table?: string }>)
        .find(e => e.type === 'Heal');
      if (!healEntry) return undefined;
      return { scale: healEntry.scale, table: healEntry.table };
    }
    return undefined;
  }, [basePower?.damage, basePower?.effects?.damage]);

  // Calculate aggregate pet damage (supports multi-entity summons)
  const petDamageAggregate = useMemo<{ results: PetDamageResult[]; base: number; enhanced: number; final: number } | null>(() => {
    const summon = basePower?.effects?.summon;
    if (!summon) return null;

    // Build entity list
    const entityList: { entityName: string; count: number }[] = [];
    if (summon.entities) {
      for (const e of summon.entities) entityList.push({ entityName: e.entity, count: e.count });
    } else if (summon.entity) {
      entityList.push({ entityName: summon.entity, count: summon.entityCount || 1 });
    }
    if (entityList.length === 0) return null;

    const globalDmgBonus = globalBonusesForCalc.damage || 0;
    const results: PetDamageResult[] = [];
    let base = 0, enhanced = 0, final_ = 0;

    for (const e of entityList) {
      const applyEnh = shouldApplyEnhancements(e.entityName, summon.copyBoosts);
      const enhBonus = applyEnh ? (enhancementBonuses.damage || 0) : 0;
      const result = calculatePetDamage(e.entityName, build.level, e.count, summon.duration, enhBonus, applyEnh, globalDmgBonus);
      if (result) {
        results.push(result);
        base += result.aggregateDpsBase;
        enhanced += result.aggregateDpsEnhanced;
        final_ += result.aggregateDpsFinal;
      }
    }

    return results.length > 0 ? { results, base, enhanced, final: final_ } : null;
  }, [basePower?.effects?.summon, build.level, enhancementBonuses.damage, globalBonusesForCalc.damage]);

  // Calculate archetype-specific damage bonuses
  const damageDisplayInfo = useMemo(() => {
    if (!calculatedDamage) return null;

    // Check which archetype inherent applies
    const isCorruptor = archetypeId === 'corruptor';
    const isCorruptorPower = isCorruptorAttackPower(powerSet);
    const showScourge = isCorruptor && isCorruptorPower && scourgeActive;

    const isBrute = archetypeId === 'brute';
    const isBrutePower = isBruteAttackPower(powerSet);
    const showFury = isBrute && isBrutePower && furyLevel > 0;

    const isDefender = archetypeId === 'defender';
    const isDefenderAttackPower = isDefenderPower(powerSet);
    const vigilanceBonus = calculateVigilanceDamageBonus(build.level, vigilanceTeamSize);
    const showVigilance = isDefender && isDefenderAttackPower && vigilanceBonus > 0;

    const isScrapper = archetypeId === 'scrapper';
    const isScrapperPower = isScrapperAttackPower(powerSet);
    const showCriticalHits = isScrapper && isScrapperPower && criticalHitsActive;

    const isStalker = archetypeId === 'stalker';
    const isStalkerPower = isStalkerAttackPower(powerSet);
    const assassinationBonus = calculateAssassinationDamageBonus(stalkerHidden, stalkerTeamSize);
    const showAssassination = isStalker && isStalkerPower && stalkerCritActive;

    const isController = archetypeId === 'controller';
    const isControllerAttackPower = isControllerPower(powerSet);
    const showContainment = isController && isControllerAttackPower && containmentActive;

    const isSentinel = archetypeId === 'sentinel';
    const isSentinelPower = isSentinelAttackPower(powerSet);
    const showOpportunityCrit = isSentinel && isSentinelPower && sentinelCritActive;

    // Determine final column header
    const finalColumnHeader = showScourge ? 'w/ Scourge'
      : showFury ? 'w/ Fury'
      : showVigilance ? 'w/ Vigilance'
      : showCriticalHits ? 'w/ Crit'
      : showAssassination ? (stalkerHidden ? 'w/ Crit' : 'w/ Assassin')
      : showContainment ? 'w/ Contain'
      : showOpportunityCrit ? 'w/ Crit'
      : 'Final';

    // Get color class for inherent-modified values
    const finalColumnColor = showScourge ? 'text-sk-magenta'
      : showFury ? 'text-sk-magenta'
      : showVigilance ? 'text-sk-magenta'
      : showCriticalHits ? 'text-sk-magenta'
      : showAssassination ? 'text-sk-magenta'
      : showContainment ? 'text-sk-magenta'
      : showOpportunityCrit ? 'text-sk-magenta'
      : 'text-amber-400';

    // Function to apply inherent bonus
    const applyInherentBonus = (damage: number) => {
      if (showScourge) return calculateScourgeDamage(damage);
      if (showFury) return calculateFuryDamage(damage, furyLevel);
      if (showVigilance) return calculateVigilanceDamage(damage, build.level, vigilanceTeamSize);
      if (showCriticalHits) return calculateCriticalHitDamage(damage, 'higher');
      if (showAssassination) return calculateAssassinationDamage(damage, stalkerHidden, stalkerTeamSize);
      if (showContainment) return calculateContainmentDamage(damage, true);
      if (showOpportunityCrit) return calculateOpportunityCritDamage(damage);
      return damage;
    };

    return {
      finalColumnHeader,
      finalColumnColor,
      applyInherentBonus,
      showScourge,
      showFury,
      showVigilance,
      showCriticalHits,
      showAssassination,
      showContainment,
      showOpportunityCrit,
      furyBonus: showFury ? calculateFuryDamageBonus(furyLevel) : 0,
      vigilanceBonus,
      assassinationBonus,
      opportunityCritBonus: showOpportunityCrit ? getOpportunityCritBonus() : 0,
    };
  }, [calculatedDamage, archetypeId, powerSet, scourgeActive, furyLevel, vigilanceTeamSize,
      criticalHitsActive, stalkerHidden, stalkerTeamSize, stalkerCritActive, containmentActive,
      sentinelCritActive, build.level]);

  // All hooks are above this point — safe to early return
  if (!basePower) {
    return <div className="text-slate-500 text-[10px]">Power not found</div>;
  }

  // Merge power.stats and normalize effect keys for registry-driven display
  // Pool/inherent powers use different keys than the registry expects
  const rawEffects = basePower.effects ?? {};
  const raw = rawEffects as Record<string, unknown>;

  // Build additional mappings for keys that differ between data formats
  const extraEffects: Record<string, unknown> = {};
  // Execution stats from power.stats
  if (basePower.stats?.endurance) extraEffects.enduranceCost = basePower.powerType === 'Toggle' ? basePower.stats.endurance / (basePower.stats.activatePeriod ?? 0.5) : basePower.stats.endurance;
  if (basePower.stats?.recharge) extraEffects.recharge = basePower.stats.recharge;
  if (basePower.stats?.accuracy) extraEffects.accuracy = basePower.stats.accuracy;
  if (basePower.stats?.range) extraEffects.range = basePower.stats.range;
  if (basePower.stats?.castTime) extraEffects.castTime = basePower.stats.castTime;
  // AoE stats
  if (basePower.stats?.radius) extraEffects.radius = basePower.stats.radius;
  if (basePower.stats?.arc) extraEffects.arc = basePower.stats.arc <= 2 * Math.PI ? basePower.stats.arc * (180 / Math.PI) : basePower.stats.arc;
  if (basePower.stats?.maxTargets) extraEffects.maxTargets = basePower.stats.maxTargets;
  // Map pool/inherent effect keys to registry names
  if (raw.flySpeed && !rawEffects.fly) extraEffects.fly = raw.flySpeed;
  if (rawEffects.runSpeed) extraEffects.runSpeed = rawEffects.runSpeed;
  if (rawEffects.jumpSpeed) extraEffects.jumpSpeed = rawEffects.jumpSpeed;
  if (rawEffects.jumpHeight) extraEffects.jumpHeight = rawEffects.jumpHeight;
  if (raw.regeneration && !rawEffects.regenBuff) extraEffects.regenBuff = raw.regeneration;
  if (raw.recovery && !rawEffects.recoveryBuff) extraEffects.recoveryBuff = raw.recovery;
  // Pool powers may have endurance inside effects instead of stats
  if (raw.endurance && !rawEffects.enduranceCost && !basePower.stats?.endurance) extraEffects.enduranceCost = raw.endurance;
  // Inject healing extracted from damage array
  if (healFromDamageArray && !rawEffects.healing) extraEffects.healing = healFromDamageArray;

  const effects = { ...rawEffects, ...extraEffects } as typeof rawEffects;

  // Get archetype modifier for buff/debuff calculations
  const archetype = archetypeId ? getArchetype(archetypeId as ArchetypeId) : null;
  const buffDebuffMod = archetype?.stats?.buffDebuffModifier ?? 1.0;
  const effectiveMod = getEffectiveBuffDebuffModifier(powerSet, buffDebuffMod);

  // Check for mez effects
  const hasMez = effects?.stun || effects?.hold || effects?.immobilize ||
                 effects?.sleep || effects?.fear || effects?.confuse || effects?.knockback;

  // Check if power has any enhancements
  const hasEnhancements = selectedPower && selectedPower.slots.some(s => s !== null);

  return (
    <div className="space-y-1.5 max-w-[320px]">
      {/* Header */}
      <div>
        <h3 className="text-xs font-semibold text-blue-400 leading-tight">
          {basePower.name}
          {hasEnhancements && (
            <span className="text-[8px] text-green-500 ml-1">(enhanced)</span>
          )}
        </h3>
        <span className="text-[9px] text-slate-400 capitalize">{basePower.powerType}</span>
      </div>

      {/* Short Help */}
      {basePower.shortHelp && (
        <div className="text-[9px] text-amber-400/80 italic">
          {basePower.shortHelp}
        </div>
      )}

      {/* Summon/Pet Info with DPS and Effects */}
      {effects?.summon && (
        <div className="bg-indigo-900/30 rounded p-1 border border-indigo-500/30 text-[9px]">
          {/* Entity labels */}
          {effects.summon.entities ? (
            // Multi-entity: show each entity type
            effects.summon.entities.map((e) => {
              const displayName = e.entity.replace(/^(Pets_|MastermindPets_)/i, '').replace(/_/g, ' ');
              return (
                <div key={e.entity} className="flex items-center gap-1">
                  <span className="text-indigo-400">🐾</span>
                  <span className="text-slate-200">{displayName}{e.count > 1 ? ` x${e.count}` : ''}</span>
                </div>
              );
            })
          ) : (
            // Single entity
            <div className="flex items-center gap-1">
              <span className="text-indigo-400">
                {effects.summon.isPseudoPet ? '⚡' : '🐾'}
              </span>
              <span className="text-slate-200">
                {effects.summon.displayName || effects.summon.entity || 'Entity'}
                {(effects.summon.entityCount && effects.summon.entityCount > 1) ? ` x${effects.summon.entityCount}` : ''}
              </span>
              {effects.summon.duration && (
                <span className="text-slate-400">({effects.summon.duration}s)</span>
              )}
            </div>
          )}
          {petDamageAggregate && petDamageAggregate.base > 0 && (
            <div className="flex items-center gap-1 mt-0.5 ml-3">
              <span className="text-slate-400">{petDamageAggregate.results.length > 1 ? 'Total DPS:' : 'DPS:'}</span>
              <span className="text-red-400">{petDamageAggregate.base.toFixed(1)}</span>
              {petDamageAggregate.enhanced !== petDamageAggregate.base && (
                <span className="text-green-400">→ {petDamageAggregate.enhanced.toFixed(1)}</span>
              )}
              {petDamageAggregate.final !== petDamageAggregate.enhanced && (
                <span className="text-amber-400">→ {petDamageAggregate.final.toFixed(1)}</span>
              )}
            </div>
          )}
          {petDamageAggregate && petDamageAggregate.results.some(r => r.allEffects.length > 0) && (
            <div className="flex flex-wrap gap-0.5 mt-0.5 ml-3">
              {/* Collect unique effects across all entities */}
              {Array.from(new Map(
                petDamageAggregate.results.flatMap(r => r.allEffects).map(eff => [eff.type, eff])
              ).values()).map((eff) => {
                const valLabel = eff.value !== undefined ? ` ${eff.value.toFixed(1)}` : '';
                const chanceLabel = eff.chance && eff.chance < 1 ? ` ${(eff.chance * 100).toFixed(0)}%` : '';
                return (
                  <span key={eff.type} className="text-[8px] text-purple-300 bg-purple-900/30 px-0.5 rounded">
                    {eff.type}{valLabel}{chanceLabel}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Consolidated Power Effects - registry-driven display */}
      <RegistryEffectsDisplay
        effects={effects}
        allowedEnhancements={basePower?.allowedEnhancements || []}
        enhancementBonuses={enhancementBonuses}
        globalBonuses={globalBonusesForCalc}
        buffDebuffMod={effectiveMod}
        archetypeId={archetypeId ?? undefined}
        level={build.level}
        categories={['execution', 'buff', 'debuff', 'control', 'protection', 'movement']}
        dominationActive={dominationActive}
        compact={true}
        header="Power Effects"
        duration={effects?.buffDuration}
        damage={calculatedDamage}
        finalColumnHeader={damageDisplayInfo?.finalColumnHeader}
        finalColumnColor={damageDisplayInfo?.finalColumnColor}
        applyInherentBonus={damageDisplayInfo?.applyInherentBonus}
        purplePatchInfo={{
          factor: Math.min(0.95, Math.max(0.05, getBaseToHit(targetLevelOffset - globalBonuses.levelShift) + globalBonuses.toHit / 100)) / 0.75,
          offset: targetLevelOffset,
          toHitBonus: globalBonuses.toHit,
          combatModifier: globalBonuses.combatModifier ?? 1,
        }}
      />

      {/* Damage bar - overlaid base/enhanced/final relative to AT cap */}
      {calculatedDamage && !calculatedDamage.unknown && calculatedDamage.scale && (() => {
        const damageCap = getDamageCap(archetypeId ?? '');
        // Fixed reference: AT's damage at scale 1.0 × damageCap
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
          <div className="relative h-2 bg-slate-700/30 rounded overflow-hidden" title={`Damage cap: ${(damageCap * 100).toFixed(0)}%`}>
            <div
              className="absolute inset-y-0 left-0 bg-amber-500 rounded-l transition-all duration-300"
              style={{ width: `${finalPercent}%` }}
            />
            <div
              className="absolute inset-y-0 left-0 bg-green-500 rounded-l transition-all duration-300"
              style={{ width: `${enhPercent}%` }}
            />
            <div
              className="absolute inset-y-0 left-0 bg-slate-400 rounded-l transition-all duration-300"
              style={{ width: `${basePercent}%` }}
            />
          </div>
        );
      })()}

      {/* Fiery Embrace conditional damage (shown separately since it's conditional) */}
      {calculatedDamage?.fieryEmbraceDamage && damageDisplayInfo && (
        <div className="bg-slate-800/50 rounded p-1.5">
          {(() => {
            const fe = calculatedDamage.fieryEmbraceDamage;
            const hasEnh = Math.abs(fe.enhanced - fe.base) > 0.001;
            const feFinal = damageDisplayInfo.applyInherentBonus(fe.final);
            const hasGlobal = Math.abs(feFinal - fe.enhanced) > 0.001;
            const isActive = isFieryEmbraceActive;
            return (
              <>
                <div className={`grid grid-cols-[3rem_1fr_1fr_1fr] gap-1 items-baseline text-[10px] ${isActive ? '' : 'opacity-40'}`}>
                  <span className={isActive ? 'text-orange-400' : 'text-slate-500'}>{fe.type}</span>
                  <span className={isActive ? 'text-slate-300' : 'text-slate-500'}>{fe.base.toFixed(2)}</span>
                  <span className={isActive ? (hasEnh ? 'text-green-400' : 'text-slate-600') : 'text-slate-600'}>
                    {hasEnh ? `→ ${fe.enhanced.toFixed(2)}` : '—'}
                  </span>
                  <span className={isActive ? (hasGlobal ? damageDisplayInfo.finalColumnColor : 'text-slate-600') : 'text-slate-600'}>
                    {hasGlobal ? `→ ${feFinal.toFixed(2)}` : '—'}
                  </span>
                </div>
                <div className={`text-[8px] italic mt-0.5 ${isActive ? 'text-orange-400' : 'text-slate-500'}`}>
                  {isActive ? '✓ Fiery Embrace active' : '* Fire damage only with Fiery Embrace active'}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Inherent damage bonus info (Scourge, Fury, etc.) */}
      {damageDisplayInfo && calculatedDamage && (
        <>
          {damageDisplayInfo.showScourge && (
            <div className="text-[8px] text-sk-magenta">
              +{(getScourgeInfo().averageDamageBonus * 100).toFixed(0)}% avg from Scourge
            </div>
          )}
          {damageDisplayInfo.showFury && (
            <div className="text-[8px] text-sk-magenta">
              +{(damageDisplayInfo.furyBonus * 100).toFixed(0)}% from Fury ({furyLevel}/100)
            </div>
          )}
          {damageDisplayInfo.showVigilance && (
            <div className="text-[8px] text-sk-magenta">
              +{(damageDisplayInfo.vigilanceBonus * 100).toFixed(0)}% from Vigilance ({vigilanceTeamSize === 0 ? 'Solo' : `${vigilanceTeamSize} teammates`})
            </div>
          )}
          {damageDisplayInfo.showCriticalHits && (
            <div className="text-[8px] text-sk-magenta">
              +{(getCriticalHitInfo().averageBonusVsHigher * 100).toFixed(0)}% avg from Critical Hits (vs Lt+)
            </div>
          )}
          {damageDisplayInfo.showAssassination && (
            <div className="text-[8px] text-sk-magenta">
              +{(damageDisplayInfo.assassinationBonus * 100).toFixed(0)}% avg from Assassination ({stalkerHidden ? 'Hidden' : 'Visible'})
            </div>
          )}
          {damageDisplayInfo.showOpportunityCrit && (
            <div className="text-[8px] text-sk-magenta">
              +{(damageDisplayInfo.opportunityCritBonus * 100).toFixed(0)}% from Opportunity Crit
            </div>
          )}
        </>
      )}

      {/* DoT from effects.dot (secondary DoT) */}
      {effects?.dot && effects.dot.scale != null && (
        <div className="text-[10px]">
          <span className="text-slate-400 text-[9px] uppercase">DoT: </span>
          <span className="text-orange-400">
            {effects.dot.type} {effects.dot.scale.toFixed(2)}/tick × {effects.dot.ticks} = {(effects.dot.scale * effects.dot.ticks).toFixed(2)} total
          </span>
        </div>
      )}

      {/* Blaster Defiance - show for Blaster primary/secondary attack powers */}
      {(() => {
        // Only show for Blaster archetype and blaster powersets
        if (archetypeId !== 'blaster' || !powerSet.startsWith('blaster/')) return null;

        const defianceInfo = calculateDefiance(effects, basePower.effectArea);
        if (!defianceInfo || defianceInfo.damageBonus <= 0) return null;

        return (
          <div className="text-[10px] mt-1 bg-orange-900/20 rounded px-1.5 py-1 border border-orange-700/30">
            <span className="text-orange-400 font-medium">Defiance: </span>
            <span className="text-orange-300">+{defianceInfo.damageBonus.toFixed(1)}% dmg</span>
            <span className="text-slate-400"> for </span>
            <span className="text-orange-300">{defianceInfo.duration.toFixed(1)}s</span>
          </div>
        );
      })()}

      {/* Dominator Domination - show when viewing Dominator control powers */}
      {(() => {
        // Only show for Dominator archetype and dominator powersets with mez effects
        if (archetypeId !== 'dominator' || !isDominatorControlPower(powerSet)) return null;
        if (!hasMez) return null;

        const dominationInfo = getDominationInfo();

        return (
          <div className={`text-[10px] mt-1 rounded px-1.5 py-1 border ${
            dominationActive
              ? 'bg-pink-900/30 border-pink-700/50'
              : 'bg-slate-800/50 border-slate-700/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${dominationActive ? 'text-pink-400' : 'text-slate-400'}`}>
                Domination
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                dominationActive
                  ? 'bg-pink-600/50 text-pink-200'
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {dominationActive ? 'ACTIVE' : 'Inactive'}
              </span>
            </div>
            {dominationActive && (
              <div className="mt-1 text-[9px]">
                <span className="text-pink-300">×{dominationInfo.magnitudeMultiplier} Mag, </span>
                <span className="text-pink-300">×{dominationInfo.durationMultiplier} Dur</span>
                <span className="text-slate-500 ml-1">({dominationInfo.activeDuration}s)</span>
              </div>
            )}
            {!dominationActive && (
              <div className="text-[8px] text-slate-500 mt-0.5">
                Enable via Settings to see enhanced values
              </div>
            )}
          </div>
        );
      })()}

      {/* Corruptor Scourge - show when viewing Corruptor attack powers */}
      {(() => {
        // Only show for Corruptor archetype and corruptor powersets with damage
        if (archetypeId !== 'corruptor' || !isCorruptorAttackPower(powerSet)) return null;
        if (!calculatedDamage) return null;

        const scourgeInfo = getScourgeInfo();

        return (
          <div className={`text-[10px] mt-1 rounded px-1.5 py-1 border ${
            scourgeActive
              ? 'bg-sk-magenta/10 border-sk-magenta/30'
              : 'bg-slate-800/50 border-slate-700/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${scourgeActive ? 'text-sk-magenta' : 'text-slate-400'}`}>
                Scourge
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                scourgeActive
                  ? 'bg-sk-magenta/20 text-sk-magenta'
                  : 'bg-slate-700 text-slate-400'
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

      {/* Brute Fury - show when viewing Brute attack powers */}
      {(() => {
        // Only show for Brute archetype and brute powersets with damage
        if (archetypeId !== 'brute' || !isBruteAttackPower(powerSet)) return null;
        if (!calculatedDamage) return null;

        const furyInfo = getFuryInfo();
        const currentBonus = calculateFuryDamageBonus(furyLevel);

        return (
          <div className={`text-[10px] mt-1 rounded px-1.5 py-1 border ${
            furyLevel > 0
              ? 'bg-sk-magenta/10 border-sk-magenta/30'
              : 'bg-slate-800/50 border-slate-700/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${furyLevel > 0 ? 'text-sk-magenta' : 'text-slate-400'}`}>
                Fury
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                furyLevel > 0
                  ? 'bg-sk-magenta/20 text-sk-magenta'
                  : 'bg-slate-700 text-slate-400'
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

      {/* Mastermind Supremacy - show when viewing Mastermind powers */}
      {(() => {
        // Only show for Mastermind archetype and mastermind powersets
        if (archetypeId !== 'mastermind' || !isMastermindPower(powerSet)) return null;

        const supremacyInfo = getSupremacyInfo();
        const bodyguardInfo = getBodyguardInfo();

        return (
          <div className={`text-[10px] mt-1 rounded px-1.5 py-1 border ${
            supremacyActive
              ? 'bg-sk-magenta/10 border-sk-magenta/30'
              : 'bg-slate-800/50 border-slate-700/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${supremacyActive ? 'text-sk-magenta' : 'text-slate-400'}`}>
                Supremacy
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                supremacyActive
                  ? 'bg-sk-magenta/20 text-sk-magenta'
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {supremacyActive ? 'ACTIVE' : 'Inactive'}
              </span>
            </div>
            {supremacyActive && (
              <div className="mt-1 space-y-0.5">
                <div className="text-[9px]">
                  <span className="text-slate-500">Henchmen within {supremacyInfo.radius}ft:</span>
                </div>
                <div className="text-[9px] flex gap-3">
                  <span className="text-sk-magenta/70">+{(supremacyInfo.damageBonus * 100).toFixed(0)}% Damage</span>
                  <span className="text-sk-magenta/70">+{(supremacyInfo.toHitBonus * 100).toFixed(0)}% ToHit</span>
                </div>
                <div className="text-[9px] mt-1 pt-1 border-t border-sk-magenta/30">
                  <span className="text-slate-500">Bodyguard Mode:</span>
                  <span className="text-sk-magenta/70 ml-1">
                    {(bodyguardInfo.mastermindDamageShare * 100).toFixed(0)}% to MM, {(bodyguardInfo.henchmenDamageShare * 100).toFixed(0)}% to pets
                  </span>
                </div>
              </div>
            )}
            {!supremacyActive && (
              <div className="text-[8px] text-slate-500 mt-0.5">
                Enable to see henchmen buff values
              </div>
            )}
          </div>
        );
      })()}

      {/* Defender Vigilance - show when viewing Defender powers */}
      {(() => {
        // Only show for Defender archetype and defender powersets with damage
        if (archetypeId !== 'defender' || !isDefenderPower(powerSet)) return null;
        if (!calculatedDamage) return null;

        const vigilanceInfo = getVigilanceInfo();
        const currentBonus = calculateVigilanceDamageBonus(build.level, vigilanceTeamSize);
        const teamLabel = vigilanceTeamSize === 0 ? 'Solo' : `${vigilanceTeamSize} teammate${vigilanceTeamSize > 1 ? 's' : ''}`;

        return (
          <div className={`text-[10px] mt-1 rounded px-1.5 py-1 border ${
            currentBonus > 0
              ? 'bg-sk-magenta/10 border-sk-magenta/30'
              : 'bg-slate-800/50 border-slate-700/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${currentBonus > 0 ? 'text-sk-magenta' : 'text-slate-400'}`}>
                Vigilance
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                currentBonus > 0
                  ? 'bg-sk-magenta/20 text-sk-magenta'
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {teamLabel}
              </span>
            </div>
            <div className="mt-1 text-[9px]">
              {currentBonus > 0 ? (
                <span className="text-sk-magenta/70">+{(currentBonus * 100).toFixed(0)}% damage</span>
              ) : (
                <span className="text-slate-500">No bonus (3+ teammates)</span>
              )}
              <span className="text-slate-500 ml-1">(max {(vigilanceInfo.maxSoloDamageBonus * 100).toFixed(0)}% solo at Lv20+)</span>
            </div>
          </div>
        );
      })()}


      {/* Scrapper Critical Hits - show when viewing Scrapper attack powers */}
      {(() => {
        // Only show for Scrapper archetype and scrapper powersets with damage
        if (archetypeId !== 'scrapper' || !isScrapperAttackPower(powerSet)) return null;
        if (!calculatedDamage) return null;

        const criticalHitInfo = getCriticalHitInfo();

        return (
          <div className={`text-[10px] mt-1 rounded px-1.5 py-1 border ${
            criticalHitsActive
              ? 'bg-sk-magenta/10 border-sk-magenta/30'
              : 'bg-slate-800/50 border-slate-700/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${criticalHitsActive ? 'text-sk-magenta' : 'text-slate-400'}`}>
                Critical Hits
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                criticalHitsActive
                  ? 'bg-sk-magenta/20 text-sk-magenta'
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {criticalHitsActive ? 'SHOWING AVG' : 'Hidden'}
              </span>
            </div>
            {criticalHitsActive && (
              <div className="mt-1 space-y-0.5 text-[9px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">vs Minions:</span>
                  <span className="text-sk-magenta/70">
                    {(criticalHitInfo.chanceVsMinions * 100).toFixed(0)}% chance → +{(criticalHitInfo.averageBonusVsMinions * 100).toFixed(0)}% avg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">vs Lt/Boss+:</span>
                  <span className="text-sk-magenta/70">
                    {(criticalHitInfo.chanceVsHigher * 100).toFixed(0)}% chance → +{(criticalHitInfo.averageBonusVsHigher * 100).toFixed(0)}% avg
                  </span>
                </div>
                <div className="text-[8px] text-slate-500 mt-0.5">
                  Critical hits deal ×{criticalHitInfo.damageMultiplier.toFixed(0)} damage
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

      {/* Stalker Assassination - show when viewing Stalker attack powers */}
      {(() => {
        // Only show for Stalker archetype and stalker powersets with damage
        if (archetypeId !== 'stalker' || !isStalkerAttackPower(powerSet)) return null;
        if (!calculatedDamage) return null;

        const assassinationInfo = getAssassinationInfo();
        const currentBonus = calculateAssassinationDamageBonus(stalkerHidden, stalkerTeamSize);
        const critChance = stalkerHidden ? 1.0 : assassinationInfo.baseCritChance + (stalkerTeamSize * assassinationInfo.critChancePerTeammate);

        return (
          <div className={`text-[10px] mt-1 rounded px-1.5 py-1 border ${
            stalkerHidden
              ? 'bg-sk-magenta/15 border-sk-magenta/40'
              : currentBonus > 0
                ? 'bg-sk-magenta/10 border-sk-magenta/30'
                : 'bg-slate-800/50 border-slate-700/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${stalkerHidden || currentBonus > 0 ? 'text-sk-magenta' : 'text-slate-400'}`}>
                Assassination
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                stalkerHidden
                  ? 'bg-sk-magenta/25 text-sk-magenta'
                  : 'bg-sk-magenta/20 text-sk-magenta'
              }`}>
                {stalkerHidden ? 'FROM HIDE' : `${stalkerTeamSize === 0 ? 'Solo' : `+${stalkerTeamSize}`}`}
              </span>
            </div>
            <div className="mt-1 space-y-0.5 text-[9px]">
              {stalkerHidden ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">From Hide:</span>
                    <span className="text-sk-magenta/70 font-medium">100% critical chance</span>
                  </div>
                  <div className="text-[8px] text-sk-magenta/60 mt-0.5">
                    +100% avg damage (guaranteed double damage)
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base crit:</span>
                    <span className="text-sk-magenta/70">{(assassinationInfo.baseCritChance * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Team bonus:</span>
                    <span className="text-sk-magenta/70">+{(stalkerTeamSize * assassinationInfo.critChancePerTeammate * 100).toFixed(0)}% ({stalkerTeamSize} × 3%)</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-400">Total:</span>
                    <span className="text-sk-magenta/70">{(critChance * 100).toFixed(0)}% → +{(currentBonus * 100).toFixed(0)}% avg</span>
                  </div>
                </>
              )}
            </div>
            <div className="text-[8px] text-slate-500 mt-1 pt-1 border-t border-sk-magenta/30">
              Assassin's Focus: Primary attacks can stack +33.3% crit (×3) for Assassin's Strike
            </div>
          </div>
        );
      })()}

      {/* Tanker Gauntlet - show when viewing Tanker powers */}
      {(() => {
        // Only show for Tanker archetype and tanker powersets
        if (archetypeId !== 'tanker' || !isTankerPower(powerSet)) return null;

        const gauntletInfo = getGauntletInfo();

        return (
          <div className="text-[10px] mt-1 rounded px-1.5 py-1 border bg-yellow-900/30 border-yellow-700/50">
            <div className="flex items-center justify-between">
              <span className="font-medium text-yellow-400">
                Gauntlet
              </span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-yellow-600/50 text-yellow-200">
                PunchVoke
              </span>
            </div>
            <div className="mt-1 space-y-0.5 text-[9px]">
              <div className="text-yellow-300">
                +{(gauntletInfo.aoeRadiusBonus * 100).toFixed(0)}% AoE Radius/Range
              </div>
              <div className="text-yellow-300">
                +{(gauntletInfo.coneArcBonus * 100).toFixed(0)}% Cone Arc
              </div>
              <div className="text-yellow-300">
                ST attacks taunt target + {gauntletInfo.singleTargetTauntSplash} nearby
              </div>
              <div className="text-yellow-300">
                AoE attacks taunt all affected
              </div>
            </div>
            <div className="text-[8px] text-slate-500 mt-1 pt-1 border-t border-yellow-700/30">
              PBAoE hits bonus targets at {(gauntletInfo.bonusTargetDamageMultiplier * 100).toFixed(0)}% damage
            </div>
          </div>
        );
      })()}

      {/* Containment info panel - Controllers */}
      {(() => {
        // Only show for Controller archetype and controller powersets with damage
        if (archetypeId !== 'controller' || !isControllerPower(powerSet)) return null;
        if (!calculatedDamage) return null;

        const containmentInfo = getContainmentInfo();

        return (
          <div className={`text-[10px] mt-1 rounded px-1.5 py-1 border ${
            containmentActive
              ? 'bg-sk-magenta/15 border-sk-magenta/40'
              : 'bg-slate-800/50 border-slate-700/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${containmentActive ? 'text-sk-magenta' : 'text-slate-400'}`}>
                Containment
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                containmentActive
                  ? 'bg-sk-magenta/20 text-sk-magenta'
                  : 'bg-slate-700/50 text-slate-400'
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

      {/* Enhancement summary */}
      {hasEnhancements && Object.keys(enhancementBonuses).length > 0 && (
        <div className="border-t border-slate-700 pt-1 mt-1">
          <span className="text-[8px] text-slate-500 uppercase">Enhancement Bonuses (after ED):</span>
          <div className="flex flex-wrap gap-x-2 text-[9px]">
            {Object.entries(enhancementBonuses).map(([aspect, value]) => (
              <span key={aspect} className="text-green-400">
                {aspect}: +{((value || 0) * 100).toFixed(2)}%
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Enhancement info content for slotted enhancements
import { EnhancementInfoContent } from './EnhancementInfoContent';

export function PowerInfoTooltip() {
  const tooltipEnabled = useUIStore((s) => s.infoPanel.tooltipEnabled);
  const infoPanelContent = useUIStore((s) => s.infoPanel.content);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Position tooltip to the right and slightly below cursor
    const x = e.clientX + 15;
    const y = e.clientY + 10;

    // Keep tooltip within viewport
    const maxX = window.innerWidth - 300; // tooltip width estimate
    const maxY = window.innerHeight - 400; // tooltip height estimate

    setPosition({
      x: Math.min(x, maxX),
      y: Math.min(y, maxY),
    });
  }, []);

  // Determine if we should show the tooltip
  const shouldShow = tooltipEnabled && infoPanelContent && (
    infoPanelContent.type === 'power' || infoPanelContent.type === 'slotted-enhancement'
  );

  useEffect(() => {
    if (shouldShow) {
      setVisible(true);
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    } else {
      setVisible(false);
    }
  }, [shouldShow, handleMouseMove]);

  if (!visible || !infoPanelContent) {
    return null;
  }

  return createPortal(
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="bg-slate-900/95 border border-slate-600 rounded-lg shadow-xl p-2">
        {infoPanelContent.type === 'power' && (
          <PowerInfoContent
            powerName={infoPanelContent.powerName}
            powerSet={infoPanelContent.powerSet}
          />
        )}
        {infoPanelContent.type === 'slotted-enhancement' && (
          <EnhancementInfoContent
            powerName={infoPanelContent.powerName}
            slotIndex={infoPanelContent.slotIndex}
          />
        )}
      </div>
    </div>,
    document.body
  );
}
