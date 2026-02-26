/**
 * PowerInfoTooltip - Floating tooltip that displays power or enhancement info on hover
 * Shows all power stats with Base/Enhanced/Final values
 * Remains responsive to hover changes even when info panel is locked
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useUIStore, useBuildStore, useDominationActive, useScourgeActive, useFuryLevel, useSupremacyActive, useVigilanceTeamSize, useCriticalHitsActive, useStalkerHidden, useStalkerTeamSize, useContainmentActive } from '@/stores';
import { useGlobalBonuses } from '@/hooks/useCalculatedStats';
import { lookupPower, getPower, getPowerPool, getArchetype, getIOSet, getPowerset, getInherentPowerDef, findProcData, parseProcEffect, getProcEffectLabel, getProcEffectColor, isProcAlwaysOn, calculateProcChance, calculateProcsPerMinute, calculateProcDPS, calculateAutoToggleProcChance, calculateAutoToggleProcsPerMinute } from '@/data';
import { resolvePath } from '@/utils/paths';
import type { Power } from '@/types';
import {
  calculatePowerEnhancementBonuses,
  calculatePowerDamage,
  normalizeAspectName,
  getAspectSchedule,
  getIOValueAtLevel,
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
  getAlphaEnhancementBonuses,
  type EnhancementBonuses,
} from '@/utils/calculations';
import { calculatePetDamage, shouldApplyEnhancements, type PetDamageResult } from '@/utils/calculations/pet-damage';
import {
  IOSetIcon,
  GenericIOIcon,
  OriginEnhancementIcon,
  SpecialEnhancementIcon,
} from '@/components/enhancements/EnhancementIcon';
import type { ArchetypeId, IOSetEnhancement, GenericIOEnhancement, OriginEnhancement, SpecialEnhancement, Enhancement } from '@/types';
import {
  getEffectiveBuffDebuffModifier,
  convertGlobalBonusesToAspects,
  findSelectedPowerInBuild,
} from './powerDisplayUtils';
import {
  RegistryEffectsDisplay,
} from './SharedPowerComponents';

interface PowerInfoContentProps {
  powerName: string;
  powerSet: string;
}

/** Get the full icon path for an inherent power based on its category */
function getInherentIconFullPath(iconFilename: string, category?: string): string {
  const lowercaseIcon = iconFilename?.toLowerCase() || 'unknown.png';

  switch (category) {
    case 'fitness':
      return resolvePath(`/img/Powers/Fitness Powers Icons/${lowercaseIcon}`);
    case 'archetype':
      return resolvePath(`/img/Powers/Archetype Inherent Powers icons/${lowercaseIcon}`);
    case 'prestige':
    case 'basic':
    default:
      return resolvePath(`/img/Powers/Inherent Powers Icons/${lowercaseIcon}`);
  }
}

