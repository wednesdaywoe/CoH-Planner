/**
 * InfoPanel - Displays detailed information about the currently hovered power
 * Renders inline within the Info Panel column (column headers are in PlannerPage)
 * Shows Base/Enhanced/Final values for enhanceable stats
 */

import { useMemo } from 'react';
import { useUIStore, useBuildStore } from '@/stores';
import {
  getPower,
  getPowerPool,
  getArchetype,
  getIOSet,
  getPowerset,
  getPowerIconPath,
  getInherentPowerDef,
  getIncarnateIconPath,
  getAlphaEffects,
  getDestinyEffects,
  getHybridEffects,
  getInterfaceEffects,
  formatEffectValue,
  isToggleableIncarnateSlot,
  mergeWithSupportEffects,
} from '@/data';
import { useGlobalBonuses } from '@/hooks/useCalculatedStats';
import { calculatePowerEnhancementBonuses, calculatePowerDamage, type EnhancementBonuses } from '@/utils/calculations';
import { resolvePath } from '@/utils/paths';
import type {
  DefenseByType,
  ResistanceByType,
  ProtectionEffects,
  ArchetypeId,
  SelectedPower,
  Power,
  IncarnateSlotId,
  ToggleableIncarnateSlot,
} from '@/types';
import { INCARNATE_SLOT_COLORS, INCARNATE_TIER_COLORS, INCARNATE_TIER_NAMES } from '@/types';

// Base value for buff/debuff effects (per scale point at modifier 1.0)
// Formula: scale × BASE × archetypeModifier
// Example: Defender (1.25 mod) with scale 2.5 = 2.5 × 0.10 × 1.25 = 31.25%
// Example: Corruptor (1.0 mod for secondary) with scale 2.5 = 2.5 × 0.10 × 1.0 = 25%
const BASE_BUFF_DEBUFF = 0.10; // 10% per scale point at modifier 1.0

/**
 * Get the effective buff/debuff modifier for the powerset
 * - Defender/Controller PRIMARY support: uses their full buffDebuffModifier
 * - Corruptor/Mastermind SECONDARY support: uses 1.0 (base rate, not their primary modifier)
 * - Others: uses 1.0
 */
function getEffectiveBuffDebuffModifier(powerSet: string, archetypeModifier: number): number {
  const powersetArchetype = powerSet.split('/')[0];

  // Defender and Controller have support as PRIMARY - use full modifier
  if (powersetArchetype === 'defender' || powersetArchetype === 'controller') {
    return archetypeModifier;
  }

  // Corruptor and Mastermind have support as SECONDARY - use base rate (1.0)
  // Their buffDebuffModifier (0.75) applies to their primary blast damage, not secondary support
  if (powersetArchetype === 'corruptor' || powersetArchetype === 'mastermind') {
    return 1.0;
  }

  // Pool powers and others use base rate
  return 1.0;
}

/**
 * Calculate the actual buff/debuff percentage value
 * Formula: scale × base × effectiveModifier
 */
function calculateBuffDebuffValue(
  scale: number,
  effectiveModifier: number
): number {
  return scale * BASE_BUFF_DEBUFF * effectiveModifier;
}

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

// Helper to format percentage values
function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

