/**
 * PowerInfoTooltip - Floating tooltip that displays power or enhancement info on hover
 * Shows all power stats with Base/Enhanced/Final values
 * Remains responsive to hover changes even when info panel is locked
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useUIStore, useBuildStore, useDominationActive, useScourgeActive, useFuryLevel, useSupremacyActive, useVigilanceTeamSize, useCriticalHitsActive, useStalkerHidden, useStalkerTeamSize, useContainmentActive } from '@/stores';
import { useGlobalBonuses } from '@/hooks/useCalculatedStats';
import { getPower, getPowerPool, getArchetype, getIOSet, getPowerset, getInherentPowerDef, findProcData, parseProcEffect, getProcEffectLabel, getProcEffectColor, isProcAlwaysOn, calculateProcChance, calculateProcsPerMinute, calculateProcDPS, calculateAutoToggleProcChance, calculateAutoToggleProcsPerMinute } from '@/data';
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
  calculateDominationMagnitude,
  calculateDominationDuration,
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
  getOpportunityInfo,
  isSentinelPower,
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
  type EnhancementBonuses,
} from '@/utils/calculations';
import {
  IOSetIcon,
  GenericIOIcon,
  OriginEnhancementIcon,
  SpecialEnhancementIcon,
} from '@/components/enhancements/EnhancementIcon';
import type { DefenseByType, ResistanceByType, ProtectionEffects, ArchetypeId, IOSetEnhancement, GenericIOEnhancement, OriginEnhancement, SpecialEnhancement, Enhancement, SelectedPower } from '@/types';

/**
 * Base values for buff/debuff effects per scale point at modifier 1.0
 * In City of Heroes, debuffs and buffs use different base scaling:
 * - Debuffs (ToHit, Defense, Resistance debuffs): 5% per scale (0.05)
 * - Buffs (Damage, Defense, ToHit buffs): 10% per scale (0.10)
 */
const BASE_DEBUFF = 0.05;  // 5% per scale for debuffs
const BASE_BUFF = 0.10;    // 10% per scale for buffs

type EffectCategory = 'buff' | 'debuff';

function getEffectiveBuffDebuffModifier(powerSet: string, archetypeModifier: number): number {
  const powersetArchetype = powerSet.split('/')[0];
  if (powersetArchetype === 'defender' || powersetArchetype === 'controller') {
    return archetypeModifier;
  }
  if (powersetArchetype === 'corruptor' || powersetArchetype === 'mastermind') {
    return 1.0;
  }
  return 1.0;
}

