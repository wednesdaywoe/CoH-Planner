/**
 * CompareSlottingModal - Compare different enhancement configurations for a power
 *
 * Opens from the slot context menu. Users can create multiple copies of a power
 * with different slotting, hover to compare stats in real-time, and apply a
 * chosen configuration to their build.
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import { lookupPower, getIOSet, getPowerIconPath } from '@/data';
import { getArchetype } from '@/data';
import { calculatePowerEnhancementBonuses } from '@/utils/calculations/enhancement-values';
import { calculatePowerDamage } from '@/utils/calculations/damage';
import { getAlphaEnhancementBonuses, calculateCharacterTotals } from '@/utils/calculations/character-totals';
import { computeSetTracking } from '@/utils/calculations/set-tracking';
import { getBaselineHealth } from '@/utils/calculations/stats';
import { useGlobalBonuses, useCharacterCalculation, convertToLegacyStats } from '@/hooks';
import { convertGlobalBonusesToAspects, getEffectiveBuffDebuffModifier, findSelectedPowerInBuild } from '@/components/info/powerDisplayUtils';
import { STAT_DEFINITIONS } from '@/data/stat-definitions';
import type { StatValue } from '@/data/stat-definitions';

import { RegistryEffectsDisplay } from '@/components/info/SharedPowerComponents';
import { SetBonusSummary } from '@/components/enhancements/SetBonusDisplay';
import { SlottedEnhancementIcon } from '@/components/powers/SlottedEnhancementIcon';
import { resolvePath } from '@/utils/paths';
import { Modal, ModalBody } from './Modal';
import type { Enhancement, ArchetypeId, SetBonus } from '@/types';
import type { EnhancementBonuses } from '@/utils/calculations/enhancement-values';

interface ComparisonCopy {
  id: number;
  slots: (Enhancement | null)[];
}

let nextCopyId = 1;

export function CompareSlottingModal() {
  const isOpen = useUIStore((s) => s.compareSlottingOpen);
  const compareTarget = useUIStore((s) => s.compareSlottingPower);
  const closeModal = useUIStore((s) => s.closeCompareSlotting);
  const openEnhancementPicker = useUIStore((s) => s.openEnhancementPicker);

  const build = useBuildStore((s) => s.build);
  const setEnhancement = useBuildStore((s) => s.setEnhancement);
  const clearEnhancement = useBuildStore((s) => s.clearEnhancement);

  const globalBonuses = useGlobalBonuses();
  const incarnateActive = useUIStore((s) => s.incarnateActive);

  const [copies, setCopies] = useState<ComparisonCopy[]>([]);
  const [hoveredCopyId, setHoveredCopyId] = useState<number | null>(null);
  const [appliedCopyId, setAppliedCopyId] = useState<number | null>(null);

  // Resolve the power definition
  const lookupResult = useMemo(() => {
    if (!compareTarget) return null;
    return lookupPower(compareTarget.powerSet, compareTarget.powerName) ?? null;
  }, [compareTarget]);
  const power = lookupResult?.power ?? null;

  // Find the current build slotting
  const selectedPower = useMemo(() => {
    if (!compareTarget) return null;
    return findSelectedPowerInBuild(compareTarget.powerName, build);
  }, [compareTarget, build]);

  // Initialize copies when modal opens
  useEffect(() => {
    if (isOpen && selectedPower) {
      nextCopyId = 1;
      setCopies([{
        id: nextCopyId++,
        slots: [...selectedPower.slots],
      }]);
      setHoveredCopyId(null);
      setAppliedCopyId(null);
    }
  }, [isOpen, selectedPower?.name]); // eslint-disable-line react-hooks/exhaustive-deps

  // Computed values shared across copies
  const globalBonusesForCalc = useMemo(
    () => convertGlobalBonusesToAspects(globalBonuses),
    [globalBonuses]
  );

  const alphaBonuses = useMemo<EnhancementBonuses>(
    () => getAlphaEnhancementBonuses(build.incarnates, incarnateActive),
    [build.incarnates, incarnateActive]
  );

  const archetypeId = build.archetype.id;
  const archetype = archetypeId ? getArchetype(archetypeId as ArchetypeId) : null;
  const buffDebuffMod = archetype?.stats?.buffDebuffModifier ?? 1.0;
  const effectiveMod = compareTarget
    ? getEffectiveBuffDebuffModifier(compareTarget.powerSet, buffDebuffMod)
    : 1.0;

  // Build merged effects for RegistryEffectsDisplay
  const mergedEffects = useMemo(() => {
    if (!power || !compareTarget) return {};
    const baseEffects = power.effects;

    // Extract healing from damage field (e.g. Life Drain)
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

    return {
      ...baseEffects,
      ...(power.stats?.endurance && { enduranceCost: power.stats.endurance }),
      ...(power.stats?.recharge && { recharge: power.stats.recharge }),
      ...(power.stats?.accuracy && { accuracy: power.stats.accuracy }),
      ...(power.stats?.range && { range: power.stats.range }),
      ...(power.stats?.castTime && { castTime: power.stats.castTime }),
      ...(healFromDamage && { healing: healFromDamage }),
    };
  }, [power, compareTarget]);

  const exemplarMode = useUIStore((s) => s.exemplarMode);
  const exemplarLevel = useUIStore((s) => s.exemplarLevel);

  // Compute enhancement bonuses for a set of slots
  const computeBonuses = useCallback((slots: (Enhancement | null)[]) => {
    if (!power) return {};
    const bonuses = calculatePowerEnhancementBonuses(
      { name: power.name, slots },
      build.level,
      getIOSet,
      exemplarMode ? exemplarLevel : undefined
    );
    // Merge alpha bonuses
    for (const [aspect, value] of Object.entries(alphaBonuses)) {
      if (value !== undefined) bonuses[aspect] = (bonuses[aspect] || 0) + value;
    }
    return bonuses;
  }, [power, build.level, alphaBonuses, exemplarMode, exemplarLevel]);

  // Compute damage for a set of slots
  const computeDamage = useCallback((enhBonuses: EnhancementBonuses) => {
    if (!power?.damage || !compareTarget) return null;
    const isPrimary = compareTarget.powerSet === build.primary.id;
    const isSecondary = compareTarget.powerSet === build.secondary.id;
    const powersetCategory = isPrimary ? 'PRIMARY' : isSecondary ? 'SECONDARY' : undefined;
    return calculatePowerDamage(
      power,
      {
        level: build.level,
        archetypeId: archetypeId as ArchetypeId | undefined,
        primaryName: lookupResult?.powersetName || '',
        primaryCategory: powersetCategory,
      },
      { damage: enhBonuses.damage || 0 },
      globalBonusesForCalc.damage ?? 0,
      0
    );
  }, [power, compareTarget, build.level, archetypeId, globalBonusesForCalc.damage, build.primary.id, build.secondary.id, lookupResult]);

  // The copy being displayed in the info panel (hovered or first)
  const activeCopy = hoveredCopyId !== null
    ? copies.find(c => c.id === hoveredCopyId) ?? copies[0]
    : copies[0];

  const activeEnhBonuses = useMemo(
    () => activeCopy ? computeBonuses(activeCopy.slots) : {},
    [activeCopy, computeBonuses]
  );

  const activeDamage = useMemo(
    () => computeDamage(activeEnhBonuses),
    [computeDamage, activeEnhBonuses]
  );

  const iconSrc = power ? getPowerIconPath(power.icon) : '';

  // ============================================
  // SET BONUSES for active copy
  // ============================================
  const activeSetBonuses = useMemo(() => {
    if (!activeCopy) return [];

    // Group slotted IO-set enhancements by setId
    const setsInPower: Record<string, Set<number>> = {};
    for (const slot of activeCopy.slots) {
      if (!slot || slot.type !== 'io-set') continue;
      const { setId, pieceNum } = slot as Enhancement & { setId: string; pieceNum: number };
      if (!setsInPower[setId]) setsInPower[setId] = new Set();
      setsInPower[setId].add(pieceNum);
    }

    const results: Array<{
      setId: string;
      setName: string;
      totalPieces: number;
      slottedPieces: number;
      bonuses: SetBonus[];
    }> = [];

    for (const [setId, pieces] of Object.entries(setsInPower)) {
      const ioSet = getIOSet(setId);
      if (!ioSet) continue;
      const slottedPieces = pieces.size;
      if (slottedPieces < 2) continue; // Need at least 2 pieces for any bonus
      results.push({
        setId,
        setName: ioSet.name,
        totalPieces: ioSet.pieces.length,
        slottedPieces,
        bonuses: ioSet.bonuses,
      });
    }

    return results;
  }, [activeCopy]);

  // ============================================
  // DASHBOARD STATS: hypothetical build calculation
  // ============================================
  const statsConfig = useUIStore((s) => s.statsConfig);
  const includeProcsInStats = useUIStore((s) => s.includeProcsInStats);
  const targetsHitValues = useUIStore((s) => s.targetsHitValues);

  const currentCalcResult = useCharacterCalculation();

  const health = useMemo(
    () => getBaselineHealth(build.archetype?.id ?? undefined, build.level),
    [build.archetype?.id, build.level]
  );
  const baseHP = health.baseHealth;
  const maxHPCap = health.maxHealth;

  // Current stats in legacy format (for STAT_DEFINITIONS getValue)
  const currentLegacyStats = useMemo(
    () => convertToLegacyStats(currentCalcResult.stats, currentCalcResult),
    [currentCalcResult]
  );

  // Visible dashboard stat IDs (filtered to those that exist in STAT_DEFINITIONS)
  const visibleStatIds = useMemo(() =>
    statsConfig
      .filter((c) => c.visible && STAT_DEFINITIONS[c.stat])
      .sort((a, b) => a.order - b.order)
      .map((c) => c.stat),
    [statsConfig]
  );

  // Hypothetical stats: what happens if we apply activeCopy's slots to the build
  const hypotheticalLegacyStats = useMemo(() => {
    if (!activeCopy || !compareTarget || visibleStatIds.length === 0) return null;

    // Clone the build with the target power's slots replaced
    const replacePower = <T extends { name: string; slots: (Enhancement | null)[] }>(p: T): T =>
      p.name === compareTarget.powerName ? { ...p, slots: [...activeCopy.slots] } : p;

    const hypoBuild = {
      ...build,
      primary: { ...build.primary, powers: build.primary.powers.map(replacePower) },
      secondary: { ...build.secondary, powers: build.secondary.powers.map(replacePower) },
      pools: build.pools.map(pool => ({ ...pool, powers: pool.powers.map(replacePower) })),
      epicPool: build.epicPool
        ? { ...build.epicPool, powers: build.epicPool.powers.map(replacePower) }
        : null,
      inherents: build.inherents.map(replacePower),
      sets: {} as typeof build.sets, // placeholder, computed below
    };
    hypoBuild.sets = computeSetTracking(hypoBuild);

    const hypoResult = calculateCharacterTotals(hypoBuild, exemplarMode, incarnateActive, {
      includeProcs: includeProcsInStats,
      targetsHitValues,
    });

    return convertToLegacyStats(hypoResult.stats, hypoResult);
  }, [activeCopy, compareTarget, visibleStatIds.length, build, exemplarMode, incarnateActive, includeProcsInStats, targetsHitValues]);

  // Helper: extract numeric value from a StatValue for delta computation
  const getNumericValue = useCallback((v: StatValue): number => {
    if (typeof v === 'number') return v;
    if (typeof v === 'string') return parseFloat(v) || 0;
    if (typeof v === 'object' && v !== null) {
      if ('protection' in v) return v.protection; // MezStatValue: compare protection
      if ('buff' in v) return v.buff; // CompoundStatValue: compare buff %
    }
    return 0;
  }, []);

  // Handler: open picker for a comparison copy slot
  const handleSlotClick = useCallback((copyId: number, slotIndex: number) => {
    if (!compareTarget) return;
    const copy = copies.find(c => c.id === copyId);
    if (!copy) return;
    const overrideHandler = (si: number, enhancement: Enhancement) => {
      setCopies(prev => prev.map(c =>
        c.id === copyId
          ? { ...c, slots: c.slots.map((s, i) => i === si ? enhancement : s) }
          : c
      ));
    };
    openEnhancementPicker(compareTarget.powerName, compareTarget.powerSet, slotIndex, overrideHandler, copy.slots);
  }, [compareTarget, copies, openEnhancementPicker]);

  // Handler: clear enhancement from a comparison copy slot
  const handleClearSlot = useCallback((copyId: number, slotIndex: number) => {
    setCopies(prev => prev.map(c =>
      c.id === copyId
        ? { ...c, slots: c.slots.map((s, i) => i === slotIndex ? null : s) }
        : c
    ));
  }, []);

  // Handler: add new empty copy
  const handleAddCopy = useCallback(() => {
    if (!selectedPower) return;
    setCopies(prev => [...prev, {
      id: nextCopyId++,
      slots: new Array(selectedPower.slots.length).fill(null),
    }]);
  }, [selectedPower]);

  // Handler: duplicate a copy
  const handleDuplicateCopy = useCallback((copyId: number) => {
    setCopies(prev => {
      const source = prev.find(c => c.id === copyId);
      if (!source) return prev;
      const idx = prev.indexOf(source);
      const newCopy = { id: nextCopyId++, slots: [...source.slots] };
      const next = [...prev];
      next.splice(idx + 1, 0, newCopy);
      return next;
    });
  }, []);

  // Handler: remove a copy
  const handleRemoveCopy = useCallback((copyId: number) => {
    setCopies(prev => prev.filter(c => c.id !== copyId));
  }, []);

  // Handler: apply a copy's slotting to the actual build
  const handleApply = useCallback((copyId: number) => {
    if (!compareTarget) return;
    const copy = copies.find(c => c.id === copyId);
    if (!copy) return;

    // Clear all slots then set the copy's enhancements
    const numSlots = copy.slots.length;
    for (let i = 0; i < numSlots; i++) {
      clearEnhancement(compareTarget.powerName, i);
    }
    copy.slots.forEach((enh, i) => {
      if (enh) setEnhancement(compareTarget.powerName, i, enh);
    });

    // Flash feedback
    setAppliedCopyId(copyId);
    setTimeout(() => setAppliedCopyId(null), 1200);
  }, [compareTarget, copies, setEnhancement, clearEnhancement]);

  if (!isOpen || !compareTarget || !power) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={`Compare Slotting: ${compareTarget.powerName}`}
      size="full"
    >
      <ModalBody>
        <div className="flex flex-col md:flex-row gap-4 min-h-0 md:min-h-[400px]">
          {/* Stats panel - shown first on mobile (top), right side on desktop */}
          <div className="w-full md:w-[320px] flex-shrink-0 overflow-y-auto max-h-[40vh] md:max-h-none md:h-[70vh] bg-slate-900/50 rounded-lg border border-slate-700 p-3 order-1 md:order-2">
            <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">
              {hoveredCopyId !== null
                ? `Showing: ${copies.findIndex(c => c.id === hoveredCopyId) === 0 ? 'Current' : `Copy ${copies.findIndex(c => c.id === hoveredCopyId)}`}`
                : 'Showing: Current'
              }
            </div>
            <RegistryEffectsDisplay
              effects={mergedEffects}
              allowedEnhancements={power.allowedEnhancements}
              enhancementBonuses={activeEnhBonuses}
              globalBonuses={globalBonusesForCalc}
              buffDebuffMod={effectiveMod}
              archetypeId={archetypeId ?? undefined}
              level={build.level}
              categories={['execution', 'buff', 'debuff', 'control', 'protection', 'movement']}
              damage={activeDamage}
              duration={mergedEffects?.buffDuration as number | undefined}
            />

            {/* Dashboard Stats Impact section */}
            {visibleStatIds.length > 0 && hypotheticalLegacyStats && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                  Stats Impact
                </div>
                <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] gap-x-2 gap-y-0.5 items-center tabular-nums text-[10px]">
                  {visibleStatIds.map((statId) => {
                    const def = STAT_DEFINITIONS[statId];
                    if (!def) return null;

                    const currentValue = def.getValue(currentLegacyStats, baseHP, maxHPCap);
                    const hypoValue = def.getValue(hypotheticalLegacyStats, baseHP, maxHPCap);
                    const currentNum = getNumericValue(currentValue);
                    const hypoNum = getNumericValue(hypoValue);
                    const delta = hypoNum - currentNum;

                    return (
                      <React.Fragment key={statId}>
                        <span className="text-slate-400 text-xs">{def.label}</span>
                        <span className="text-slate-500 text-right">{def.format(currentValue)}</span>
                        <span className="text-slate-600">&rarr;</span>
                        <span className="text-slate-200 text-right">{def.format(hypoValue)}</span>
                        <span className={`text-right font-medium ${
                          Math.abs(delta) < 0.005 ? 'text-slate-600' :
                          delta > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {Math.abs(delta) < 0.005 ? '—' : `${delta > 0 ? '+' : ''}${delta.toFixed(2)}`}
                        </span>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Set Bonuses section */}
            {activeSetBonuses.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">
                  Set Bonuses
                </div>
                <div className="space-y-2">
                  {activeSetBonuses.map((item) => (
                    <SetBonusSummary
                      key={item.setId}
                      setId={item.setId}
                      setName={item.setName}
                      totalPieces={item.totalPieces}
                      slottedPieces={item.slottedPieces}
                      bonuses={item.bonuses}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comparison copies panel - below stats on mobile, left side on desktop */}
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[50vh] md:max-h-[70vh] pr-1 order-2 md:order-1">
            {copies.map((copy, idx) => (
              <div
                key={copy.id}
                className={`
                  rounded-lg border p-3 cursor-pointer transition-all
                  ${hoveredCopyId === copy.id
                    ? 'border-blue-500 bg-slate-700/50'
                    : appliedCopyId === copy.id
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                  }
                `}
                onMouseEnter={() => setHoveredCopyId(copy.id)}
                onMouseLeave={() => setHoveredCopyId(null)}
              >
                {/* Copy header */}
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={iconSrc}
                    alt=""
                    className="w-5 h-5 rounded-sm flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
                    }}
                  />
                  <span className="text-xs text-slate-300 font-medium flex-1">
                    {idx === 0 ? 'Current' : `Copy ${idx}`}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDuplicateCopy(copy.id); }}
                      className="text-[10px] px-1.5 py-0.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-600"
                      title="Duplicate this configuration"
                    >
                      Copy
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleApply(copy.id); }}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 hover:text-blue-200"
                      title="Apply this slotting to your build"
                    >
                      Apply
                    </button>
                    {copies.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveCopy(copy.id); }}
                        className="text-[10px] px-1 py-0.5 rounded text-slate-500 hover:text-red-400 hover:bg-slate-600"
                        title="Remove this copy"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Enhancement slots */}
                <div className="flex gap-1.5 items-center">
                  {copy.slots.map((slot, slotIdx) => (
                    <div
                      key={slotIdx}
                      className={`
                        w-8 h-8 flex-shrink-0 rounded-full border flex items-center justify-center
                        cursor-pointer transition-transform hover:scale-110
                        ${slot
                          ? 'border-transparent bg-transparent'
                          : 'border-slate-600 bg-slate-700/50 text-slate-500 hover:border-blue-500 hover:bg-slate-600'
                        }
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSlotClick(copy.id, slotIdx);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (slot) handleClearSlot(copy.id, slotIdx);
                      }}
                      title={slot ? `${slot.name} - right-click to remove` : `Empty slot ${slotIdx + 1} - click to add`}
                    >
                      {slot ? (
                        <SlottedEnhancementIcon enhancement={slot} size={32} />
                      ) : (
                        <span className="text-slate-400 text-xs">+</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Add copy button */}
            <button
              onClick={handleAddCopy}
              className="w-full rounded-lg border border-dashed border-slate-600 p-3 text-slate-500 hover:text-slate-300 hover:border-slate-400 transition-colors flex items-center justify-center gap-1"
            >
              <span className="text-lg">+</span>
              <span className="text-xs">Add Configuration</span>
            </button>
          </div>

        </div>
      </ModalBody>
    </Modal>
  );
}
