/**
 * InfoPanel - Displays detailed information about the currently hovered power
 * Renders inline within the Info Panel column (column headers are in PlannerPage)
 * Shows Base/Enhanced/Final values for enhanceable stats
 */

import { useMemo, useState } from 'react';
import { useUIStore, useBuildStore, useDominationActive, useScourgeActive, useFuryLevel, useContainmentActive, useCriticalHitsActive, useStalkerHidden, useStalkerTeamSize } from '@/stores';
import {
  lookupPower,
  getArchetype,
  getIOSet,
  getPowerIconPath,
  getIncarnateIconPath,
  getAlphaEffects,
  getDestinyEffects,
  getHybridEffects,
  getInterfaceEffects,
  getJudgementEffects,
  getLoreEffects,
  formatEffectValue,
  isSlotToggleable,
  mergeWithSupportEffects,
} from '@/data';
import { useGlobalBonuses } from '@/hooks/useCalculatedStats';
import { calculatePowerEnhancementBonuses, calculatePowerDamage, getAlphaEnhancementBonuses, abbreviateDamageType, type EnhancementBonuses, isControllerPower, isCorruptorAttackPower, isBruteAttackPower, isScrapperAttackPower, isStalkerAttackPower, calculateContainmentDamage, calculateScourgeDamage, calculateFuryDamage, calculateFuryDamageBonus, calculateCriticalHitDamage, calculateAssassinationDamage, calculateAssassinationDamageBonus, getContainmentInfo, getScourgeInfo, getCriticalHitInfo, getFuryInfo } from '@/utils/calculations';
import { calculatePetDamage, shouldApplyEnhancements, type PetDamageResult, type PetAbilityDamage } from '@/utils/calculations/pet-damage';
import { PET_ENTITIES, type PetAbility } from '@/data/pet-entities';
import { resolvePath } from '@/utils/paths';
import type {
  ArchetypeId,
  Power,
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
} from './powerDisplayUtils';
import {
  RegistryEffectsDisplay,
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
      {/* Lock indicator */}
      {infoPanel.locked && (
        <button
          onClick={unlockInfoPanel}
          className="absolute top-0 right-0 text-amber-400 hover:text-amber-300 p-1 z-10"
          title="Click to unlock (allow hover updates)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {content.type === 'power' && (
        <PowerInfo powerName={content.powerName} powerSet={content.powerSet} />
      )}

      {content.type === 'enhancement' && (
        <EnhancementInfo enhancementId={content.enhancementId} />
      )}

      {content.type === 'incarnate' && (
        <IncarnateInfo slotId={content.slotId as IncarnateSlotId} powerId={content.powerId} />
      )}
    </div>
  );
}

interface PowerInfoProps {
  powerName: string;
  powerSet: string;
}