function calculateBuffDebuffValue(scale: number, effectiveModifier: number, category: EffectCategory = 'buff'): number {
  const baseValue = category === 'debuff' ? BASE_DEBUFF : BASE_BUFF;
  return scale * baseValue * effectiveModifier;
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

// Defense/Resistance with three-tier display (Base/Enhanced/Final)
function DefenseResistanceThreeTier({
  label,
  values,
  enhancementBonus,
  colorClass,
}: {
  label: string;
  values: DefenseByType | ResistanceByType;
  enhancementBonus: number;
  colorClass: string;
}) {
  const entries = Object.entries(values).filter(([, v]) => v !== undefined && v !== 0);
  if (entries.length === 0) return null;

  const hasEnhancement = enhancementBonus > 0.001;

  return (
    <div className="bg-slate-800/50 rounded p-1.5 mt-1">
      <div className="grid grid-cols-[3.5rem_1fr_1fr_1fr] gap-1 text-[8px] text-slate-500 uppercase mb-0.5 border-b border-slate-700 pb-0.5">
        <span>{label}</span>
        <span>Base</span>
        <span>Enhanced</span>
        <span>Final</span>
      </div>
      {entries.map(([type, baseValue]) => {
        const base = baseValue as number;
        // Defense and Resistance are multiplicative with enhancements
        const enhanced = base * (1 + enhancementBonus);
        const hasEnh = Math.abs(enhanced - base) > 0.001;

        return (
          <div key={type} className="grid grid-cols-[3.5rem_1fr_1fr_1fr] gap-1 items-baseline text-[10px]">
            <span className="text-slate-400 capitalize text-[9px]">{type}</span>
            <span className={colorClass}>{formatPercent(base)}</span>
            <span className={hasEnh ? 'text-green-400' : 'text-slate-600'}>
              {hasEnh ? `→ ${formatPercent(enhanced)}` : '—'}
            </span>
            <span className="text-slate-600">—</span>
          </div>
        );
      })}
      {hasEnhancement && (
        <div className="text-[8px] text-green-500/70 mt-0.5">
          +{(enhancementBonus * 100).toFixed(1)}% from enhancements
        </div>
      )}
    </div>
  );
}

// Compact mez protection display
function ProtectionCompact({ protection }: { protection: ProtectionEffects }) {
  const entries = Object.entries(protection).filter(([, v]) => v !== undefined && v !== 0);
  if (entries.length === 0) return null;

  return (
    <div className="mt-1">
      <span className="text-slate-400 text-[9px] uppercase">Mez Protection</span>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0 mt-0.5">
        {entries.map(([type, value]) => (
          <div key={type} className="flex justify-between">
            <span className="text-slate-500 capitalize text-[9px]">{type}</span>
            <span className="text-purple-400 text-[9px]">Mag {(value as number).toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Three-tier stat display with aligned columns (compact for tooltip)
function ThreeTierHeader() {
  return (
    <div className="grid grid-cols-[4rem_1fr_1fr_1fr] gap-1 text-[8px] text-slate-500 uppercase mb-0.5 border-b border-slate-700 pb-0.5">
      <span>Stat</span>
      <span>Base</span>
      <span>Enh</span>
      <span>Final</span>
    </div>
  );
}

function ThreeTierStatRow({
  label,
  base,
  enhanced,
  final,
  format = 'number',
  colorClass = 'text-slate-200'
}: {
  label: string;
  base: number;
  enhanced: number;
  final: number;
  format?: 'number' | 'percent' | 'seconds' | 'feet';
  colorClass?: string;
}) {
  const formatValue = (v: number) => {
    switch (format) {
      case 'percent':
        return `${(v * 100).toFixed(1)}%`;
      case 'seconds':
        return `${v.toFixed(1)}s`;
      case 'feet':
        return `${v.toFixed(0)}ft`;
      default:
        return v.toFixed(2);
    }
  };

  const hasEnhancement = Math.abs(enhanced - base) > 0.001;
  const hasGlobal = Math.abs(final - enhanced) > 0.001;

  return (
    <div className="grid grid-cols-[4rem_1fr_1fr_1fr] gap-1 items-baseline text-[10px]">
      <span className={colorClass}>{label}</span>
      <span className={colorClass}>{formatValue(base)}</span>
      <span className={hasEnhancement ? 'text-green-400' : 'text-slate-600'}>
        {hasEnhancement ? formatValue(enhanced) : '—'}
      </span>
      <span className={hasGlobal ? 'text-amber-400' : 'text-slate-600'}>
        {hasGlobal ? formatValue(final) : '—'}
      </span>
    </div>
  );
}

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

  // Try to get power from powerset first, then from pools, then from inherents
  let basePower: Power | undefined = getPower(powerSet, powerName);

  if (!basePower) {
    const pool = getPowerPool(powerSet);
    if (pool) {
      basePower = pool.powers.find((p) => p.name === powerName);
    }
  }

  // Handle inherent powers
  if (!basePower && powerSet === 'Inherent') {
    const inherentDef = getInherentPowerDef(powerName);
    if (inherentDef) {
      // Resolve the full icon path based on category
      const iconPath = getInherentIconFullPath(inherentDef.icon, inherentDef.category);
      basePower = {
        name: inherentDef.name,
        fullName: inherentDef.fullName,
        description: inherentDef.description,
        icon: iconPath,
        shortHelp: inherentDef.description,
        powerType: inherentDef.powerType,
        available: 0,
        maxSlots: inherentDef.maxSlots,
        allowedEnhancements: inherentDef.allowedEnhancements as Power['allowedEnhancements'],
        allowedSetCategories: inherentDef.allowedSetCategories as Power['allowedSetCategories'],
        effects: {},
      };
    } else {
      // Try archetype inherent from build
      const selectedInherent = build.inherents.find((p) => p.name === powerName);
      if (selectedInherent) {
        // Resolve the full icon path based on inherent category
        const iconPath = getInherentIconFullPath(selectedInherent.icon || 'unknown.png', selectedInherent.inherentCategory);
        basePower = {
          name: selectedInherent.name,
          fullName: selectedInherent.fullName || `Inherent.${selectedInherent.name}`,
          description: selectedInherent.description || '',
          icon: iconPath,
          shortHelp: selectedInherent.description || '',
          powerType: selectedInherent.powerType || 'Auto',
          available: 0,
          maxSlots: selectedInherent.maxSlots,
          allowedEnhancements: (selectedInherent.allowedEnhancements || []) as Power['allowedEnhancements'],
          allowedSetCategories: (selectedInherent.allowedSetCategories || []) as Power['allowedSetCategories'],
          effects: selectedInherent.effects || {},
        };
      }
    }
  }

  // Find the selected power from build to get its slots
  const findSelectedPower = (): SelectedPower | null => {
    const primary = build.primary.powers.find((p) => p.name === powerName);
    if (primary) return primary;
    const secondary = build.secondary.powers.find((p) => p.name === powerName);
    if (secondary) return secondary;
    for (const pool of build.pools) {
      const poolPower = pool.powers.find((p) => p.name === powerName);
      if (poolPower) return poolPower;
    }
    if (build.epicPool) {
      const epic = build.epicPool.powers.find((p) => p.name === powerName);
      if (epic) return epic;
    }
    // Check inherent powers
    const inherent = build.inherents.find((p) => p.name === powerName);
    if (inherent) return inherent;
    return null;
  };

  const selectedPower = findSelectedPower();

  // Calculate enhancement bonuses if power is slotted
  const enhancementBonuses = useMemo<EnhancementBonuses>(() => {
    if (!selectedPower?.slots) return {};
    return calculatePowerEnhancementBonuses(
      { name: selectedPower.name, slots: selectedPower.slots },
      build.level,
      getIOSet
    );
  }, [selectedPower, build.level]);

  // Convert global bonuses to the format expected by power stats
  const globalBonusesForCalc = useMemo(() => ({
    damage: (globalBonuses.damage || 0) / 100,
    accuracy: (globalBonuses.accuracy || 0) / 100,
    recharge: (globalBonuses.recharge || 0) / 100,
    endurance: (globalBonuses.endurance || 0) / 100,
    range: (globalBonuses.range || 0) / 100,
  }), [globalBonuses]);

  // Get powerset for determining damage type
  const powerset = getPowerset(powerSet);

  // Calculate actual damage using archetype modifiers and level
  const calculatedDamage = useMemo(() => {
    if (!basePower?.effects?.damage) return null;

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

  if (!basePower) {
    return <div className="text-slate-500 text-[10px]">Power not found</div>;
  }

  const effects = basePower.effects;

  // Get archetype modifier for buff/debuff calculations
  const archetype = archetypeId ? getArchetype(archetypeId as ArchetypeId) : null;
  const buffDebuffMod = archetype?.stats?.buffDebuffModifier ?? 1.0;
  const effectiveMod = getEffectiveBuffDebuffModifier(powerSet, buffDebuffMod);

  // Calculate three-tier stats for key values
  const calcThreeTier = (aspect: string, baseValue: number): { base: number; enhanced: number; final: number } => {
    const enhBonus = enhancementBonuses[aspect] || 0;
    const globalBonus = globalBonusesForCalc[aspect as keyof typeof globalBonusesForCalc] || 0;

    let enhanced: number;
    let final: number;

    switch (aspect) {
      case 'damage':
      case 'accuracy':
      case 'tohitDebuff':
      case 'defenseDebuff':
      case 'heal':
      case 'defense':
      case 'resistance':
      case 'tohit':
        enhanced = baseValue * (1 + enhBonus);
        final = enhanced * (1 + globalBonus);
        break;
      case 'endurance':
        enhanced = baseValue * Math.max(0, 1 - enhBonus);
        final = enhanced * Math.max(0, 1 - globalBonus);
        break;
      case 'recharge':
        enhanced = baseValue / Math.max(1, 1 + enhBonus);
        final = enhanced / Math.max(1, 1 + globalBonus);
        break;
      case 'range':
        enhanced = baseValue * (1 + enhBonus);
        final = enhanced * (1 + globalBonus);
        break;
      default:
        enhanced = baseValue * (1 + enhBonus);
        final = enhanced * (1 + globalBonus);
    }

    return { base: baseValue, enhanced, final };
  };

  // Check for mez effects
  const hasMez = effects?.stun || effects?.hold || effects?.immobilize ||
                 effects?.sleep || effects?.fear || effects?.confuse || effects?.knockback;

  // Check if power has any enhancements
  const hasEnhancements = selectedPower && selectedPower.slots.some(s => s !== null);

  return (
    <div className="space-y-1.5 max-w-[320px]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <img
          src={basePower.icon || resolvePath('/img/Unknown.png')}
          alt=""
          className="w-6 h-6 rounded flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
          }}
        />
        <div className="min-w-0">
          <h3 className="text-xs font-semibold text-blue-400 leading-tight">{basePower.name}</h3>
          <span className="text-[9px] text-slate-400 capitalize">{basePower.powerType}</span>
          {hasEnhancements && (
            <span className="text-[8px] text-green-500 ml-1">(enhanced)</span>
          )}
        </div>
      </div>

      {/* Short Help */}
      {basePower.shortHelp && (
        <div className="text-[9px] text-amber-400/80 italic">
          {basePower.shortHelp}
        </div>
      )}

      {/* Consolidated Power Effects - single three-tier display */}
      {(() => {
        const allowed = new Set<string>(basePower?.allowedEnhancements || []);

        // Check if we have ANY effects to show in the consolidated view
        const hasAnyEffects = (
          // Power execution stats
          (allowed.has('EnduranceReduction') && effects?.enduranceCost) ||
          (allowed.has('Recharge') && effects?.recharge) ||
          (allowed.has('Accuracy') && effects?.accuracy) ||
          (allowed.has('Range') && effects?.range && effects.range > 0) ||
          // Debuffs
          effects?.tohitDebuff || effects?.defenseDebuff || effects?.resistanceDebuff ||
          // Buffs
          effects?.tohitBuff || effects?.damageBuff || effects?.defenseBuff ||
          effects?.rechargeBuff || effects?.speedBuff || effects?.recoveryBuff || effects?.enduranceBuff ||
          // Healing
          (effects?.healing && effects.healing.scale != null)
        );

        if (!hasAnyEffects) return null;

        return (
        <div className="bg-slate-800/50 rounded p-1.5">
          <div className="text-[8px] text-slate-500 uppercase mb-0.5">
            Power Effects{effects?.buffDuration ? ` (${effects.buffDuration.toFixed(0)}s)` : ''}
          </div>
          <ThreeTierHeader />

          {/* Power execution stats */}
          {allowed.has('EnduranceReduction') && effects?.enduranceCost && (
            <ThreeTierStatRow
              label="End"
              {...calcThreeTier('endurance', effects.enduranceCost)}
              format="number"
              colorClass="text-blue-400"
            />
          )}
          {allowed.has('Recharge') && effects?.recharge && (
            <ThreeTierStatRow
              label="Rech"
              {...calcThreeTier('recharge', effects.recharge)}
              format="seconds"
              colorClass="text-slate-300"
            />
          )}
          {allowed.has('Accuracy') && effects?.accuracy && (
            <ThreeTierStatRow
              label="Acc"
              {...calcThreeTier('accuracy', effects.accuracy)}
              format="percent"
              colorClass="text-slate-300"
            />
          )}
          {allowed.has('Range') && effects?.range !== undefined && effects.range > 0 && (
            <ThreeTierStatRow
              label="Range"
              {...calcThreeTier('range', effects.range)}
              format="feet"
              colorClass="text-slate-300"
            />
          )}

          {/* Healing */}
          {effects?.healing && effects.healing.scale != null && (
            <ThreeTierStatRow
              label="Heal"
              {...calcThreeTier('heal', effects.healing.scale)}
              format="number"
              colorClass="text-green-400"
            />
          )}

          {/* Buffs - use 'buff' category (10% base per scale) */}
          {effects?.tohitBuff && (
            <ThreeTierStatRow
              label="+ToHit"
              {...calcThreeTier('tohit', calculateBuffDebuffValue(effects.tohitBuff, effectiveMod, 'buff'))}
              format="percent"
              colorClass="text-yellow-400"
            />
          )}
          {effects?.damageBuff && (
            <ThreeTierStatRow
              label="+Dmg"
              {...calcThreeTier('damage', calculateBuffDebuffValue(effects.damageBuff, effectiveMod, 'buff'))}
              format="percent"
              colorClass="text-red-400"
            />
          )}
          {effects?.defenseBuff && (
            <ThreeTierStatRow
              label="+Def"
              {...calcThreeTier('defense', calculateBuffDebuffValue(effects.defenseBuff, effectiveMod, 'buff'))}
              format="percent"
              colorClass="text-purple-400"
            />
          )}
          {effects?.rechargeBuff && (
            <ThreeTierStatRow
              label="+Rech"
              base={effects.rechargeBuff}
              enhanced={effects.rechargeBuff}
              final={effects.rechargeBuff}
              format="percent"
              colorClass="text-cyan-400"
            />
          )}
          {effects?.speedBuff && (
            <ThreeTierStatRow
              label="+Spd"
              base={effects.speedBuff}
              enhanced={effects.speedBuff}
              final={effects.speedBuff}
              format="percent"
              colorClass="text-cyan-400"
            />
          )}
          {effects?.recoveryBuff && (
            <ThreeTierStatRow
              label="+Rec"
              base={effects.recoveryBuff}
              enhanced={effects.recoveryBuff}
              final={effects.recoveryBuff}
              format="percent"
              colorClass="text-blue-400"
            />
          )}
          {effects?.enduranceBuff && (
            <ThreeTierStatRow
              label="+End"
              base={effects.enduranceBuff}
              enhanced={effects.enduranceBuff}
              final={effects.enduranceBuff}
              format="percent"
              colorClass="text-blue-400"
            />
          )}

          {/* Debuffs - use 'debuff' category (5% base per scale) */}
          {effects?.tohitDebuff && (
            <ThreeTierStatRow
              label="-ToHit"
              {...calcThreeTier('tohitDebuff', calculateBuffDebuffValue(effects.tohitDebuff, effectiveMod, 'debuff'))}
              format="percent"
              colorClass="text-yellow-400"
            />
          )}
          {effects?.defenseDebuff && (
            <ThreeTierStatRow
              label="-Def"
              {...calcThreeTier('defenseDebuff', calculateBuffDebuffValue(effects.defenseDebuff, effectiveMod, 'debuff'))}
              format="percent"
              colorClass="text-purple-400"
            />
          )}
          {effects?.resistanceDebuff && (
            <ThreeTierStatRow
              label="-Resist"
              {...calcThreeTier('resistanceDebuff', calculateBuffDebuffValue(effects.resistanceDebuff, effectiveMod, 'debuff'))}
              format="percent"
              colorClass="text-orange-400"
            />
          )}
        </div>
        );
      })()}

      {/* Fixed stats */}
      {effects && (effects.castTime || effects.buffDuration || effects.radius) && (
        <div className="text-[10px] text-slate-500">
          {effects.castTime && <span>Cast {effects.castTime.toFixed(2)}s </span>}
          {effects.buffDuration && <span>Dur {effects.buffDuration.toFixed(1)}s </span>}
          {effects.radius && <span>Radius {effects.radius}ft </span>}
        </div>
      )}

      {/* Damage with three-tier display - using actual damage calculation */}
      {calculatedDamage && (() => {
        // Check if Scourge should be shown (Corruptor)
        const isCorruptor = archetypeId === 'corruptor';
        const isCorruptorPower = isCorruptorAttackPower(powerSet);
        const showScourge = isCorruptor && isCorruptorPower && scourgeActive;
        const scourgeInfo = getScourgeInfo();

        // Check if Fury should be shown (Brute)
        const isBrute = archetypeId === 'brute';
        const isBrutePower = isBruteAttackPower(powerSet);
        const showFury = isBrute && isBrutePower && furyLevel > 0;
        const furyBonus = calculateFuryDamageBonus(furyLevel);

        // Check if Vigilance should be shown (Defender)
        const isDefender = archetypeId === 'defender';
        const isDefenderAttackPower = isDefenderPower(powerSet);
        const vigilanceBonus = calculateVigilanceDamageBonus(build.level, vigilanceTeamSize);
        const showVigilance = isDefender && isDefenderAttackPower && vigilanceBonus > 0;

        // Check if Critical Hits should be shown (Scrapper)
        const isScrapper = archetypeId === 'scrapper';
        const isScrapperPower = isScrapperAttackPower(powerSet);
        const showCriticalHits = isScrapper && isScrapperPower && criticalHitsActive;
        const critInfo = getCriticalHitInfo();

        // Check if Assassination should be shown (Stalker)
        const isStalker = archetypeId === 'stalker';
        const isStalkerPower = isStalkerAttackPower(powerSet);
        const assassinationBonus = calculateAssassinationDamageBonus(stalkerHidden, stalkerTeamSize);
        const showAssassination = isStalker && isStalkerPower && assassinationBonus > 0;

        // Check if Containment should be shown (Controller)
        const isController = archetypeId === 'controller';
        const isControllerAttackPower = isControllerPower(powerSet);
        const showContainment = isController && isControllerAttackPower && containmentActive;

        // Determine final column header
        const finalColumnHeader = showScourge ? 'w/ Scourge' : showFury ? 'w/ Fury' : showVigilance ? 'w/ Vigilance' : showCriticalHits ? 'w/ Crit' : showAssassination ? (stalkerHidden ? 'w/ Crit' : 'w/ Assassin') : showContainment ? 'w/ Contain' : 'Final';

        // Calculate final damage with inherent bonuses
        const applyInherentBonus = (damage: number) => {
          if (showScourge) return calculateScourgeDamage(damage);
          if (showFury) return calculateFuryDamage(damage, furyLevel);
          if (showVigilance) return calculateVigilanceDamage(damage, build.level, vigilanceTeamSize);
          // For Critical Hits, use average vs higher rank targets (10% avg) as default display
          if (showCriticalHits) return calculateCriticalHitDamage(damage, 'higher');
          if (showAssassination) return calculateAssassinationDamage(damage, stalkerHidden, stalkerTeamSize);
          // Containment doubles damage vs controlled targets
          if (showContainment) return calculateContainmentDamage(damage, true);
          return damage;
        };

        // Get color class for inherent-modified values
        const getInherentColorClass = () => {
          if (showScourge) return 'text-cyan-400';
          if (showFury) return 'text-red-400';
          if (showVigilance) return 'text-indigo-400';
          if (showCriticalHits) return 'text-orange-400';
          if (showAssassination) return 'text-purple-400';
          if (showContainment) return 'text-cyan-400';
          return 'text-amber-400';
        };

        return (
        <div className="bg-slate-800/50 rounded p-1.5">
          <div className="grid grid-cols-[3rem_1fr_1fr_1fr] gap-1 text-[8px] text-slate-500 uppercase mb-0.5 border-b border-slate-700 pb-0.5">
            <span>Type</span>
            <span>Base</span>
            <span>Enhanced</span>
            <span>{finalColumnHeader}</span>
          </div>
          {/* Primary damage */}
          {(() => {
            const hasEnh = Math.abs(calculatedDamage.enhanced - calculatedDamage.base) > 0.001;
            const finalDamage = applyInherentBonus(calculatedDamage.final);
            const hasGlobal = Math.abs(finalDamage - calculatedDamage.enhanced) > 0.001;
            return (
              <div className="grid grid-cols-[3rem_1fr_1fr_1fr] gap-1 items-baseline text-[10px]">
                <span className="text-red-400">{calculatedDamage.type}</span>
                <span className="text-slate-200">{calculatedDamage.base.toFixed(1)}</span>
                <span className={hasEnh ? 'text-green-400' : 'text-slate-600'}>
                  {hasEnh ? `→ ${calculatedDamage.enhanced.toFixed(1)}` : '—'}
                </span>
                <span className={hasGlobal ? getInherentColorClass() : 'text-slate-600'}>
                  {hasGlobal ? `→ ${finalDamage.toFixed(1)}` : '—'}
                </span>
              </div>
            );
          })()}
          {/* Fiery Embrace conditional damage */}
          {calculatedDamage.fieryEmbraceDamage && (() => {
            const fe = calculatedDamage.fieryEmbraceDamage;
            const hasEnh = Math.abs(fe.enhanced - fe.base) > 0.001;
            const feFinal = applyInherentBonus(fe.final);
            const hasGlobal = Math.abs(feFinal - fe.enhanced) > 0.001;
            const isActive = isFieryEmbraceActive;
            return (
              <>
                <div className={`grid grid-cols-[3rem_1fr_1fr_1fr] gap-1 items-baseline text-[10px] mt-0.5 ${isActive ? '' : 'opacity-40'}`}>
                  <span className={isActive ? 'text-orange-400' : 'text-slate-500'}>{fe.type}</span>
                  <span className={isActive ? 'text-slate-300' : 'text-slate-500'}>{fe.base.toFixed(1)}</span>
                  <span className={isActive ? (hasEnh ? 'text-green-400' : 'text-slate-600') : 'text-slate-600'}>
                    {hasEnh ? `→ ${fe.enhanced.toFixed(1)}` : '—'}
                  </span>
                  <span className={isActive ? (hasGlobal ? getInherentColorClass() : 'text-slate-600') : 'text-slate-600'}>
                    {hasGlobal ? `→ ${feFinal.toFixed(1)}` : '—'}
                  </span>
                </div>
                <div className={`text-[8px] italic mt-0.5 ${isActive ? 'text-orange-400' : 'text-slate-500'}`}>
                  {isActive
                    ? '✓ Fiery Embrace active'
                    : '* Fire damage only with Fiery Embrace active'}
                </div>
              </>
            );
          })()}
          {showScourge && (
            <div className="text-[8px] text-cyan-400 mt-0.5">
              +{(scourgeInfo.averageDamageBonus * 100).toFixed(0)}% avg from Scourge (×1.{(scourgeInfo.averageDamageBonus * 100).toFixed(0)} multiplier)
            </div>
          )}
          {showFury && (
            <div className="text-[8px] text-red-400 mt-0.5">
              +{(furyBonus * 100).toFixed(0)}% from Fury ({furyLevel}/100)
            </div>
          )}
          {showVigilance && (
            <div className="text-[8px] text-indigo-400 mt-0.5">
              +{(vigilanceBonus * 100).toFixed(0)}% from Vigilance ({vigilanceTeamSize === 0 ? 'Solo' : `${vigilanceTeamSize} teammate${vigilanceTeamSize > 1 ? 's' : ''}`})
            </div>
          )}
          {showCriticalHits && (
            <div className="text-[8px] text-orange-400 mt-0.5">
              +{(critInfo.averageBonusVsHigher * 100).toFixed(0)}% avg from Critical Hits (vs Lt+)
            </div>
          )}
          {showAssassination && (
            <div className="text-[8px] text-purple-400 mt-0.5">
              +{(assassinationBonus * 100).toFixed(0)}% avg from Assassination ({stalkerHidden ? 'Hidden' : `${stalkerTeamSize === 0 ? 'Solo' : `${stalkerTeamSize} teammate${stalkerTeamSize > 1 ? 's' : ''}`}`})
            </div>
          )}
          {calculatedDamage.unknown && (
            <div className="text-[8px] text-slate-500 italic mt-0.5">
              * Actual damage varies
            </div>
          )}
        </div>
        );
      })()}

      {/* DoT */}
      {effects?.dot && effects.dot.scale != null && (
        <div className="text-[10px]">
          <span className="text-slate-400 text-[9px] uppercase">DoT: </span>
          <span className="text-orange-400">
            {effects.dot.type} {effects.dot.scale.toFixed(2)}/tick × {effects.dot.ticks} = {(effects.dot.scale * effects.dot.ticks).toFixed(2)} total
          </span>
        </div>
      )}

      {/* Mez Effects - inline */}
      {hasMez && (() => {
        // Check if Domination bonuses should apply
        const isDominator = archetypeId === 'dominator';
        const isDominatorPower = isDominatorControlPower(powerSet);
        const showDomination = isDominator && isDominatorPower && dominationActive;

        // Helper to format mez with optional Domination enhancement
        const formatMez = (type: string, baseMag: number, baseDur?: number) => {
          const enhancedMag = showDomination ? calculateDominationMagnitude(baseMag) : baseMag;
          const enhancedDur = showDomination && baseDur ? calculateDominationDuration(baseDur) : baseDur;

          return (
            <span key={type} className={showDomination ? 'text-pink-400' : 'text-purple-400'}>
              {type} Mag {enhancedMag}
              {enhancedDur ? ` (${enhancedDur.toFixed(1)}s)` : ''}
              {showDomination && (
                <span className="text-pink-300 text-[8px]"> [2×]</span>
              )}
              {' '}
            </span>
          );
        };

        return (
          <div className="text-[10px]">
            <span className="text-slate-400 text-[9px] uppercase">
              Mez{showDomination && <span className="text-pink-400 ml-1">(Domination)</span>}:
            </span>{' '}
            {effects?.stun && formatMez('Stun', effects.stun, effects.stunDuration)}
            {effects?.hold && formatMez('Hold', effects.hold, effects.holdDuration)}
            {effects?.immobilize && formatMez('Immob', effects.immobilize, effects.immobilizeDuration)}
            {effects?.sleep && formatMez('Sleep', effects.sleep, effects.sleepDuration)}
            {effects?.fear && formatMez('Fear', effects.fear, effects.fearDuration)}
            {effects?.confuse && formatMez('Confuse', effects.confuse, effects.confuseDuration)}
            {effects?.knockback && <span className="text-purple-400">KB Mag {effects.knockback} </span>}
          </div>
        );
      })()}

      {/* Defense (armor sets) - with three-tier display */}
      {effects?.defense && (
        <DefenseResistanceThreeTier
          label="Defense"
          values={effects.defense}
          enhancementBonus={enhancementBonuses.defenseBuff || enhancementBonuses.defense || 0}
          colorClass="text-purple-400"
        />
      )}

      {/* Resistance (armor sets) - with three-tier display */}
      {effects?.resistance && (
        <DefenseResistanceThreeTier
          label="Resistance"
          values={effects.resistance}
          enhancementBonus={enhancementBonuses.resistance || 0}
          colorClass="text-orange-400"
        />
      )}

      {/* Mez Protection (armor sets) */}
      {effects?.protection && (
        <ProtectionCompact protection={effects.protection} />
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

      {/* Sentinel Opportunity - show when viewing Sentinel powers */}
      {(() => {
        // Only show for Sentinel archetype and sentinel powersets
        if (archetypeId !== 'sentinel' || !isSentinelPower(powerSet)) return null;

        const opportunityInfo = getOpportunityInfo();

        return (
          <div className="text-[10px] mt-1 rounded px-1.5 py-1 border bg-emerald-900/30 border-emerald-700/50">
            <div className="flex items-center justify-between">
              <span className="font-medium text-emerald-400">
                Opportunity
              </span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-600/50 text-emerald-200">
                Enemy Debuff
              </span>
            </div>
            <div className="mt-1 space-y-0.5 text-[9px]">
              <div className="text-emerald-300">
                -{(opportunityInfo.defenseDebuff * 100).toFixed(2)}% Defense
              </div>
              <div className="text-emerald-300">
                -{(opportunityInfo.resistanceDebuff * 100).toFixed(0)}% Resistance (all damage types)
              </div>
              <div className="text-emerald-300">
                -{(opportunityInfo.mezResistanceDebuff * 100).toFixed(0)}% Mez Resistance (longer durations)
              </div>
              <div className="text-emerald-300">
                -{opportunityInfo.stealthReduction}ft Stealth
              </div>
            </div>
            <div className="text-[8px] text-slate-500 mt-1 pt-1 border-t border-emerald-700/30">
              Applied to enemy via T1 (Offensive) or T2 (Defensive) attack when meter is full
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

    const calculateAspectValue = (aspect: string): number | null => {
      const normalized = normalizeAspectName(aspect);
      if (!normalized) return null;
      const schedule = getAspectSchedule(normalized);
      const baseValue = getIOValueAtLevel(effectiveLevel, schedule);
      return baseValue * aspectModifier;
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
                const badgeColors = {
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
                }[effect.category] || 'bg-slate-700 text-slate-300';

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
        </div>

        {/* Set Bonuses */}
        {ioSet && ioSet.bonuses.length > 0 && (
          <div className="border-t border-slate-700 pt-2">
            <div className="text-[9px] text-slate-500 uppercase mb-1">
              Set Bonuses ({piecesSlotted}/{ioSet.pieces.length} slotted)
            </div>
            <div className="space-y-0.5">
              {ioSet.bonuses.map((bonus, idx) => {
                const isActive = piecesSlotted >= bonus.pieces;
                return (
                  <div
                    key={idx}
                    className={`text-[10px] ${isActive ? 'text-green-400' : 'text-slate-500'}`}
                  >
                    <span className={`font-medium ${isActive ? 'text-green-500' : 'text-slate-600'}`}>
                      {bonus.pieces}pc:
                    </span>{' '}
                    {bonus.effects.map((eff, i) => (
                      <span key={i}>
                        {i > 0 && ', '}
                        {eff.desc}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
          <span className="text-green-400">{genericEnh.value.toFixed(1)}%</span>
        </div>
        {enhancement.level && (
          <div className="text-[10px] text-slate-400">
            Level: <span className="text-slate-200">{enhancement.level}</span>
          </div>
        )}
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
          <span className="text-green-400">{originEnh.value.toFixed(1)}%</span>
        </div>
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
          <span className="text-green-400">{specialEnh.aspects.join(', ')}</span>
          <span className="text-slate-400"> by </span>
          <span className="text-green-400">{(specialEnh.value * 100).toFixed(1)}%</span>
        </div>
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