function PowerInfoContent({ powerName, powerSet }: PowerInfoContentProps) {
  const build = useBuildStore((s) => s.build);
  const archetypeId = build.archetype.id;
  const globalBonuses = useGlobalBonuses();
  const incarnateActive = useUIStore((s) => s.incarnateActive);
  const dominationActive = useDominationActive();
  const scourgeActive = useScourgeActive();
  const furyLevel = useFuryLevel();
  const supremacyActive = useSupremacyActive();
  const vigilanceTeamSize = useVigilanceTeamSize();
  const criticalHitsActive = useCriticalHitsActive();
  const stalkerHidden = useStalkerHidden();
  const stalkerTeamSize = useStalkerTeamSize();
  const containmentActive = useContainmentActive();

  // Check if Fiery Embrace is active in the build
  const isFieryEmbraceActive = useMemo(() => {
    // Check secondary powers for Fiery Embrace
    const fieryEmbrace = build.secondary.powers.find(p => p.name === 'Fiery Embrace');
    if (fieryEmbrace && fieryEmbrace.isActive) return true;
    // Also check primary (some ATs might have it there)
    const primaryFE = build.primary.powers.find(p => p.name === 'Fiery Embrace');
    if (primaryFE && primaryFE.isActive) return true;
    return false;
  }, [build.secondary.powers, build.primary.powers]);

  // Unified power lookup across all categories
  const lookupResult = lookupPower(powerSet, powerName);
  let basePower: Power | undefined = lookupResult?.power;

  // Resolve inherent icon paths (inherents store filename, need full path)
  if (lookupResult?.isInherent && basePower) {
    const inherentDef = getInherentPowerDef(powerName);
    const iconPath = getInherentIconFullPath(basePower.icon || 'unknown.png', inherentDef?.category);
    basePower = { ...basePower, icon: iconPath };
  }

  // Archetype inherent fallback (dynamically created, not in static data)
  if (!basePower && powerSet === 'Inherent') {
    const selectedInherent = build.inherents.find((p) => p.name === powerName);
    if (selectedInherent) {
      const iconPath = getInherentIconFullPath(selectedInherent.icon || 'unknown.png', selectedInherent.inherentCategory);
      basePower = { ...selectedInherent, icon: iconPath };
    }
  }

  // Find the selected power from build to get its slots
  const selectedPower = findSelectedPowerInBuild(powerName, build);

  // Get Alpha incarnate enhancement bonuses (apply to all powers)
  const alphaBonuses = useMemo<EnhancementBonuses>(() => {
    return getAlphaEnhancementBonuses(build.incarnates, incarnateActive);
  }, [build.incarnates, incarnateActive]);

  // Calculate enhancement bonuses if power is slotted, plus Alpha bonuses
  const enhancementBonuses = useMemo<EnhancementBonuses>(() => {
    let bonuses: EnhancementBonuses = {};
    if (selectedPower?.slots) {
      bonuses = calculatePowerEnhancementBonuses(
        { name: selectedPower.name, slots: selectedPower.slots },
        build.level,
        getIOSet
      );
    }

    // Add Alpha incarnate bonuses (these apply universally to all powers)
    for (const [aspect, value] of Object.entries(alphaBonuses)) {
      if (value !== undefined) {
        bonuses[aspect] = (bonuses[aspect] || 0) + value;
      }
    }

    return bonuses;
  }, [selectedPower, build.level, alphaBonuses]);

  // Convert global bonuses to enhancement-aspect-keyed decimals for three-tier display
  const globalBonusesForCalc = useMemo(
    () => convertGlobalBonusesToAspects(globalBonuses),
    [globalBonuses]
  );

  // Get powerset for determining damage type
  const powerset = getPowerset(powerSet);

  // Calculate actual damage using archetype modifiers and level
  const calculatedDamage = useMemo(() => {
    if (!basePower?.damage) return null;

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
    const dmg = basePower?.damage;
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
  }, [basePower?.damage]);

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
    const showAssassination = isStalker && isStalkerPower && assassinationBonus > 0;

    const isController = archetypeId === 'controller';
    const isControllerAttackPower = isControllerPower(powerSet);
    const showContainment = isController && isControllerAttackPower && containmentActive;

    // Determine final column header
    const finalColumnHeader = showScourge ? 'w/ Scourge'
      : showFury ? 'w/ Fury'
      : showVigilance ? 'w/ Vigilance'
      : showCriticalHits ? 'w/ Crit'
      : showAssassination ? (stalkerHidden ? 'w/ Crit' : 'w/ Assassin')
      : showContainment ? 'w/ Contain'
      : 'Final';

    // Get color class for inherent-modified values
    const finalColumnColor = showScourge ? 'text-cyan-400'
      : showFury ? 'text-red-400'
      : showVigilance ? 'text-indigo-400'
      : showCriticalHits ? 'text-orange-400'
      : showAssassination ? 'text-purple-400'
      : showContainment ? 'text-cyan-400'
      : 'text-amber-400';

    // Function to apply inherent bonus
    const applyInherentBonus = (damage: number) => {
      if (showScourge) return calculateScourgeDamage(damage);
      if (showFury) return calculateFuryDamage(damage, furyLevel);
      if (showVigilance) return calculateVigilanceDamage(damage, build.level, vigilanceTeamSize);
      if (showCriticalHits) return calculateCriticalHitDamage(damage, 'higher');
      if (showAssassination) return calculateAssassinationDamage(damage, stalkerHidden, stalkerTeamSize);
      if (showContainment) return calculateContainmentDamage(damage, true);
      return damage;
    };

    // Get DoT info from power definition (single object or array format)
    const dmg = basePower?.damage;
    const dotInfo = (() => {
      if (!dmg || typeof dmg !== 'object') return undefined;
      // Single object with duration/tickRate
      if (!Array.isArray(dmg) && 'duration' in dmg) {
        return {
          duration: (dmg as { duration?: number }).duration || 0,
          tickRate: (dmg as { tickRate?: number }).tickRate,
        };
      }
      // Array format: only if ALL entries share the same duration/tickRate
      if (Array.isArray(dmg)) {
        type DmgEntry = { duration?: number; tickRate?: number };
        const entries = dmg as DmgEntry[];
        const dotEntries = entries.filter(e => e.duration && e.duration > 0);
        if (dotEntries.length > 0 && dotEntries.length === entries.length) {
          const dur = dotEntries[0].duration!;
          const rate = dotEntries[0].tickRate;
          const allSame = dotEntries.every(e => e.duration === dur && e.tickRate === rate);
          if (allSame) {
            return { duration: dur, tickRate: rate };
          }
        }
      }
      return undefined;
    })();

    return {
      finalColumnHeader,
      finalColumnColor,
      applyInherentBonus,
      dotInfo,
      showScourge,
      showFury,
      showVigilance,
      showCriticalHits,
      showAssassination,
      showContainment,
      furyBonus: showFury ? calculateFuryDamageBonus(furyLevel) : 0,
      vigilanceBonus,
      assassinationBonus,
    };
  }, [calculatedDamage, archetypeId, powerSet, scourgeActive, furyLevel, vigilanceTeamSize,
      criticalHitsActive, stalkerHidden, stalkerTeamSize, containmentActive, build.level, basePower?.damage]);

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
  if (basePower.stats?.endurance) extraEffects.enduranceCost = basePower.stats.endurance;
  if (basePower.stats?.recharge) extraEffects.recharge = basePower.stats.recharge;
  if (basePower.stats?.accuracy) extraEffects.accuracy = basePower.stats.accuracy;
  if (basePower.stats?.range) extraEffects.range = basePower.stats.range;
  if (basePower.stats?.castTime) extraEffects.castTime = basePower.stats.castTime;
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
        dotInfo={damageDisplayInfo?.dotInfo}
        finalColumnHeader={damageDisplayInfo?.finalColumnHeader}
        finalColumnColor={damageDisplayInfo?.finalColumnColor}
        applyInherentBonus={damageDisplayInfo?.applyInherentBonus}
      />

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
            <div className="text-[8px] text-cyan-400">
              +{(getScourgeInfo().averageDamageBonus * 100).toFixed(0)}% avg from Scourge
            </div>
          )}
          {damageDisplayInfo.showFury && (
            <div className="text-[8px] text-red-400">
              +{(damageDisplayInfo.furyBonus * 100).toFixed(0)}% from Fury ({furyLevel}/100)
            </div>
          )}
          {damageDisplayInfo.showVigilance && (
            <div className="text-[8px] text-indigo-400">
              +{(damageDisplayInfo.vigilanceBonus * 100).toFixed(0)}% from Vigilance ({vigilanceTeamSize === 0 ? 'Solo' : `${vigilanceTeamSize} teammates`})
            </div>
          )}
          {damageDisplayInfo.showCriticalHits && (
            <div className="text-[8px] text-orange-400">
              +{(getCriticalHitInfo().averageBonusVsHigher * 100).toFixed(0)}% avg from Critical Hits (vs Lt+)
            </div>
          )}
          {damageDisplayInfo.showAssassination && (
            <div className="text-[8px] text-purple-400">
              +{(damageDisplayInfo.assassinationBonus * 100).toFixed(0)}% avg from Assassination ({stalkerHidden ? 'Hidden' : 'Visible'})
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
              ? 'bg-cyan-900/30 border-cyan-700/50'
              : 'bg-slate-800/50 border-slate-700/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${scourgeActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                Scourge
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                scourgeActive
                  ? 'bg-cyan-600/50 text-cyan-200'
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {scourgeActive ? 'SHOWING AVG' : 'Hidden'}
              </span>
            </div>
            {scourgeActive && (
              <div className="mt-1 text-[9px]">
                <span className="text-cyan-300">+{(scourgeInfo.averageDamageBonus * 100).toFixed(0)}% avg dmg</span>
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
              ? 'bg-red-900/30 border-red-700/50'
              : 'bg-slate-800/50 border-slate-700/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${furyLevel > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                Fury
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                furyLevel > 0
                  ? 'bg-red-600/50 text-red-200'
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {furyLevel}/{furyInfo.maxFury}
              </span>
            </div>
            <div className="mt-1 text-[9px]">
              <span className="text-red-300">+{(currentBonus * 100).toFixed(0)}% damage</span>
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
              ? 'bg-amber-900/30 border-amber-700/50'
              : 'bg-slate-800/50 border-slate-700/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${supremacyActive ? 'text-amber-400' : 'text-slate-400'}`}>
                Supremacy
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                supremacyActive
                  ? 'bg-amber-600/50 text-amber-200'
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
                  <span className="text-amber-300">+{(supremacyInfo.damageBonus * 100).toFixed(0)}% Damage</span>
                  <span className="text-yellow-300">+{(supremacyInfo.toHitBonus * 100).toFixed(0)}% ToHit</span>
                </div>
                <div className="text-[9px] mt-1 pt-1 border-t border-amber-700/30">
                  <span className="text-slate-500">Bodyguard Mode:</span>
                  <span className="text-amber-200 ml-1">
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
              ? 'bg-indigo-900/30 border-indigo-700/50'
              : 'bg-slate-800/50 border-slate-700/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${currentBonus > 0 ? 'text-indigo-400' : 'text-slate-400'}`}>
                Vigilance
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                currentBonus > 0
                  ? 'bg-indigo-600/50 text-indigo-200'
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {teamLabel}
              </span>
            </div>
            <div className="mt-1 text-[9px]">
              {currentBonus > 0 ? (
                <span className="text-indigo-300">+{(currentBonus * 100).toFixed(0)}% damage</span>
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
              ? 'bg-orange-900/30 border-orange-700/50'
              : 'bg-slate-800/50 border-slate-700/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${criticalHitsActive ? 'text-orange-400' : 'text-slate-400'}`}>
                Critical Hits
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                criticalHitsActive
                  ? 'bg-orange-600/50 text-orange-200'
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {criticalHitsActive ? 'SHOWING AVG' : 'Hidden'}
              </span>
            </div>
            {criticalHitsActive && (
              <div className="mt-1 space-y-0.5 text-[9px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">vs Minions:</span>
                  <span className="text-orange-300">
                    {(criticalHitInfo.chanceVsMinions * 100).toFixed(0)}% chance → +{(criticalHitInfo.averageBonusVsMinions * 100).toFixed(0)}% avg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">vs Lt/Boss+:</span>
                  <span className="text-orange-300">
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
              ? 'bg-purple-900/40 border-purple-600/60'
              : currentBonus > 0
                ? 'bg-purple-900/30 border-purple-700/50'
                : 'bg-slate-800/50 border-slate-700/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${stalkerHidden || currentBonus > 0 ? 'text-purple-400' : 'text-slate-400'}`}>
                Assassination
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                stalkerHidden
                  ? 'bg-purple-600/60 text-purple-100'
                  : 'bg-purple-600/50 text-purple-200'
              }`}>
                {stalkerHidden ? 'FROM HIDE' : `${stalkerTeamSize === 0 ? 'Solo' : `+${stalkerTeamSize}`}`}
              </span>
            </div>
            <div className="mt-1 space-y-0.5 text-[9px]">
              {stalkerHidden ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">From Hide:</span>
                    <span className="text-purple-300 font-medium">100% critical chance</span>
                  </div>
                  <div className="text-[8px] text-purple-300/80 mt-0.5">
                    +100% avg damage (guaranteed double damage)
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base crit:</span>
                    <span className="text-purple-300">{(assassinationInfo.baseCritChance * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Team bonus:</span>
                    <span className="text-purple-300">+{(stalkerTeamSize * assassinationInfo.critChancePerTeammate * 100).toFixed(0)}% ({stalkerTeamSize} × 3%)</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-400">Total:</span>
                    <span className="text-purple-300">{(critChance * 100).toFixed(0)}% → +{(currentBonus * 100).toFixed(0)}% avg</span>
                  </div>
                </>
              )}
            </div>
            <div className="text-[8px] text-slate-500 mt-1 pt-1 border-t border-purple-700/30">
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
              ? 'bg-cyan-900/40 border-cyan-600/60'
              : 'bg-slate-800/50 border-slate-700/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${containmentActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                Containment
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                containmentActive
                  ? 'bg-cyan-600/50 text-cyan-200'
                  : 'bg-slate-700/50 text-slate-400'
              }`}>
                {containmentActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="mt-1 space-y-0.5 text-[9px]">
              <div className={containmentActive ? 'text-cyan-300' : 'text-slate-500'}>
                {containmentInfo.description}
              </div>
              {containmentActive && (
                <div className="text-cyan-200 font-medium">
                  +{((containmentInfo.damageMultiplier - 1) * 100).toFixed(0)}% damage bonus
                </div>
              )}
            </div>
            <div className="text-[8px] text-slate-500 mt-1 pt-1 border-t border-cyan-700/30">
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
                {aspect}: +{((value || 0) * 100).toFixed(1)}%
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Enhancement info content for slotted enhancements
interface EnhancementInfoContentProps {
  powerName: string;
  slotIndex: number;
}

function EnhancementInfoContent({ powerName, slotIndex }: EnhancementInfoContentProps) {
  const build = useBuildStore((s) => s.build);

  // Find the power and get the enhancement
  const findEnhancement = (): Enhancement | null => {
    // Check primary
    const primaryPower = build.primary.powers.find((p) => p.name === powerName);
    if (primaryPower && primaryPower.slots[slotIndex]) {
      return primaryPower.slots[slotIndex];
    }

    // Check secondary
    const secondaryPower = build.secondary.powers.find((p) => p.name === powerName);
    if (secondaryPower && secondaryPower.slots[slotIndex]) {
      return secondaryPower.slots[slotIndex];
    }

    // Check pools
    for (const pool of build.pools) {
      const poolPower = pool.powers.find((p) => p.name === powerName);
      if (poolPower && poolPower.slots[slotIndex]) {
        return poolPower.slots[slotIndex];
      }
    }

    // Check epic pool
    if (build.epicPool) {
      const epicPower = build.epicPool.powers.find((p) => p.name === powerName);
      if (epicPower && epicPower.slots[slotIndex]) {
        return epicPower.slots[slotIndex];
      }
    }

    // Check inherent powers (Fitness, Basic, Prestige)
    const inherentPower = build.inherents.find((p) => p.name === powerName);
    if (inherentPower && inherentPower.slots[slotIndex]) {
      return inherentPower.slots[slotIndex];
    }

    return null;
  };

  // Count how many pieces of a set are slotted in this power
  const countSetPiecesInPower = (setId: string): number => {
    const findPower = () => {
      const primary = build.primary.powers.find((p) => p.name === powerName);
      if (primary) return primary;
      const secondary = build.secondary.powers.find((p) => p.name === powerName);
      if (secondary) return secondary;
      for (const pool of build.pools) {
        const poolPower = pool.powers.find((p) => p.name === powerName);
        if (poolPower) return poolPower;
      }
      if (build.epicPool) {
        const epicPower = build.epicPool.powers.find((p) => p.name === powerName);
        if (epicPower) return epicPower;
      }
      // Check inherent powers (Fitness, Basic, Prestige)
      const inherentPower = build.inherents.find((p) => p.name === powerName);
      if (inherentPower) return inherentPower;
      return null;
    };

    const power = findPower();
    if (!power) return 0;

    return power.slots.filter(
      (s) => s && s.type === 'io-set' && (s as IOSetEnhancement).setId === setId
    ).length;
  };

  const enhancement = findEnhancement();

  if (!enhancement) {
    return <div className="text-slate-500 text-[10px]">No enhancement</div>;
  }

  // IO Set Enhancement
  if (enhancement.type === 'io-set') {
    const ioEnh = enhancement as IOSetEnhancement;
    const ioSet = getIOSet(ioEnh.setId);
    const piecesSlotted = countSetPiecesInPower(ioEnh.setId);
    // Extract icon filename from the full path if needed
    const iconName = ioEnh.icon?.includes('/')
      ? ioEnh.icon.split('/').pop() || 'Unknown.png'
      : ioEnh.icon || 'Unknown.png';

    // Calculate enhancement values for each aspect
    // IO enhancement values are based on the IO's level, not character level
    // Attuned enhancements always use level 50 values (they scale to stay effective, not to change values)
    // Non-attuned use their slotted level, defaulting to 50
    const effectiveLevel = enhancement.level || 50;
    const aspectCount = ioEnh.aspects.length;
    // Multi-aspect modifier per Homecoming Wiki:
    // 1 aspect: 100%, 2 aspects: 62.5% (5/8), 3 aspects: 50%, 4 aspects: 43.75%
    const getAspectModifier = (count: number): number => {
      switch (count) {
        case 1: return 1.0;
        case 2: return 0.625;  // 5/8
        case 3: return 0.5;
        case 4: return 0.4375;
        default: return 0.4375; // 4+ aspects use same as 4
      }
    };
    const aspectModifier = getAspectModifier(aspectCount);

    const boostMultiplier = 1 + (enhancement.boost || 0) * 0.05;

    const calculateAspectValue = (aspect: string): number | null => {
      const normalized = normalizeAspectName(aspect);
      if (!normalized) return null;
      const schedule = getAspectSchedule(normalized);
      const baseValue = getIOValueAtLevel(effectiveLevel, schedule);
      return baseValue * aspectModifier * boostMultiplier;
    };

    return (
      <div className="space-y-2 max-w-[320px]">
        {/* Enhancement header with set name */}
        <div className="flex items-center gap-2">
          <IOSetIcon
            icon={iconName}
            attuned={ioEnh.attuned}
            size={28}
            alt={enhancement.name}
            className="flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-yellow-400 leading-tight">{ioEnh.setName}</h3>
            <span className="text-[10px] text-blue-400">{enhancement.name}</span>
          </div>
        </div>

        {/* Proc Effect section - shown for proc enhancements */}
        {ioEnh.isProc ? (
          <div className="bg-amber-900/30 border border-amber-700/50 rounded p-1.5">
            <div className="text-[9px] text-amber-400 uppercase mb-1 font-semibold">Proc Effect</div>
            {/* Look up detailed proc data */}
            {(() => {
              const procData = findProcData(enhancement.name, ioEnh.setName);

              if (procData) {
                // Parse the mechanics into structured effect data
                const effect = parseProcEffect(procData.mechanics);
                const effectColorClass = getProcEffectColor(effect.category);
                const categoryLabel = getProcEffectLabel(effect.category);
                const isAlwaysOn = isProcAlwaysOn(procData);

                // Get category-specific badge colors
                const BADGE_COLORS: Record<string, string> = {
                  'Damage': 'bg-red-900/50 text-red-300',
                  'Endurance': 'bg-blue-900/50 text-blue-300',
                  'Heal': 'bg-emerald-900/50 text-emerald-300',
                  'Absorb': 'bg-cyan-900/50 text-cyan-300',
                  'Resistance': 'bg-orange-900/50 text-orange-300',
                  'Defense': 'bg-purple-900/50 text-purple-300',
                  'ToHit': 'bg-yellow-900/50 text-yellow-300',
                  'Regeneration': 'bg-green-900/50 text-green-300',
                  'Recovery': 'bg-blue-900/50 text-blue-300',
                  'Recharge': 'bg-amber-900/50 text-amber-300',
                  'RunSpeed': 'bg-teal-900/50 text-teal-300',
                  'MaxHP': 'bg-pink-900/50 text-pink-300',
                  'KnockbackProtection': 'bg-slate-700 text-slate-300',
                  'Stealth': 'bg-gray-700 text-gray-300',
                  'Control': 'bg-indigo-900/50 text-indigo-300',
                  'Debuff': 'bg-rose-900/50 text-rose-300',
                  'Special': 'bg-slate-700 text-slate-300',
                };
                const badgeColors = BADGE_COLORS[effect.category] || 'bg-slate-700 text-slate-300';
                const secondaryBadgeColors = effect.secondaryCategory
                  ? BADGE_COLORS[effect.secondaryCategory] || 'bg-slate-700 text-slate-300'
                  : undefined;

                return (
                  <div className="space-y-1">
                    {/* Effect name and category */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-medium ${effectColorClass}`}>
                        {procData.ioName}
                      </span>
                      <span className={`text-[8px] px-1 py-0.5 rounded ${badgeColors}`}>
                        {categoryLabel}
                      </span>
                      {effect.secondaryCategory && secondaryBadgeColors && (
                        <span className={`text-[8px] px-1 py-0.5 rounded ${secondaryBadgeColors}`}>
                          {getProcEffectLabel(effect.secondaryCategory)}
                        </span>
                      )}
                      {isAlwaysOn && (
                        <span className="text-[8px] px-1 py-0.5 rounded bg-green-900/50 text-green-300">
                          Always On
                        </span>
                      )}
                    </div>

                    {/* Detailed mechanics */}
                    <div className="text-[9px] text-slate-300 bg-slate-800/50 rounded px-1.5 py-1">
                      {procData.mechanics}
                    </div>

                    {/* Effect details based on category */}
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[9px]">
                      {procData.ppm !== null && (
                        <div>
                          <span className="text-slate-500">PPM:</span>
                          <span className="text-amber-300 ml-1 font-medium">{procData.ppm}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-500">Type:</span>
                        <span className={`ml-1 ${
                          procData.type === 'Proc120s' ? 'text-purple-400' :
                          procData.type === 'Global' ? 'text-green-400' :
                          'text-amber-300'
                        }`}>
                          {procData.type === 'Proc120s' ? '100% (120s)' : procData.type}
                        </span>
                      </div>
                      {/* Show parsed effect values */}
                      {effect.value !== undefined && effect.category === 'Damage' && effect.valueMax && (
                        <div>
                          <span className="text-slate-500">Dmg:</span>
                          <span className="text-red-400 ml-1">{effect.value}-{effect.valueMax} {effect.effectType}</span>
                        </div>
                      )}
                      {effect.value !== undefined && effect.category !== 'Damage' && (
                        <div>
                          <span className="text-slate-500">Value:</span>
                          <span className={`${effectColorClass} ml-1`}>
                            {effect.category === 'KnockbackProtection' ? `Mag ${effect.value}` :
                             effect.category === 'Stealth' ? `${effect.value} ft` :
                             `${effect.value}%`}
                            {effect.effectType ? ` ${effect.effectType}` : ''}
                          </span>
                        </div>
                      )}
                      {effect.duration && (
                        <div>
                          <span className="text-slate-500">Dur:</span>
                          <span className="text-cyan-300 ml-1">{effect.duration}s</span>
                        </div>
                      )}
                      {/* Secondary effect (for combined procs like Numina's, Panacea) */}
                      {effect.secondaryCategory && effect.secondaryValue !== undefined && (
                        <div>
                          <span className="text-slate-500">+{getProcEffectLabel(effect.secondaryCategory)}:</span>
                          <span className={`${getProcEffectColor(effect.secondaryCategory)} ml-1`}>
                            {effect.secondaryValue}%
                            {effect.secondaryEffectType ? ` ${effect.secondaryEffectType}` : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* PPM Calculation - show for PPM-based procs */}
                    {procData.ppm !== null && (() => {
                      // Find the power this enhancement is slotted in
                      const findPowerData = () => {
                        // Check primary
                        const primaryPower = build.primary.powers.find((p) => p.name === powerName);
                        if (primaryPower && build.primary.id) {
                          const basePower = getPower(build.primary.id, powerName);
                          return { selected: primaryPower, base: basePower };
                        }
                        // Check secondary
                        const secondaryPower = build.secondary.powers.find((p) => p.name === powerName);
                        if (secondaryPower && build.secondary.id) {
                          const basePower = getPower(build.secondary.id, powerName);
                          return { selected: secondaryPower, base: basePower };
                        }
                        // Check pools
                        for (const pool of build.pools) {
                          const poolPower = pool.powers.find((p) => p.name === powerName);
                          if (poolPower) {
                            const poolData = getPowerPool(pool.id);
                            const basePower = poolData?.powers.find((p) => p.name === powerName);
                            return { selected: poolPower, base: basePower };
                          }
                        }
                        // Check inherents
                        const inherentPower = build.inherents.find((p) => p.name === powerName);
                        if (inherentPower) {
                          return { selected: inherentPower, base: null };
                        }
                        return null;
                      };

                      const powerData = findPowerData();
                      if (!powerData) return null;

                      const { selected, base } = powerData;
                      const powerType = selected.powerType?.toLowerCase() || base?.powerType?.toLowerCase() || 'click';
                      const isAutoOrToggle = powerType === 'auto' || powerType === 'toggle';

                      // For Auto/Toggle powers, use special calculation
                      if (isAutoOrToggle) {
                        const procChance = calculateAutoToggleProcChance(procData.ppm);
                        const procsPerMin = calculateAutoToggleProcsPerMinute(procData.ppm);

                        return (
                          <div className="mt-1 pt-1 border-t border-amber-700/30">
                            <div className="text-[8px] text-amber-400/70 uppercase mb-0.5">PPM Calculation ({powerType})</div>
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[9px]">
                              <div>
                                <span className="text-slate-500">Chance/tick:</span>
                                <span className="text-amber-300 ml-1">{(procChance * 100).toFixed(1)}%</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Procs/min:</span>
                                <span className="text-green-400 ml-1">{procsPerMin.toFixed(2)}</span>
                              </div>
                              {effect.category === 'Damage' && effect.value !== undefined && effect.valueMax !== undefined && (
                                <div>
                                  <span className="text-slate-500">Avg DPS:</span>
                                  <span className="text-red-400 ml-1">
                                    {((procsPerMin * (effect.value + effect.valueMax) / 2) / 60).toFixed(1)}
                                  </span>
                                </div>
                              )}
                              {/* Endurance per second for endurance procs */}
                              {effect.category === 'Endurance' && effect.value !== undefined && (
                                <div>
                                  <span className="text-slate-500">End/sec:</span>
                                  <span className="text-blue-400 ml-1">
                                    {((procsPerMin * effect.value) / 60).toFixed(2)}
                                  </span>
                                </div>
                              )}
                              {/* HP per second for heal procs */}
                              {effect.category === 'Heal' && effect.value !== undefined && (
                                <div>
                                  <span className="text-slate-500">HP%/sec:</span>
                                  <span className="text-green-400 ml-1">
                                    {((procsPerMin * effect.value) / 60).toFixed(2)}%
                                  </span>
                                </div>
                              )}
                              {/* Recovery rate for recovery procs */}
                              {effect.category === 'Recovery' && effect.value !== undefined && (
                                <div>
                                  <span className="text-slate-500">Rec%/sec:</span>
                                  <span className="text-blue-300 ml-1">
                                    {((procsPerMin * effect.value) / 60).toFixed(2)}%
                                  </span>
                                </div>
                              )}
                              {/* Regen rate for regeneration procs */}
                              {effect.category === 'Regeneration' && effect.value !== undefined && (
                                <div>
                                  <span className="text-slate-500">Regen%/sec:</span>
                                  <span className="text-green-300 ml-1">
                                    {((procsPerMin * effect.value) / 60).toFixed(2)}%
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-[7px] text-slate-500 mt-0.5 italic">
                              Auto/Toggle: 10s pseudo-recharge, 6 checks/min
                            </div>
                          </div>
                        );
                      }

                      // For Click powers, need recharge and cast time
                      const recharge = base?.effects?.recharge || selected.effects?.recharge || 0;
                      const castTime = base?.effects?.castTime || selected.effects?.castTime || 1;
                      const radius = base?.effects?.radius || selected.effects?.radius || 0;

                      if (recharge <= 0) return null; // Can't calculate without recharge

                      const procChance = calculateProcChance(procData.ppm, recharge, castTime, radius);
                      const procsPerMin = calculateProcsPerMinute(procData.ppm, recharge, castTime, radius, 0);

                      return (
                        <div className="mt-1 pt-1 border-t border-amber-700/30">
                          <div className="text-[8px] text-amber-400/70 uppercase mb-0.5">PPM Calculation</div>
                          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[9px]">
                            <div>
                              <span className="text-slate-500">Chance:</span>
                              <span className="text-amber-300 ml-1">{(procChance * 100).toFixed(1)}%</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Procs/min:</span>
                              <span className="text-green-400 ml-1">{procsPerMin.toFixed(2)}</span>
                            </div>
                            {effect.category === 'Damage' && effect.value !== undefined && effect.valueMax !== undefined && (
                              <div>
                                <span className="text-slate-500">Avg DPS:</span>
                                <span className="text-red-400 ml-1">
                                  {calculateProcDPS(procData.ppm, effect.value, effect.valueMax, recharge, castTime, radius, 0).toFixed(1)}
                                </span>
                              </div>
                            )}
                            {/* Endurance per second for endurance procs */}
                            {effect.category === 'Endurance' && effect.value !== undefined && (
                              <div>
                                <span className="text-slate-500">End/sec:</span>
                                <span className="text-blue-400 ml-1">
                                  {((procsPerMin * effect.value) / 60).toFixed(2)}
                                </span>
                              </div>
                            )}
                            {/* HP per second for heal procs */}
                            {effect.category === 'Heal' && effect.value !== undefined && (
                              <div>
                                <span className="text-slate-500">HP%/sec:</span>
                                <span className="text-green-400 ml-1">
                                  {((procsPerMin * effect.value) / 60).toFixed(2)}%
                                </span>
                              </div>
                            )}
                            {/* Recovery rate for recovery procs */}
                            {effect.category === 'Recovery' && effect.value !== undefined && (
                              <div>
                                <span className="text-slate-500">Rec%/sec:</span>
                                <span className="text-blue-300 ml-1">
                                  {((procsPerMin * effect.value) / 60).toFixed(2)}%
                                </span>
                              </div>
                            )}
                            {/* Regen rate for regeneration procs */}
                            {effect.category === 'Regeneration' && effect.value !== undefined && (
                              <div>
                                <span className="text-slate-500">Regen%/sec:</span>
                                <span className="text-green-300 ml-1">
                                  {((procsPerMin * effect.value) / 60).toFixed(2)}%
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-[7px] text-slate-500 mt-0.5 italic">
                            Base: {recharge.toFixed(1)}s rech, {castTime.toFixed(2)}s cast{radius > 0 ? `, ${radius}ft AoE` : ''}
                          </div>
                        </div>
                      );
                    })()}

                    {/* PvP notes if any */}
                    {procData.pvpNotes && (
                      <div className="text-[8px] text-orange-400/80">
                        PvP: {procData.pvpNotes}
                      </div>
                    )}
                  </div>
                );
              } else {
                // Fallback to basic display if no proc data found
                const name = enhancement.name.toLowerCase();
                let effectText = enhancement.name;
                if (name.includes('chance for')) {
                  effectText = enhancement.name.replace(/^Chance for /i, '');
                } else if (name.includes('chance to')) {
                  effectText = enhancement.name.replace(/^Chance to /i, '');
                }

                return (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-amber-200">{effectText}</span>
                    </div>
                    <div className="text-[8px] text-slate-500 mt-1 italic">
                      Proc effects trigger based on PPM (Procs Per Minute) formula
                    </div>
                  </>
                );
              }
            })()}
          </div>
        ) : (
          /* Enhances section with calculated values - for non-proc enhancements */
          <div className="bg-slate-800/50 rounded p-1.5">
            <div className="text-[9px] text-slate-500 uppercase mb-1">Enhances:</div>
            {ioEnh.aspects.map((aspect, i) => {
              const value = calculateAspectValue(aspect);
              return (
                <div key={i} className="flex justify-between items-baseline text-[10px]">
                  <span className="text-slate-300">{aspect}</span>
                  {value !== null && (
                    <span className="text-green-400 font-mono">
                      +{(value * 100).toFixed(2)}%
                    </span>
                  )}
                </div>
              );
            })}
            {aspectCount > 1 && (
              <div className="text-[8px] text-slate-500 mt-1 italic">
                {aspectCount === 2 ? '62.5%' : aspectCount === 3 ? '50%' : '43.75%'} per aspect ({aspectCount} aspects)
              </div>
            )}
          </div>
        )}

        {/* Level and flags */}
        <div className="text-[10px] flex gap-3">
          <span className="text-slate-400">
            {ioEnh.attuned ? (
              <span className="text-purple-400">Attuned (scales to Lvl {build.level})</span>
            ) : (
              <>Level: <span className="text-slate-200">{enhancement.level}</span></>
            )}
          </span>
          {ioEnh.isUnique && (
            <span className="text-red-400">Unique</span>
          )}
          {enhancement.boost && enhancement.boost > 0 && (
            <span className="text-green-400">+{enhancement.boost} Boosted</span>
          )}
        </div>

        {/* Set Bonuses */}
        {ioSet && ioSet.bonuses.length > 0 && (() => {
          const hasPvPEffects = ioSet.category === 'pvp' && ioSet.bonuses.some(b => b.effects.some(e => e.pvp));
          return (
            <div className="border-t border-slate-700 pt-2">
              <div className="text-[9px] text-slate-500 uppercase mb-1">
                Set Bonuses ({piecesSlotted}/{ioSet.pieces.length} slotted)
              </div>
              <div className="space-y-0.5">
                {ioSet.bonuses.map((bonus, idx) => {
                  const pveEffects = hasPvPEffects ? bonus.effects.filter(e => !e.pvp) : bonus.effects;
                  if (pveEffects.length === 0) return null;
                  const isActive = piecesSlotted >= bonus.pieces;
                  return (
                    <div
                      key={idx}
                      className={`text-[10px] ${isActive ? 'text-green-400' : 'text-slate-500'}`}
                    >
                      <span className={`font-medium ${isActive ? 'text-green-500' : 'text-slate-600'}`}>
                        {bonus.pieces}pc:
                      </span>{' '}
                      {pveEffects.map((eff, i) => (
                        <span key={i}>
                          {i > 0 && ', '}
                          {eff.desc}
                        </span>
                      ))}
                    </div>
                  );
                })}
              </div>
              {hasPvPEffects && (
                <>
                  <div className="text-[9px] text-red-400/70 uppercase mt-2 mb-0.5">PvP Only</div>
                  <div className="space-y-0.5">
                    {ioSet.bonuses.map((bonus, idx) => {
                      const pvpEffects = bonus.effects.filter(e => e.pvp);
                      if (pvpEffects.length === 0) return null;
                      const isActive = piecesSlotted >= bonus.pieces;
                      return (
                        <div
                          key={idx}
                          className={`text-[10px] ${isActive ? 'text-red-400/60' : 'text-slate-600'}`}
                        >
                          <span className={`font-medium ${isActive ? 'text-red-400/70' : 'text-slate-700'}`}>
                            {bonus.pieces}pc:
                          </span>{' '}
                          {pvpEffects.map((eff, i) => (
                            <span key={i}>
                              {i > 0 && ', '}
                              {eff.desc}
                            </span>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })()}
      </div>
    );
  }

  // Generic IO Enhancement
  if (enhancement.type === 'io-generic') {
    const genericEnh = enhancement as GenericIOEnhancement;
    return (
      <div className="space-y-1.5 max-w-[250px]">
        <div className="flex items-center gap-2">
          <GenericIOIcon
            stat={genericEnh.stat}
            size={24}
            alt={enhancement.name}
            className="flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-blue-400 leading-tight">{enhancement.name}</h3>
            <span className="text-[9px] text-slate-400">Generic IO</span>
          </div>
        </div>
        <div className="text-[10px]">
          <span className="text-slate-400">Enhances: </span>
          <span className="text-green-400">{genericEnh.stat}</span>
          <span className="text-slate-400"> by </span>
          <span className="text-green-400">
            {(genericEnh.value * (1 + (enhancement.boost || 0) * 0.05)).toFixed(1)}%
          </span>
        </div>
        <div className="text-[10px] flex gap-3">
          {enhancement.level && (
            <span className="text-slate-400">
              Level: <span className="text-slate-200">{enhancement.level}</span>
            </span>
          )}
          {enhancement.boost && enhancement.boost > 0 && (
            <span className="text-green-400">+{enhancement.boost} Boosted</span>
          )}
        </div>
      </div>
    );
  }

  // Origin Enhancement (SO/DO/TO)
  if (enhancement.type === 'origin') {
    const originEnh = enhancement as OriginEnhancement;
    return (
      <div className="space-y-1.5 max-w-[250px]">
        <div className="flex items-center gap-2">
          <OriginEnhancementIcon
            stat={originEnh.stat}
            tier={originEnh.tier}
            origin={originEnh.origin}
            size={24}
            alt={enhancement.name}
            className="flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-blue-400 leading-tight">{enhancement.name}</h3>
            <span className="text-[9px] text-slate-400">{originEnh.tier}</span>
          </div>
        </div>
        <div className="text-[10px]">
          <span className="text-slate-400">Enhances: </span>
          <span className="text-green-400">{originEnh.stat}</span>
          <span className="text-slate-400"> by </span>
          <span className="text-green-400">
            {(originEnh.value * (1 + (enhancement.boost || 0) * 0.05)).toFixed(1)}%
          </span>
        </div>
        {enhancement.boost && enhancement.boost > 0 && (
          <div className="text-[10px] text-green-400">+{enhancement.boost} Boosted</div>
        )}
      </div>
    );
  }

  // Special Enhancement (Hamidon, etc.)
  if (enhancement.type === 'special') {
    const specialEnh = enhancement as SpecialEnhancement;
    // Extract icon filename from the full path if needed
    const iconName = specialEnh.icon?.includes('/')
      ? specialEnh.icon.split('/').pop() || 'Unknown.png'
      : specialEnh.icon || 'Unknown.png';

    return (
      <div className="space-y-1.5 max-w-[250px]">
        <div className="flex items-center gap-2">
          <SpecialEnhancementIcon
            icon={iconName}
            size={24}
            alt={enhancement.name}
            className="flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-purple-400 leading-tight">{enhancement.name}</h3>
            <span className="text-[9px] text-slate-400 capitalize">{specialEnh.category}</span>
          </div>
        </div>
        <div className="text-[10px]">
          <span className="text-slate-400">Enhances: </span>
          <span className="text-green-400">
            {specialEnh.aspects.map(a => {
              const boosted = a.value * (1 + (enhancement.boost || 0) * 0.05);
              return `${a.stat} +${boosted.toFixed(1)}%`;
            }).join(', ')}
          </span>
        </div>
        {enhancement.boost && enhancement.boost > 0 && (
          <div className="text-[10px] text-green-400">+{enhancement.boost} Boosted</div>
        )}
      </div>
    );
  }

  return <div className="text-slate-500 text-[10px]">Unknown enhancement type</div>;
}

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