// Three-tier stat display with aligned columns
function ThreeTierHeader() {
  return (
    <div className="grid grid-cols-[5rem_1fr_1fr_1fr] gap-1 text-[9px] text-slate-500 uppercase mb-0.5 border-b border-slate-700 pb-0.5">
      <span>Stat</span>
      <span>Base</span>
      <span>Enhanced</span>
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
        return `${v.toFixed(2)}s`;
      case 'feet':
        return `${v.toFixed(0)}ft`;
      default:
        return v.toFixed(2);
    }
  };

  const hasEnhancement = Math.abs(enhanced - base) > 0.001;
  const hasGlobal = Math.abs(final - enhanced) > 0.001;

  return (
    <div className="grid grid-cols-[5rem_1fr_1fr_1fr] gap-1 items-baseline text-xs">
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

// Helper to display defense/resistance by type
function DefenseResistanceDisplay({
  label,
  values,
  colorClass
}: {
  label: string;
  values: DefenseByType | ResistanceByType;
  colorClass: string;
}) {
  const entries = Object.entries(values).filter(([, v]) => v !== undefined && v !== 0);
  if (entries.length === 0) return null;

  return (
    <div className="mt-1">
      <span className="text-slate-400 text-[10px] uppercase">{label}</span>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-0.5">
        {entries.map(([type, value]) => (
          <div key={type} className="flex justify-between">
            <span className="text-slate-500 capitalize text-[10px]">{type}</span>
            <span className={`${colorClass} text-[10px]`}>{formatPercent(value as number)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper to display mez protection
function ProtectionDisplay({ protection }: { protection: ProtectionEffects }) {
  const entries = Object.entries(protection).filter(([, v]) => v !== undefined && v !== 0);
  if (entries.length === 0) return null;

  return (
    <div className="mt-1">
      <span className="text-slate-400 text-[10px] uppercase">Mez Protection</span>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-0.5">
        {entries.map(([type, value]) => (
          <div key={type} className="flex justify-between">
            <span className="text-slate-500 capitalize text-[10px]">{type}</span>
            <span className="text-purple-400 text-[10px]">Mag {(value as number).toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PowerInfo({ powerName, powerSet }: PowerInfoProps) {
  const build = useBuildStore((s) => s.build);
  const archetypeId = build.archetype.id;
  const globalBonuses = useGlobalBonuses();

  // Try to get power from powerset first, then from pools, then from inherents
  let power: Power | undefined = getPower(powerSet, powerName);
  let powersetName = '';
  let isInherent = false;

  // Get the powerset/pool to get its display name
  const powerset = getPowerset(powerSet);
  const pool = getPowerPool(powerSet);

  if (powerset) {
    powersetName = powerset.name;
  } else if (pool) {
    powersetName = pool.name;
    if (!power) {
      power = pool.powers.find((p) => p.name === powerName);
    }
  } else if (powerSet === 'Inherent') {
    // Handle inherent powers
    isInherent = true;
    powersetName = 'Inherent';

    // First try to get from the inherent power definitions
    const inherentDef = getInherentPowerDef(powerName);
    if (inherentDef) {
      // Convert InherentPowerDef to a Power-like object for display
      power = {
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
      // Try archetype inherent - look it up from build.inherents
      const selectedInherent = build.inherents.find((p) => p.name === powerName);
      if (selectedInherent) {
        power = {
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
        // Use archetype name for archetype inherents
        if (selectedInherent.inherentCategory === 'archetype') {
          powersetName = `${build.archetype.name} Inherent`;
        }
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

  // Calculate actual damage using archetype modifiers and level
  const calculatedDamage = useMemo(() => {
    if (!power?.effects?.damage) return null;

    // Determine if this is a primary or secondary powerset
    const isPrimary = powerSet === build.primary.id;
    const isSecondary = powerSet === build.secondary.id;

    // Get the powerset category to help determine melee vs ranged
    const powersetCategory = isPrimary
      ? powerset?.category?.toUpperCase()
      : isSecondary
        ? powerset?.category?.toUpperCase()
        : undefined;

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
  }, [power, build.level, archetypeId, powersetName, enhancementBonuses.damage, globalBonusesForCalc.damage, powerSet, build.primary.id, build.secondary.id, powerset?.category]);

  if (!power) {
    return <div className="text-slate-500 text-xs">Power not found</div>;
  }

  // Merge raw power effects with curated support power data
  const effects = mergeWithSupportEffects(power.effects, powerSet, power.name);

  // Get archetype modifier for buff/debuff calculations
  const archetype = archetypeId ? getArchetype(archetypeId as ArchetypeId) : null;
  const buffDebuffMod = archetype?.stats?.buffDebuffModifier ?? 1.0;

  // Get the effective buff/debuff modifier for this powerset
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
      case 'range':
        // Range is multiplicative
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

  // Get the correct icon path based on power type
  const getIconPath = (): string => {
    if (isInherent && selectedPower) {
      const category = selectedPower.inherentCategory || 'basic';
      switch (category) {
        case 'fitness':
          return `/img/Powers/Fitness Powers Icons/${power.icon}`;
        default:
          return `/img/Powers/Inherent Powers Icons/${power.icon}`;
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

      {/* Description */}
      <div>
        <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
          Description
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: power.description.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '') }}
        />
      </div>

      {/* Consolidated Power Effects - single three-tier display */}
      {(() => {
        const allowed = new Set<string>(power?.allowedEnhancements || []);

        // Check if we have ANY effects to show in the consolidated view
        const hasAnyEffects = (
          // Power execution stats
          (allowed.has('EnduranceReduction') && effects?.enduranceCost) ||
          (allowed.has('Recharge') && effects?.recharge) ||
          (allowed.has('Accuracy') && effects?.accuracy) ||
          (allowed.has('Range') && effects?.range && effects.range > 0) ||
          // Debuffs
          effects?.tohitDebuff || effects?.defenseDebuff || effects?.resistanceDebuff ||
          effects?.damageDebuff || effects?.regenDebuff || effects?.recoveryDebuff || effects?.slow ||
          // Buffs
          effects?.tohitBuff || effects?.damageBuff || effects?.defenseBuff ||
          effects?.rechargeBuff || effects?.speedBuff || effects?.recoveryBuff || effects?.enduranceBuff ||
          // Healing
          (effects?.healing && effects.healing.scale != null)
        );

        if (!hasAnyEffects) return null;

        return (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Power Effects {effects?.buffDuration && <span className="text-slate-600 font-normal">({effects.buffDuration.toFixed(1)}s)</span>}
          </h4>
          <div className="bg-slate-800/50 rounded p-2">
            <ThreeTierHeader />

            {/* Power execution stats */}
            {allowed.has('EnduranceReduction') && effects?.enduranceCost && (
              <ThreeTierStatRow
                label="Endurance"
                {...calcThreeTier('endurance', effects.enduranceCost)}
                format="number"
                colorClass="text-blue-400"
              />
            )}
            {allowed.has('Recharge') && effects?.recharge && (
              <ThreeTierStatRow
                label="Recharge"
                {...calcThreeTier('recharge', effects.recharge)}
                format="seconds"
                colorClass="text-slate-300"
              />
            )}
            {allowed.has('Accuracy') && effects?.accuracy && (
              <ThreeTierStatRow
                label="Accuracy"
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

            {/* Buffs */}
            {effects?.tohitBuff && (
              <ThreeTierStatRow
                label="+ToHit"
                {...calcThreeTier('tohit', calculateBuffDebuffValue(effects.tohitBuff, effectiveMod))}
                format="percent"
                colorClass="text-yellow-400"
              />
            )}
            {effects?.damageBuff && (
              <ThreeTierStatRow
                label="+Damage"
                {...calcThreeTier('damage', calculateBuffDebuffValue(effects.damageBuff, effectiveMod))}
                format="percent"
                colorClass="text-red-400"
              />
            )}
            {effects?.defenseBuff && (
              <ThreeTierStatRow
                label="+Defense"
                {...calcThreeTier('defense', calculateBuffDebuffValue(effects.defenseBuff, effectiveMod))}
                format="percent"
                colorClass="text-purple-400"
              />
            )}
            {effects?.rechargeBuff && (
              <ThreeTierStatRow
                label="+Recharge"
                base={effects.rechargeBuff}
                enhanced={effects.rechargeBuff}
                final={effects.rechargeBuff}
                format="percent"
                colorClass="text-cyan-400"
              />
            )}
            {effects?.speedBuff && (
              <ThreeTierStatRow
                label="+Speed"
                base={effects.speedBuff}
                enhanced={effects.speedBuff}
                final={effects.speedBuff}
                format="percent"
                colorClass="text-cyan-400"
              />
            )}
            {effects?.recoveryBuff && (
              <ThreeTierStatRow
                label="+Recovery"
                base={effects.recoveryBuff}
                enhanced={effects.recoveryBuff}
                final={effects.recoveryBuff}
                format="percent"
                colorClass="text-blue-400"
              />
            )}
            {effects?.enduranceBuff && (
              <ThreeTierStatRow
                label="+Endurance"
                base={effects.enduranceBuff}
                enhanced={effects.enduranceBuff}
                final={effects.enduranceBuff}
                format="percent"
                colorClass="text-blue-400"
              />
            )}

            {/* Debuffs */}
            {effects?.tohitDebuff && (
              <ThreeTierStatRow
                label="-ToHit"
                {...calcThreeTier('tohitDebuff', calculateBuffDebuffValue(effects.tohitDebuff, effectiveMod))}
                format="percent"
                colorClass="text-yellow-400"
              />
            )}
            {effects?.defenseDebuff && (
              <ThreeTierStatRow
                label="-Defense"
                {...calcThreeTier('defenseDebuff', calculateBuffDebuffValue(effects.defenseDebuff, effectiveMod))}
                format="percent"
                colorClass="text-purple-400"
              />
            )}
            {effects?.resistanceDebuff && (
              <ThreeTierStatRow
                label="-Resist"
                {...calcThreeTier('resistanceDebuff', calculateBuffDebuffValue(effects.resistanceDebuff, effectiveMod))}
                format="percent"
                colorClass="text-orange-400"
              />
            )}
            {effects?.damageDebuff && (
              <ThreeTierStatRow
                label="-Damage"
                {...calcThreeTier('damageDebuff', calculateBuffDebuffValue(effects.damageDebuff, effectiveMod))}
                format="percent"
                colorClass="text-red-400"
              />
            )}
            {effects?.regenDebuff && (
              <ThreeTierStatRow
                label="-Regen"
                {...calcThreeTier('regenDebuff', calculateBuffDebuffValue(effects.regenDebuff, effectiveMod))}
                format="percent"
                colorClass="text-green-400"
              />
            )}
            {effects?.recoveryDebuff && (
              <ThreeTierStatRow
                label="-Recovery"
                {...calcThreeTier('recoveryDebuff', calculateBuffDebuffValue(effects.recoveryDebuff, effectiveMod))}
                format="percent"
                colorClass="text-blue-400"
              />
            )}
            {effects?.slow && (
              <ThreeTierStatRow
                label="-Speed"
                {...calcThreeTier('slow', effects.slow)}
                format="percent"
                colorClass="text-cyan-400"
              />
            )}
          </div>
        </div>
        );
      })()}

      {/* Fixed Stats - non-enhanceable */}
      {effects && (effects.castTime || effects.buffDuration || effects.radius) && (
        <div>
          <div className="space-y-0.5 text-xs">
            {effects.castTime && (
              <div className="flex justify-between">
                <span className="text-slate-500">Cast Time</span>
                <span className="text-slate-500">{effects.castTime.toFixed(2)}s</span>
              </div>
            )}
            {effects.buffDuration && (
              <div className="flex justify-between">
                <span className="text-slate-500">Duration</span>
                <span className="text-slate-500">{effects.buffDuration.toFixed(1)}s</span>
              </div>
            )}
            {effects.radius && (
              <div className="flex justify-between">
                <span className="text-slate-500">Radius</span>
                <span className="text-slate-500">{effects.radius} ft</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Damage with three-tier display - using actual damage calculation */}
      {calculatedDamage && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Damage <span className="text-slate-600 font-normal">(Lvl {build.level})</span>
          </h4>
          <div className="bg-slate-800/50 rounded p-2">
            <div className="grid grid-cols-[4rem_1fr_1fr_1fr] gap-1 text-[9px] text-slate-500 uppercase mb-0.5 border-b border-slate-700 pb-0.5">
              <span>Type</span>
              <span>Base</span>
              <span>Enhanced</span>
              <span>Final</span>
            </div>
            {(() => {
              const hasEnh = Math.abs(calculatedDamage.enhanced - calculatedDamage.base) > 0.001;
              const hasGlobal = Math.abs(calculatedDamage.final - calculatedDamage.enhanced) > 0.001;
              return (
                <div className="grid grid-cols-[4rem_1fr_1fr_1fr] gap-1 items-baseline text-xs">
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
              <div className="text-[9px] text-slate-500 italic mt-1">
                * Actual damage varies (pseudo-pet or redirect power)
              </div>
            )}
          </div>
        </div>
      )}

      {/* DoT */}
      {effects?.dot && effects.dot.scale != null && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Damage Over Time
          </h4>
          <div className="space-y-0.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">{effects.dot.type}</span>
              <span className="text-orange-400">{effects.dot.scale.toFixed(2)}/tick × {effects.dot.ticks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total</span>
              <span className="text-orange-300">{(effects.dot.scale * effects.dot.ticks).toFixed(2)} scale</span>
            </div>
          </div>
        </div>
      )}

      {/* Mez Effects */}
      {hasMez && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Mez Effects
          </h4>
          <div className="space-y-0.5 text-xs">
            {effects?.stun && (
              <div className="flex justify-between">
                <span className="text-slate-400">Stun</span>
                <span className="text-purple-400">
                  Mag {effects.stun}{effects.stunDuration ? ` (${effects.stunDuration.toFixed(1)}s)` : ''}
                </span>
              </div>
            )}
            {effects?.hold && (
              <div className="flex justify-between">
                <span className="text-slate-400">Hold</span>
                <span className="text-purple-400">
                  Mag {effects.hold}{effects.holdDuration ? ` (${effects.holdDuration.toFixed(1)}s)` : ''}
                </span>
              </div>
            )}
            {effects?.immobilize && (
              <div className="flex justify-between">
                <span className="text-slate-400">Immobilize</span>
                <span className="text-purple-400">
                  Mag {effects.immobilize}{effects.immobilizeDuration ? ` (${effects.immobilizeDuration.toFixed(1)}s)` : ''}
                </span>
              </div>
            )}
            {effects?.sleep && (
              <div className="flex justify-between">
                <span className="text-slate-400">Sleep</span>
                <span className="text-purple-400">
                  Mag {effects.sleep}{effects.sleepDuration ? ` (${effects.sleepDuration.toFixed(1)}s)` : ''}
                </span>
              </div>
            )}
            {effects?.fear && (
              <div className="flex justify-between">
                <span className="text-slate-400">Fear</span>
                <span className="text-purple-400">
                  Mag {effects.fear}{effects.fearDuration ? ` (${effects.fearDuration.toFixed(1)}s)` : ''}
                </span>
              </div>
            )}
            {effects?.confuse && (
              <div className="flex justify-between">
                <span className="text-slate-400">Confuse</span>
                <span className="text-purple-400">
                  Mag {effects.confuse}{effects.confuseDuration ? ` (${effects.confuseDuration.toFixed(1)}s)` : ''}
                </span>
              </div>
            )}
            {effects?.knockback && (
              <div className="flex justify-between">
                <span className="text-slate-400">Knockback</span>
                <span className="text-purple-400">
                  Mag {effects.knockback}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Defense (armor sets) */}
      {effects?.defense && (
        <DefenseResistanceDisplay
          label="Defense"
          values={effects.defense}
          colorClass="text-purple-400"
        />
      )}

      {/* Resistance (armor sets) */}
      {effects?.resistance && (
        <DefenseResistanceDisplay
          label="Resistance"
          values={effects.resistance}
          colorClass="text-orange-400"
        />
      )}

      {/* Mez Protection (armor sets) */}
      {effects?.protection && (
        <ProtectionDisplay protection={effects.protection} />
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

  const slotColor = INCARNATE_SLOT_COLORS[slotId];
  const tierColor = INCARNATE_TIER_COLORS[selectedPower.tier];
  const tierName = INCARNATE_TIER_NAMES[selectedPower.tier];
  const isToggleable = isToggleableIncarnateSlot(slotId);
  const isActive = isToggleable ? incarnateActive[slotId as ToggleableIncarnateSlot] : false;
  const iconPath = getIncarnateIconPath(slotId, selectedPower.icon);

  // Get the effects based on slot type
  const alphaEffects = slotId === 'alpha' ? getAlphaEffects(powerId) : null;
  const destinyEffects = slotId === 'destiny' ? getDestinyEffects(powerId) : null;
  const hybridEffects = slotId === 'hybrid' ? getHybridEffects(powerId) : null;
  const interfaceEffects = slotId === 'interface' ? getInterfaceEffects(powerId) : null;

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
          <div className="bg-slate-800/50 rounded p-2 space-y-0.5">
            {alphaEffects.damage !== undefined && (
              <IncarnateEffectRow label="Damage" value={alphaEffects.damage} colorClass="text-red-400" />
            )}
            {alphaEffects.accuracy !== undefined && (
              <IncarnateEffectRow label="Accuracy" value={alphaEffects.accuracy} colorClass="text-yellow-400" />
            )}
            {alphaEffects.recharge !== undefined && (
              <IncarnateEffectRow label="Recharge" value={alphaEffects.recharge} colorClass="text-cyan-400" />
            )}
            {alphaEffects.enduranceReduction !== undefined && (
              <IncarnateEffectRow label="End Reduction" value={alphaEffects.enduranceReduction} colorClass="text-blue-400" />
            )}
            {alphaEffects.heal !== undefined && (
              <IncarnateEffectRow label="Heal" value={alphaEffects.heal} colorClass="text-green-400" />
            )}
            {alphaEffects.defense !== undefined && (
              <IncarnateEffectRow label="Defense" value={alphaEffects.defense} colorClass="text-purple-400" />
            )}
            {alphaEffects.resistance !== undefined && (
              <IncarnateEffectRow label="Resistance" value={alphaEffects.resistance} colorClass="text-orange-400" />
            )}
            {alphaEffects.range !== undefined && (
              <IncarnateEffectRow label="Range" value={alphaEffects.range} colorClass="text-slate-300" />
            )}
            {alphaEffects.hold !== undefined && (
              <IncarnateEffectRow label="Hold" value={alphaEffects.hold} colorClass="text-purple-400" />
            )}
            {alphaEffects.stun !== undefined && (
              <IncarnateEffectRow label="Stun" value={alphaEffects.stun} colorClass="text-purple-400" />
            )}
            {alphaEffects.immobilize !== undefined && (
              <IncarnateEffectRow label="Immobilize" value={alphaEffects.immobilize} colorClass="text-purple-400" />
            )}
            {alphaEffects.toHitBuff !== undefined && (
              <IncarnateEffectRow label="ToHit Buff" value={alphaEffects.toHitBuff} colorClass="text-yellow-400" />
            )}
            {alphaEffects.toHitDebuff !== undefined && (
              <IncarnateEffectRow label="ToHit Debuff" value={alphaEffects.toHitDebuff} colorClass="text-yellow-400" />
            )}
            {alphaEffects.defenseDebuff !== undefined && (
              <IncarnateEffectRow label="Defense Debuff" value={alphaEffects.defenseDebuff} colorClass="text-purple-400" />
            )}
            {alphaEffects.levelShift !== undefined && alphaEffects.levelShift > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-amber-400">Level Shift</span>
                <span className="text-amber-400">+{alphaEffects.levelShift}</span>
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

      {/* Judgement/Lore note - no stat effects */}
      {(slotId === 'judgement' || slotId === 'lore') && (
        <div className="text-[10px] text-slate-500 italic">
          {slotId === 'judgement' && 'Judgement powers deal AoE damage when activated.'}
          {slotId === 'lore' && 'Lore powers summon pets to fight alongside you.'}
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
