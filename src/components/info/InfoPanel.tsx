/**
 * InfoPanel - Displays detailed information about the currently hovered power
 * Renders inline within the Info Panel column (column headers are in PlannerPage)
 * Shows Base/Enhanced/Final values for enhanceable stats
 */

import { useMemo } from 'react';
import { useUIStore, useBuildStore, useDominationActive } from '@/stores';
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
import { calculatePowerEnhancementBonuses, calculatePowerDamage, calculateDotDamage, getAlphaEnhancementBonuses, type EnhancementBonuses, type DotDamageResult } from '@/utils/calculations';
import { EffectDisplay } from './EffectDisplay';
import { resolvePath } from '@/utils/paths';
import type {
  ArchetypeId,
  Power,
  IncarnateSlotId,
  ToggleableIncarnateSlot,
} from '@/types';
import { INCARNATE_SLOT_COLORS, INCARNATE_TIER_COLORS, INCARNATE_TIER_NAMES } from '@/types';
import {
  calculateResistancePercent,
  isByTypeObject,
  getEffectiveBuffDebuffModifier,
  calcThreeTier as calcThreeTierUtil,
  findSelectedPowerInBuild,
  TYPE_LABELS_FULL,
} from './powerDisplayUtils';
import {
  DefenseResistanceDisplay,
  ProtectionDisplay,
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
    if (!power?.damage) return null;

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

  // Calculate DoT damage using same methodology as direct damage
  const calculatedDot = useMemo((): DotDamageResult | null => {
    if (!power?.effects?.dot) return null;
    const dot = power.effects.dot;
    if (!dot.scale || !dot.ticks) return null;

    // Determine if ranged based on powerset category
    const isPrimary = powerSet === build.primary.id;
    const isSecondary = powerSet === build.secondary.id;
    const powersetCategory = isPrimary
      ? powerset?.category?.toUpperCase()
      : isSecondary
        ? powerset?.category?.toUpperCase()
        : undefined;
    const isRanged = !!(powersetCategory?.includes('RANGED') ||
      power.shortHelp?.toLowerCase().includes('ranged') ||
      (power.effects?.range && power.effects.range > 20));

    return calculateDotDamage(
      { type: dot.type, scale: dot.scale, ticks: dot.ticks },
      {
        level: build.level,
        archetypeId: archetypeId as ArchetypeId | undefined,
        primaryName: powersetName,
      },
      { damage: enhancementBonuses.damage || 0 },
      globalBonusesForCalc.damage,
      0,
      isRanged
    );
  }, [power, build.level, archetypeId, powersetName, enhancementBonuses.damage, globalBonusesForCalc.damage, powerSet, build.primary.id, build.secondary.id, powerset?.category]);

  if (!power) {
    return <div className="text-slate-500 text-xs">Power not found</div>;
  }

  // Merge raw power effects with curated support power data
  const baseEffects = mergeWithSupportEffects(power.effects, powerSet, power.name);

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

      {/* Summon/Pet Info */}
      {effects?.summon && (
        <div className="bg-indigo-900/30 rounded p-2 border border-indigo-500/30">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400 text-xs font-medium">
              {effects.summon.isPseudoPet ? '⚡ Creates' : '🐾 Summons'}
            </span>
            <span className="text-slate-200 text-xs">
              {effects.summon.displayName || effects.summon.entity || 'Entity'}
            </span>
          </div>
          {effects.summon.duration && (
            <div className="text-[10px] text-slate-400 mt-0.5">
              Duration: {effects.summon.duration}s
            </div>
          )}
          {effects.summon.powers && effects.summon.powers.length > 0 && (
            <div className="text-[10px] text-slate-500 mt-0.5">
              Powers: {effects.summon.powers.map(p => p.split('.').pop()).join(', ')}
            </div>
          )}
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

      {/* Registry-driven Power Effects display */}
      <RegistryEffectsDisplay
        effects={effects}
        allowedEnhancements={power?.allowedEnhancements || []}
        enhancementBonuses={enhancementBonuses}
        globalBonuses={globalBonusesForCalc}
        buffDebuffMod={effectiveMod}
        categories={['execution', 'buff', 'debuff', 'control']}
        dominationActive={dominationActive}
        header="Power Effects"
        duration={effects?.buffDuration}
      />

      {/* Resistance/Defense by Type (Armor Powers) */}
      {effects?.resistance && isByTypeObject(effects.resistance) && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Resistance</h4>
          <div className="bg-orange-900/20 rounded p-2 grid grid-cols-4 gap-1 text-[10px]">
            {Object.entries(effects.resistance).map(([type, value]) => {
              const pct = calculateResistancePercent(value);
              return (
                <div key={type} className="text-center">
                  <div className="text-slate-400">{TYPE_LABELS_FULL[type] || type}</div>
                  <div className="text-orange-400 font-medium">{(pct * 100).toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Defense by Type (Armor Powers) */}
      {effects?.defense && isByTypeObject(effects.defense) && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Defense</h4>
          <div className="bg-purple-900/20 rounded p-2 grid grid-cols-4 gap-1 text-[10px]">
            {Object.entries(effects.defense).map(([type, value]) => {
              const pct = calculateResistancePercent(value);
              return (
                <div key={type} className="text-center">
                  <div className="text-slate-400">{TYPE_LABELS_FULL[type] || type}</div>
                  <div className="text-purple-400 font-medium">{(pct * 100).toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Elusivity (Defense Debuff Resistance) */}
      {effects?.elusivity && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Defense Debuff Resistance</h4>
          <div className="bg-teal-900/20 rounded p-2 text-[10px]">
            {isByTypeObject(effects.elusivity) ? (
              <div className="grid grid-cols-4 gap-1">
                {Object.entries(effects.elusivity).map(([type, value]) => {
                  const pct = calculateResistancePercent(value);
                  return (
                    <div key={type} className="text-center">
                      <div className="text-slate-400">{TYPE_LABELS_FULL[type] || type}</div>
                      <div className="text-teal-400 font-medium">{(pct * 100).toFixed(1)}%</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-teal-400">{(calculateResistancePercent(effects.elusivity) * 100).toFixed(1)}%</div>
            )}
          </div>
        </div>
      )}

      {/* Movement/Special effects handled by EffectDisplay below */}

      {/* Damage with three-tier display - using actual damage calculation */}
      {calculatedDamage && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Damage <span className="text-slate-600 font-normal">(Lvl {build.level})</span>
            {/* DoT indicator */}
            {(() => {
              const dmg = power?.damage;
              const duration = dmg && typeof dmg === 'object' && 'duration' in dmg ? (dmg as { duration?: number }).duration : undefined;
              const tickRate = dmg && typeof dmg === 'object' && 'tickRate' in dmg ? (dmg as { tickRate?: number }).tickRate : undefined;
              if (duration) {
                return (
                  <span className="text-orange-400 font-normal ml-1">
                    (DoT: {duration}s{tickRate ? `, ${tickRate}s ticks` : ''})
                  </span>
                );
              }
              return null;
            })()}
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
                  <span className="text-slate-200">{calculatedDamage.base.toFixed(2)}</span>
                  <span className={hasEnh ? 'text-green-400' : 'text-slate-600'}>
                    {hasEnh ? `→ ${calculatedDamage.enhanced.toFixed(2)}` : '—'}
                  </span>
                  <span className={hasGlobal ? 'text-amber-400' : 'text-slate-600'}>
                    {hasGlobal ? `→ ${calculatedDamage.final.toFixed(2)}` : '—'}
                  </span>
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

      {/* DoT with three-tier display */}
      {calculatedDot && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Damage Over Time <span className="text-slate-600 font-normal">({calculatedDot.ticks} ticks)</span>
          </h4>
          <div className="bg-slate-800/50 rounded p-2">
            <div className="grid grid-cols-[4rem_1fr_1fr_1fr] gap-1 text-[9px] text-slate-500 uppercase mb-0.5 border-b border-slate-700 pb-0.5">
              <span>Type</span>
              <span>Base</span>
              <span>Enhanced</span>
              <span>Final</span>
            </div>
            {/* Per-tick damage */}
            {(() => {
              const hasEnh = Math.abs(calculatedDot.enhancedTick - calculatedDot.baseTick) > 0.001;
              const hasGlobal = Math.abs(calculatedDot.finalTick - calculatedDot.enhancedTick) > 0.001;
              return (
                <div className="grid grid-cols-[4rem_1fr_1fr_1fr] gap-1 items-baseline text-xs">
                  <span className="text-orange-400">{calculatedDot.type}/tick</span>
                  <span className="text-slate-200">{calculatedDot.baseTick.toFixed(1)}</span>
                  <span className={hasEnh ? 'text-green-400' : 'text-slate-600'}>
                    {hasEnh ? `→ ${calculatedDot.enhancedTick.toFixed(1)}` : '—'}
                  </span>
                  <span className={hasGlobal ? 'text-amber-400' : 'text-slate-600'}>
                    {hasGlobal ? `→ ${calculatedDot.finalTick.toFixed(1)}` : '—'}
                  </span>
                </div>
              );
            })()}
            {/* Total damage */}
            {(() => {
              const hasEnh = Math.abs(calculatedDot.enhancedTotal - calculatedDot.baseTotal) > 0.001;
              const hasGlobal = Math.abs(calculatedDot.finalTotal - calculatedDot.enhancedTotal) > 0.001;
              return (
                <div className="grid grid-cols-[4rem_1fr_1fr_1fr] gap-1 items-baseline text-xs mt-1 pt-1 border-t border-slate-700/50">
                  <span className="text-orange-300">Total</span>
                  <span className="text-slate-200">{calculatedDot.baseTotal.toFixed(1)}</span>
                  <span className={hasEnh ? 'text-green-400' : 'text-slate-600'}>
                    {hasEnh ? `→ ${calculatedDot.enhancedTotal.toFixed(1)}` : '—'}
                  </span>
                  <span className={hasGlobal ? 'text-amber-400' : 'text-slate-600'}>
                    {hasGlobal ? `→ ${calculatedDot.finalTotal.toFixed(1)}` : '—'}
                  </span>
                </div>
              );
            })()}
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

      {/* Registry-based effect display for movement and special effects (control/buff/debuff handled above) */}
      {effects && (
        <EffectDisplay
          effects={effects}
          archetypeId={archetypeId as ArchetypeId | undefined}
          enhancementBonuses={enhancementBonuses}
          globalBonuses={globalBonusesForCalc}
          categories={['movement', 'special']}
          showThreeTier={true}
          buffDebuffMod={effectiveMod}
          dominationActive={dominationActive}
          powersetId={powerSet}
        />
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
