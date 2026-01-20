/**
 * PowerInfoTooltip - Floating tooltip that displays power or enhancement info on hover
 * Shows all power stats with Base/Enhanced/Final values
 * Remains responsive to hover changes even when info panel is locked
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useUIStore, useBuildStore } from '@/stores';
import { useGlobalBonuses } from '@/hooks/useCalculatedStats';
import { getPower, getPowerPool, getArchetype, getIOSet, getPowerset, getInherentPowerDef } from '@/data';
import { resolvePath } from '@/utils/paths';
import type { Power } from '@/types';
import {
  calculatePowerEnhancementBonuses,
  calculatePowerDamage,
  type EnhancementBonuses,
} from '@/utils/calculations';
import {
  IOSetIcon,
  GenericIOIcon,
  OriginEnhancementIcon,
  SpecialEnhancementIcon,
} from '@/components/enhancements/EnhancementIcon';
import type { DefenseByType, ResistanceByType, ProtectionEffects, ArchetypeId, IOSetEnhancement, GenericIOEnhancement, OriginEnhancement, SpecialEnhancement, Enhancement, SelectedPower } from '@/types';

// Base value for buff/debuff effects (per scale point at modifier 1.0)
const BASE_BUFF_DEBUFF = 0.10;

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

function calculateBuffDebuffValue(scale: number, effectiveModifier: number): number {
  return scale * BASE_BUFF_DEBUFF * effectiveModifier;
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

interface PowerInfoContentProps {
  powerName: string;
  powerSet: string;
}

// Three-tier stat display component - aligned in columns
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
  format?: 'number' | 'percent' | 'seconds';
  colorClass?: string;
}) {
  const formatValue = (v: number) => {
    switch (format) {
      case 'percent':
        return `${(v * 100).toFixed(1)}%`;
      case 'seconds':
        return `${v.toFixed(2)}s`;
      default:
        return v.toFixed(2);
    }
  };

  const hasEnhancement = Math.abs(enhanced - base) > 0.001;
  const hasGlobal = Math.abs(final - enhanced) > 0.001;

  return (
    <div className="grid grid-cols-[3rem_1fr_1fr_1fr] gap-1 items-baseline text-[10px]">
      <span className="text-slate-400">{label}</span>
      <span className={colorClass}>{formatValue(base)}</span>
      <span className={hasEnhancement ? 'text-green-400' : 'text-slate-600'}>
        {hasEnhancement ? `→ ${formatValue(enhanced)}` : '—'}
      </span>
      <span className={hasGlobal ? 'text-amber-400' : 'text-slate-600'}>
        {hasGlobal ? `→ ${formatValue(final)}` : '—'}
      </span>
    </div>
  );
}

// Column headers for three-tier display
function ThreeTierHeader() {
  return (
    <div className="grid grid-cols-[3rem_1fr_1fr_1fr] gap-1 text-[8px] text-slate-500 uppercase mb-0.5 border-b border-slate-700 pb-0.5">
      <span>Stat</span>
      <span>Base</span>
      <span>Enhanced</span>
      <span>Final</span>
    </div>
  );
}

function PowerInfoContent({ powerName, powerSet }: PowerInfoContentProps) {
  const build = useBuildStore((s) => s.build);
  const archetypeId = build.archetype.id;
  const globalBonuses = useGlobalBonuses();

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
      basePower = {
        name: inherentDef.name,
        fullName: inherentDef.fullName,
        description: inherentDef.description,
        icon: inherentDef.icon,
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
        basePower = {
          name: selectedInherent.name,
          fullName: selectedInherent.fullName || `Inherent.${selectedInherent.name}`,
          description: selectedInherent.description || '',
          icon: selectedInherent.icon,
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
        // Multiplicative
        enhanced = baseValue * (1 + enhBonus);
        final = enhanced * (1 + globalBonus);
        break;
      case 'endurance':
        // Reduction
        enhanced = baseValue * Math.max(0, 1 - enhBonus);
        final = enhanced * Math.max(0, 1 - globalBonus);
        break;
      case 'recharge':
        // Division
        enhanced = baseValue / Math.max(1, 1 + enhBonus);
        final = enhanced / Math.max(1, 1 + globalBonus);
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

  // Check for buffs/debuffs
  const hasBuffs = effects?.tohitBuff || effects?.damageBuff || effects?.defenseBuff;
  const hasDebuffs = effects?.tohitDebuff || effects?.defenseDebuff || effects?.resistanceDebuff;

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

      {/* Enhanceable Stats with three-tier display */}
      {effects && (effects.accuracy || effects.recharge || effects.enduranceCost) && (
        <div className="bg-slate-800/50 rounded p-1.5">
          <ThreeTierHeader />
          {effects.accuracy && (
            <ThreeTierStatRow
              label="Acc"
              {...calcThreeTier('accuracy', effects.accuracy)}
              format="percent"
              colorClass="text-yellow-400"
            />
          )}
          {effects.recharge && (
            <ThreeTierStatRow
              label="Rech"
              {...calcThreeTier('recharge', effects.recharge)}
              format="seconds"
              colorClass="text-blue-400"
            />
          )}
          {effects.enduranceCost && (
            <ThreeTierStatRow
              label="End"
              {...calcThreeTier('endurance', effects.enduranceCost)}
              format="number"
              colorClass="text-cyan-400"
            />
          )}
        </div>
      )}

      {/* Non-enhanceable stats in a compact grid */}
      {effects && (effects.castTime || (effects.range !== undefined && effects.range > 0) || effects.radius || effects.buffDuration) && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px]">
          {effects.castTime && (
            <div className="flex justify-between">
              <span className="text-slate-400">Cast</span>
              <span className="text-slate-300">{effects.castTime.toFixed(2)}s</span>
            </div>
          )}
          {effects.range !== undefined && effects.range > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-400">Range</span>
              <span className="text-slate-300">{effects.range}ft</span>
            </div>
          )}
          {effects.radius && (
            <div className="flex justify-between">
              <span className="text-slate-400">Radius</span>
              <span className="text-slate-300">{effects.radius}ft</span>
            </div>
          )}
          {effects.buffDuration && (
            <div className="flex justify-between">
              <span className="text-slate-400">Duration</span>
              <span className="text-slate-300">{effects.buffDuration.toFixed(1)}s</span>
            </div>
          )}
        </div>
      )}

      {/* Damage with three-tier display - using actual damage calculation */}
      {calculatedDamage && (
        <div className="bg-slate-800/50 rounded p-1.5">
          <div className="grid grid-cols-[3rem_1fr_1fr_1fr] gap-1 text-[8px] text-slate-500 uppercase mb-0.5 border-b border-slate-700 pb-0.5">
            <span>Type</span>
            <span>Base</span>
            <span>Enhanced</span>
            <span>Final</span>
          </div>
          {(() => {
            const hasEnh = Math.abs(calculatedDamage.enhanced - calculatedDamage.base) > 0.001;
            const hasGlobal = Math.abs(calculatedDamage.final - calculatedDamage.enhanced) > 0.001;
            return (
              <div className="grid grid-cols-[3rem_1fr_1fr_1fr] gap-1 items-baseline text-[10px]">
                <span className="text-red-400">{calculatedDamage.type}</span>
                <span className="text-slate-200">{calculatedDamage.base.toFixed(1)}</span>
                <span className={hasEnh ? 'text-green-400' : 'text-slate-600'}>
                  {hasEnh ? `→ ${calculatedDamage.enhanced.toFixed(1)}` : '—'}
                </span>
                <span className={hasGlobal ? 'text-amber-400' : 'text-slate-600'}>
                  {hasGlobal ? `→ ${calculatedDamage.final.toFixed(1)}` : '—'}
                </span>
              </div>
            );
          })()}
          {calculatedDamage.unknown && (
            <div className="text-[8px] text-slate-500 italic mt-0.5">
              * Actual damage varies
            </div>
          )}
        </div>
      )}

      {/* DoT */}
      {effects?.dot && effects.dot.scale != null && (
        <div className="text-[10px]">
          <span className="text-slate-400 text-[9px] uppercase">DoT: </span>
          <span className="text-orange-400">
            {effects.dot.type} {effects.dot.scale.toFixed(2)}/tick × {effects.dot.ticks} = {(effects.dot.scale * effects.dot.ticks).toFixed(2)} total
          </span>
        </div>
      )}

      {/* Healing */}
      {effects?.healing && effects.healing.scale != null && (
        <div className="text-[10px]">
          <span className="text-slate-400 text-[9px] uppercase">Heal: </span>
          <span className="text-green-400">{effects.healing.scale.toFixed(2)} scale</span>
        </div>
      )}

      {/* Mez Effects - inline */}
      {hasMez && (
        <div className="text-[10px]">
          <span className="text-slate-400 text-[9px] uppercase">Mez: </span>
          {effects?.stun && <span className="text-purple-400">Stun {effects.stun}{effects.stunDuration ? `(${effects.stunDuration.toFixed(1)}s)` : ''} </span>}
          {effects?.hold && <span className="text-purple-400">Hold {effects.hold}{effects.holdDuration ? `(${effects.holdDuration.toFixed(1)}s)` : ''} </span>}
          {effects?.immobilize && <span className="text-purple-400">Immob {effects.immobilize}{effects.immobilizeDuration ? `(${effects.immobilizeDuration.toFixed(1)}s)` : ''} </span>}
          {effects?.sleep && <span className="text-purple-400">Sleep {effects.sleep}{effects.sleepDuration ? `(${effects.sleepDuration.toFixed(1)}s)` : ''} </span>}
          {effects?.fear && <span className="text-purple-400">Fear {effects.fear}{effects.fearDuration ? `(${effects.fearDuration.toFixed(1)}s)` : ''} </span>}
          {effects?.confuse && <span className="text-purple-400">Confuse {effects.confuse}{effects.confuseDuration ? `(${effects.confuseDuration.toFixed(1)}s)` : ''} </span>}
          {effects?.knockback && <span className="text-purple-400">KB {effects.knockback} </span>}
        </div>
      )}

      {/* Buffs */}
      {hasBuffs && (
        <div className="text-[10px]">
          <span className="text-slate-400 text-[9px] uppercase">Buffs: </span>
          {effects?.tohitBuff && <span className="text-green-400">ToHit +{formatPercent(calculateBuffDebuffValue(effects.tohitBuff, effectiveMod))} </span>}
          {effects?.damageBuff && <span className="text-green-400">Dmg +{formatPercent(calculateBuffDebuffValue(effects.damageBuff, effectiveMod))} </span>}
          {effects?.defenseBuff && <span className="text-green-400">Def +{formatPercent(calculateBuffDebuffValue(effects.defenseBuff, effectiveMod))} </span>}
        </div>
      )}

      {/* Debuffs */}
      {hasDebuffs && (
        <div className="text-[10px]">
          <span className="text-slate-400 text-[9px] uppercase">Debuffs: </span>
          {effects?.tohitDebuff && <span className="text-red-400">ToHit -{formatPercent(calculateBuffDebuffValue(effects.tohitDebuff, effectiveMod))} </span>}
          {effects?.defenseDebuff && <span className="text-red-400">Def -{formatPercent(calculateBuffDebuffValue(effects.defenseDebuff, effectiveMod))} </span>}
          {effects?.resistanceDebuff && <span className="text-red-400">Res -{formatPercent(calculateBuffDebuffValue(effects.resistanceDebuff, effectiveMod))} </span>}
        </div>
      )}

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
        return build.epicPool.powers.find((p) => p.name === powerName);
      }
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

    return (
      <div className="space-y-2 max-w-[300px]">
        {/* Enhancement header */}
        <div className="flex items-center gap-2">
          <IOSetIcon
            icon={iconName}
            attuned={ioEnh.attuned}
            size={24}
            alt={enhancement.name}
            className="flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-blue-400 leading-tight">{enhancement.name}</h3>
            <span className="text-[9px] text-slate-400">{ioEnh.setName}</span>
          </div>
        </div>

        {/* Enhancement aspects */}
        <div className="text-[10px]">
          <span className="text-slate-400 text-[9px] uppercase">Enhances: </span>
          <span className="text-green-400">{ioEnh.aspects.join(', ')}</span>
        </div>

        {/* Level info */}
        <div className="text-[10px] flex gap-3">
          {enhancement.level && (
            <span className="text-slate-400">
              Level: <span className="text-slate-200">{enhancement.level}</span>
            </span>
          )}
          {enhancement.attuned && (
            <span className="text-purple-400">Attuned</span>
          )}
          {ioEnh.isProc && (
            <span className="text-amber-400">Proc</span>
          )}
          {ioEnh.isUnique && (
            <span className="text-red-400">Unique</span>
          )}
        </div>

        {/* Set Bonuses */}
        {ioSet && ioSet.bonuses.length > 0 && (
          <div className="border-t border-slate-700 pt-2">
            <div className="text-[9px] text-slate-400 uppercase mb-1">
              Set Bonuses ({piecesSlotted}/{ioSet.pieces.length} slotted)
            </div>
            <div className="space-y-1">
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
          <span className="text-green-400">{(genericEnh.value * 100).toFixed(1)}%</span>
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
          <span className="text-green-400">{(originEnh.value * 100).toFixed(1)}%</span>
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