function PowerInfo({ powerName, powerSet }: PowerInfoProps) {
  const build = useBuildStore((s) => s.build);
  const archetypeId = build.archetype.id;
  const globalBonuses = useGlobalBonuses();
  const incarnateActive = useUIStore((s) => s.incarnateActive);
  const dominationActive = useDominationActive();
  const scourgeActive = useScourgeActive();
  const furyLevel = useFuryLevel();
  const containmentActive = useContainmentActive();
  const criticalHitsActive = useCriticalHitsActive();
  const stalkerHidden = useStalkerHidden();
  const stalkerTeamSize = useStalkerTeamSize();

  // Unified power lookup across all categories
  const result = lookupPower(powerSet, powerName);
  let power: Power | undefined = result?.power;
  let powersetName = result?.powersetName || '';
  let isInherent = result?.isInherent || false;

  // Archetype inherent fallback (dynamically created, not in static data)
  if (!power && powerSet === 'Inherent') {
    isInherent = true;
    powersetName = 'Inherent';
    const selectedInherent = build.inherents.find((p) => p.name === powerName);
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

  // Calculate enhancement bonuses if power is slotted, plus Alpha bonuses
  const enhancementBonuses = useMemo<EnhancementBonuses>(() => {
    // Start with slotted enhancement bonuses
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

  // Calculate actual damage using archetype modifiers and level
  const calculatedDamage = useMemo(() => {
    if (!power?.damage) return null;

    // Determine if this is a primary or secondary powerset
    const isPrimary = powerSet === build.primary.id;
    const isSecondary = powerSet === build.secondary.id;

    // Derive the powerset category for melee vs ranged determination
    const powersetCategory = isPrimary ? 'PRIMARY' : isSecondary ? 'SECONDARY' : undefined;

    return calculatePowerDamage(
      power,
      {
        level: build.level,
        archetypeId: archetypeId as ArchetypeId | undefined,
        primaryName: powersetName,
        primaryCategory: powersetCategory,
      },
      { damage: enhancementBonuses.damage || 0 },
      globalBonusesForCalc.damage,
      0 // active buffs (from powers like Build Up) - not tracked yet
    );
  }, [power, build.level, archetypeId, powersetName, enhancementBonuses.damage, globalBonusesForCalc.damage, powerSet, build.primary.id, build.secondary.id]);

  // Extract DoT info from power.damage (duration/tickRate fields)
  const dotInfo = useMemo(() => {
    const dmg = power?.damage;
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
  }, [power?.damage]);

  // Calculate archetype inherent damage bonus info (Containment, Scourge, Fury, etc.)
  const inherentInfo = useMemo(() => {
    if (!calculatedDamage) return null;

    const isController = archetypeId === 'controller';
    const isCorruptor = archetypeId === 'corruptor';
    const isBrute = archetypeId === 'brute';
    const isScrapper = archetypeId === 'scrapper';
    const isStalker = archetypeId === 'stalker';

    const showContainment = isController && isControllerPower(powerSet) && containmentActive;
    const showScourge = isCorruptor && isCorruptorAttackPower(powerSet) && scourgeActive;
    const showFury = isBrute && isBruteAttackPower(powerSet) && furyLevel > 0;
    const showCriticalHits = isScrapper && isScrapperAttackPower(powerSet) && criticalHitsActive;
    const showAssassination = isStalker && isStalkerAttackPower(powerSet) && (stalkerHidden || stalkerTeamSize > 0);

    const hasInherent = showContainment || showScourge || showFury || showCriticalHits || showAssassination;
    if (!hasInherent) return null;

    const header = showScourge ? 'w/ Scourge'
      : showFury ? 'w/ Fury'
      : showCriticalHits ? 'w/ Crit'
      : showAssassination ? (stalkerHidden ? 'w/ Crit' : 'w/ Assassin')
      : showContainment ? 'w/ Contain'
      : 'Final';

    const color = showScourge ? 'text-cyan-400'
      : showFury ? 'text-red-400'
      : showCriticalHits ? 'text-orange-400'
      : showAssassination ? 'text-purple-400'
      : showContainment ? 'text-cyan-400'
      : 'text-amber-400';

    const applyBonus = (damage: number) => {
      if (showScourge) return calculateScourgeDamage(damage);
      if (showFury) return calculateFuryDamage(damage, furyLevel);
      if (showCriticalHits) return calculateCriticalHitDamage(damage, 'higher');
      if (showAssassination) return calculateAssassinationDamage(damage, stalkerHidden, stalkerTeamSize);
      if (showContainment) return calculateContainmentDamage(damage, true);
      return damage;
    };

    return { header, color, applyBonus, showContainment };
  }, [calculatedDamage, archetypeId, powerSet, containmentActive, scourgeActive, furyLevel,
      criticalHitsActive, stalkerHidden, stalkerTeamSize]);

  if (!power) {
    return <div className="text-slate-500 text-xs">Power not found</div>;
  }

  // Merge raw power effects with curated support power data
  const baseEffects = mergeWithSupportEffects(power.effects, powerSet, power.name);

  // Extract healing from damage field (e.g., Life Drain, Reconstruction)
  // Handles both single object { type: "Heal", scale, table } and array entries
  let healFromDamage: { scale: number; table?: string } | undefined;
  if (!baseEffects?.healing) {
    const dmg = power.damage;
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

  // Merge power.stats into effects for registry-driven display
  // Map stats field names to registry-expected names
  const effects = {
    ...baseEffects,
    // Execution stats from power.stats
    ...(power.stats?.endurance && { enduranceCost: power.stats.endurance }),
    ...(power.stats?.recharge && { recharge: power.stats.recharge }),
    ...(power.stats?.accuracy && { accuracy: power.stats.accuracy }),
    ...(power.stats?.range && { range: power.stats.range }),
    ...(power.stats?.castTime && { castTime: power.stats.castTime }),
    // Healing from damage array
    ...(healFromDamage && { healing: healFromDamage }),
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

  // Get the correct icon path based on power type
  const getIconPath = (): string => {
    if (isInherent && selectedPower) {
      const category = selectedPower.inherentCategory || 'basic';
      const lowercaseIcon = power.icon?.toLowerCase() || 'unknown.png';
      switch (category) {
        case 'fitness':
          return resolvePath(`/img/Powers/Fitness Powers Icons/${lowercaseIcon}`);
        case 'archetype':
          return resolvePath(`/img/Powers/Archetype Inherent Powers icons/${lowercaseIcon}`);
        default:
          return resolvePath(`/img/Powers/Inherent Powers Icons/${lowercaseIcon}`);
      }
    }
    return getPowerIconPath(powersetName, power.icon);
  };

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
        />
      )}

      {/* Registry-driven Power Effects display */}
      <RegistryEffectsDisplay
        effects={effects}
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
      />

      {/* Damage with three-tier display - using actual damage calculation */}
      {calculatedDamage && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Damage <span className="text-slate-600 font-normal">(Lvl {build.level})</span>
          </h4>
          <div className="bg-slate-800/50 rounded p-2">
            {(() => {
              const gridCols = inherentInfo ? 'grid-cols-[4rem_1fr_1fr_1fr_1fr]' : 'grid-cols-[4rem_1fr_1fr_1fr]';
              const hasEnh = Math.abs(calculatedDamage.enhanced - calculatedDamage.base) > 0.001;
              const hasGlobal = Math.abs(calculatedDamage.final - calculatedDamage.enhanced) > 0.001;
              const isDot = dotInfo && dotInfo.duration > 0 && dotInfo.tickRate;
              const numTicks = isDot ? Math.floor(dotInfo.duration / dotInfo.tickRate!) + 1 : 0;
              const totalBase = calculatedDamage.base * numTicks;
              const totalEnhanced = calculatedDamage.enhanced * numTicks;
              const totalFinal = calculatedDamage.final * numTicks;
              const hasTotalEnh = numTicks > 0 && Math.abs(totalEnhanced - totalBase) > 0.001;
              const hasTotalGlobal = numTicks > 0 && Math.abs(totalFinal - totalEnhanced) > 0.001;
              const inherentFinal = inherentInfo ? inherentInfo.applyBonus(calculatedDamage.final) : calculatedDamage.final;
              const hasInherentDiff = inherentInfo != null && Math.abs(inherentFinal - calculatedDamage.final) > 0.001;
              const totalInherent = inherentFinal * numTicks;
              const hasTotalInherent = numTicks > 0 && inherentInfo != null && Math.abs(totalInherent - totalFinal) > 0.001;
              return (
                <>
                  <div className={`grid ${gridCols} gap-1 text-[9px] text-slate-500 uppercase mb-0.5 border-b border-slate-700 pb-0.5`}>
                    <span>Type</span>
                    <span>Base</span>
                    <span>Enhanced</span>
                    <span>Final</span>
                    {inherentInfo && <span className={inherentInfo.color}>{inherentInfo.header}</span>}
                  </div>
                  <div className={`grid ${gridCols} gap-1 items-baseline text-xs`}>
                    <span className="text-red-400">{isDot ? `${abbreviateDamageType(calculatedDamage.type)}/tick` : abbreviateDamageType(calculatedDamage.type)}</span>
                    <span className="text-slate-200">{calculatedDamage.base.toFixed(2)}</span>
                    <span className={hasEnh ? 'text-green-400' : 'text-slate-600'}>
                      {hasEnh ? `→ ${calculatedDamage.enhanced.toFixed(2)}` : '—'}
                    </span>
                    <span className={hasGlobal ? 'text-amber-400' : 'text-slate-600'}>
                      {hasGlobal ? `→ ${calculatedDamage.final.toFixed(2)}` : '—'}
                    </span>
                    {inherentInfo && (
                      <span className={hasInherentDiff ? inherentInfo.color : 'text-slate-600'}>
                        {hasInherentDiff ? `→ ${inherentFinal.toFixed(2)}` : '—'}
                      </span>
                    )}
                  </div>
                  {isDot && (
                    <>
                      <div className={`grid ${gridCols} gap-1 items-baseline text-xs mt-1 pt-1 border-t border-slate-700/50`}>
                        <span className="text-orange-400">Total</span>
                        <span className="text-slate-200">{totalBase.toFixed(2)}</span>
                        <span className={hasTotalEnh ? 'text-green-400' : 'text-slate-600'}>
                          {hasTotalEnh ? `→ ${totalEnhanced.toFixed(2)}` : '—'}
                        </span>
                        <span className={hasTotalGlobal ? 'text-amber-400' : 'text-slate-600'}>
                          {hasTotalGlobal ? `→ ${totalFinal.toFixed(2)}` : '—'}
                        </span>
                        {inherentInfo && (
                          <span className={hasTotalInherent ? inherentInfo.color : 'text-slate-600'}>
                            {hasTotalInherent ? `→ ${totalInherent.toFixed(2)}` : '—'}
                          </span>
                        )}
                      </div>
                      <div className="text-[9px] text-orange-400/70 italic mt-0.5 ml-1">
                        {numTicks} ticks over {dotInfo.duration}s ({dotInfo.tickRate}s/tick)
                      </div>
                    </>
                  )}
                </>
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
                const castTime = effects.castTime;

                // Cycle time = cast time + recharge time
                const baseCycleTime = castTime + effects.recharge;
                const finalCycleTime = castTime + rechargeStats.final;

                // DPS = damage / cycle time
                const baseDPS = calculatedDamage.base / baseCycleTime;
                const finalDPS = calculatedDamage.final / finalCycleTime;

                const dpsImproved = finalDPS > baseDPS * 1.01; // More than 1% improvement

                return (
                  <div className="mt-2 pt-2 border-t border-slate-700">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">Cycle Time</span>
                        <div className="text-slate-300">
                          {finalCycleTime.toFixed(2)}s
                          {finalCycleTime < baseCycleTime - 0.01 && (
                            <span className="text-green-400 text-[10px] ml-1">
                              (was {baseCycleTime.toFixed(1)}s)
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">DPS</span>
                        <div className={dpsImproved ? 'text-amber-400' : 'text-slate-300'}>
                          {finalDPS.toFixed(2)}
                          {dpsImproved && (
                            <span className="text-green-400 text-[10px] ml-1">
                              (+{((finalDPS / baseDPS - 1) * 100).toFixed(0)}%)
                            </span>
                          )}
                        </div>
                      </div>
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
                  ? 'bg-cyan-900/30 border-cyan-700/50'
                  : 'bg-slate-800/50 border-slate-700/30'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${scourgeActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                    Scourge
                  </span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                    scourgeActive ? 'bg-cyan-600/50 text-cyan-200' : 'bg-slate-700 text-slate-400'
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

          {/* Fury (Brute) */}
          {archetypeId === 'brute' && isBruteAttackPower(powerSet) && (() => {
            const furyInfo = getFuryInfo();
            const currentBonus = calculateFuryDamageBonus(furyLevel);
            return (
              <div className={`text-[10px] rounded px-2 py-1.5 border ${
                furyLevel > 0
                  ? 'bg-red-900/30 border-red-700/50'
                  : 'bg-slate-800/50 border-slate-700/30'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${furyLevel > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                    Fury
                  </span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                    furyLevel > 0 ? 'bg-red-600/50 text-red-200' : 'bg-slate-700 text-slate-400'
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

          {/* Critical Hits (Scrapper) */}
          {archetypeId === 'scrapper' && isScrapperAttackPower(powerSet) && (() => {
            const criticalHitInfo = getCriticalHitInfo();
            return (
              <div className={`text-[10px] rounded px-2 py-1.5 border ${
                criticalHitsActive
                  ? 'bg-orange-900/30 border-orange-700/50'
                  : 'bg-slate-800/50 border-slate-700/30'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${criticalHitsActive ? 'text-orange-400' : 'text-slate-400'}`}>
                    Critical Hits
                  </span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                    criticalHitsActive ? 'bg-orange-600/50 text-orange-200' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {criticalHitsActive ? 'SHOWING AVG' : 'Hidden'}
                  </span>
                </div>
                {criticalHitsActive && (
                  <div className="mt-1 space-y-0.5 text-[9px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">vs Minions:</span>
                      <span className="text-orange-300">
                        {(criticalHitInfo.chanceVsMinions * 100).toFixed(0)}% → +{(criticalHitInfo.averageBonusVsMinions * 100).toFixed(0)}% avg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">vs Lt/Boss+:</span>
                      <span className="text-orange-300">
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
            const currentBonus = calculateAssassinationDamageBonus(stalkerHidden, stalkerTeamSize);
            return (
              <div className={`text-[10px] rounded px-2 py-1.5 border ${
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
                    stalkerHidden ? 'bg-purple-600/60 text-purple-100' : 'bg-purple-600/50 text-purple-200'
                  }`}>
                    {stalkerHidden ? 'FROM HIDE' : `${stalkerTeamSize === 0 ? 'Solo' : `+${stalkerTeamSize}`}`}
                  </span>
                </div>
                <div className="mt-1 text-[9px]">
                  {stalkerHidden ? (
                    <span className="text-purple-300 font-medium">100% critical — +100% avg damage</span>
                  ) : (
                    <span className="text-purple-300">+{(currentBonus * 100).toFixed(0)}% avg from Assassination</span>
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
                  ? 'bg-cyan-900/40 border-cyan-600/60'
                  : 'bg-slate-800/50 border-slate-700/30'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${containmentActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                    Containment
                  </span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                    containmentActive ? 'bg-cyan-600/50 text-cyan-200' : 'bg-slate-700/50 text-slate-400'
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
        </>
      )}

      {/* Enhancement Bonuses Summary */}
      {hasEnhancements && Object.keys(enhancementBonuses).length > 0 && (
        <div className="border-t border-slate-700 pt-2 mt-2">
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Enhancement Bonuses (after ED)
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
            {Object.entries(enhancementBonuses).map(([aspect, value]) => (
              <div key={aspect} className="flex justify-between">
                <span className="text-slate-400 capitalize">{aspect}</span>
                <span className="text-green-400">+{((value || 0) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
  const iconPath = getIncarnateIconPath(slotId, selectedPower.icon);

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
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Toggle Effects
          </h4>
          <div className="bg-slate-800/50 rounded p-2 space-y-0.5">
            {hybridEffects.damage !== undefined && (
              <IncarnateEffectRow label="Damage" value={hybridEffects.damage} colorClass="text-red-400" />
            )}
            {hybridEffects.damageProc !== undefined && (
              <IncarnateEffectRow label="Damage Proc" value={hybridEffects.damageProc} colorClass="text-red-400" suffix=" chance" />
            )}
            {hybridEffects.doublehitChance !== undefined && (
              <IncarnateEffectRow label="Double Hit" value={hybridEffects.doublehitChance} colorClass="text-red-400" suffix=" chance" />
            )}
            {hybridEffects.defense !== undefined && (
              <IncarnateEffectRow label="Defense" value={hybridEffects.defense} colorClass="text-purple-400" />
            )}
            {hybridEffects.defenseAll !== undefined && (
              <IncarnateEffectRow label="Defense (All)" value={hybridEffects.defenseAll} colorClass="text-purple-400" />
            )}
            {hybridEffects.resistanceAll !== undefined && (
              <IncarnateEffectRow label="Resistance (All)" value={hybridEffects.resistanceAll} colorClass="text-orange-400" />
            )}
            {hybridEffects.regeneration !== undefined && (
              <IncarnateEffectRow label="Regeneration" value={hybridEffects.regeneration} colorClass="text-green-400" />
            )}
            {hybridEffects.accuracy !== undefined && (
              <IncarnateEffectRow label="Accuracy" value={hybridEffects.accuracy} colorClass="text-yellow-400" />
            )}
            {hybridEffects.statusProtection !== undefined && (
              <div className="flex justify-between text-xs">
                <span className="text-purple-400">Status Protection</span>
                <span className="text-purple-400">Mag {hybridEffects.statusProtection}</span>
              </div>
            )}
            {hybridEffects.mezMagnitudeBonus !== undefined && hybridEffects.mezMagnitudeBonus > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-purple-400">Mez Magnitude</span>
                <span className="text-purple-400">+{hybridEffects.mezMagnitudeBonus}</span>
              </div>
            )}
          </div>
          {hybridEffects.duration !== undefined && (
            <div className="text-[9px] text-slate-500 mt-1">
              Duration: {hybridEffects.duration}s / Recharge: {hybridEffects.recharge}s
            </div>
          )}
        </div>
      )}

      {/* Interface Effects (Proc-based) */}
      {interfaceEffects && (
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
                <span className="text-slate-400">DoT Type</span>
                <span className="text-red-400">{interfaceEffects.dotType}</span>
              </div>
            )}
            {interfaceEffects.dotDamage !== undefined && (
              <IncarnateEffectRow label="DoT Damage" value={interfaceEffects.dotDamage} colorClass="text-red-400" suffix=" scale" />
            )}
            {interfaceEffects.procChance !== undefined && (
              <IncarnateEffectRow label="Proc Chance" value={interfaceEffects.procChance} colorClass="text-cyan-400" />
            )}
          </div>
        </div>
      )}

      {/* Judgement Effects (Click attack) */}
      {judgementEffects && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Attack Details
          </h4>
          <div className="bg-slate-800/50 rounded p-2 space-y-0.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Damage Type</span>
              <span className="text-red-400">{judgementEffects.damageType}</span>
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
      )}

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

function PetDamageDisplay({ summon, level, enhancementDamageBonus, globalDamageBonus }: PetDamageDisplayProps) {
  const [upgradeTier, setUpgradeTier] = useState(0);

  // Build entity list from either entities array or single entity
  const entityList = useMemo(() => {
    if (summon.entities) {
      return summon.entities.map(e => ({ entityName: e.entity, count: e.count }));
    }
    if (summon.entity) {
      return [{ entityName: summon.entity, count: summon.entityCount || 1 }];
    }
    return [];
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

          {/* Aggregate total across all entity types */}
          {hasDamage && (
            <div className="border-t border-indigo-500/30 pt-1.5 mt-1.5">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-medium">Total Henchmen DPS:</span>
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
