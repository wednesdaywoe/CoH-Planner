/**
 * PoolPowers component - displays power pool selection, selected pool powers, and inherent powers
 * Renders inline within the Pool Powers column (column headers are in PlannerPage)
 */

import { useMemo, useState } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import {
  getAllPowerPools,
  getPowerPool,
  getPowerIconPath,
  getEpicPoolsForArchetype,
  getEpicPool,
  getEpicPoolPowerIconPath,
  EPIC_POOL_LEVEL,
} from '@/data';
import { resolvePath } from '@/utils/paths';
import { Select } from '@/components/ui';
import { DraggableSlotGhost } from './DraggableSlotGhost';
import { SlottedEnhancementIcon } from './SlottedEnhancementIcon';
import type { Power, SelectedPower } from '@/types';

/** Get the icon path for an inherent power based on its category */
function getInherentIconPath(power: SelectedPower): string {
  const category = power.inherentCategory || 'basic';

  switch (category) {
    case 'fitness':
      return resolvePath(`/img/Powers/Fitness Powers Icons/${power.icon}`);
    case 'prestige':
      return resolvePath(`/img/Powers/Inherent Powers Icons/${power.icon}`);
    case 'archetype':
      // Archetype inherents use Inherent Powers Icons folder
      return resolvePath(`/img/Powers/Inherent Powers Icons/${power.icon}`);
    case 'basic':
    default:
      return resolvePath(`/img/Powers/Inherent Powers Icons/${power.icon}`);
  }
}

export function PoolPowers() {
  const build = useBuildStore((s) => s.build);
  const addPool = useBuildStore((s) => s.addPool);
  const removePool = useBuildStore((s) => s.removePool);
  const addPower = useBuildStore((s) => s.addPower);
  const removePower = useBuildStore((s) => s.removePower);
  const addSlot = useBuildStore((s) => s.addSlot);
  const removeSlot = useBuildStore((s) => s.removeSlot);
  const clearEnhancement = useBuildStore((s) => s.clearEnhancement);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);
  const clearInfoPanel = useUIStore((s) => s.clearInfoPanel);
  const lockInfoPanel = useUIStore((s) => s.lockInfoPanel);
  const unlockInfoPanel = useUIStore((s) => s.unlockInfoPanel);
  const infoPanelLocked = useUIStore((s) => s.infoPanel.locked);
  const lockedContent = useUIStore((s) => s.infoPanel.lockedContent);

  const pools = build.pools;
  const canAddPool = pools.length < 4;

  // Get all available pools
  const allPools = getAllPowerPools();
  const selectedPoolIds = new Set(pools.map((p) => p.id));
  const availablePoolOptions = Object.entries(allPools)
    .filter(([id]) => !selectedPoolIds.has(id))
    .map(([id, pool]) => ({ value: id, label: pool.name }));

  const handleAddPool = (poolId: string) => {
    if (poolId) {
      addPool(poolId);
    }
  };

  const handleRemovePool = (poolId: string) => {
    removePool(poolId);
  };

  const handleSelectPower = (poolId: string, power: Power) => {
    addPower('pool', {
      ...power,
      powerSet: poolId,
      level: build.level,
      slots: [null],
    });
  };

  const handleRemovePower = (powerName: string) => {
    removePower('pool', powerName);
  };

  const handleAddSlots = (powerName: string, count: number) => {
    for (let i = 0; i < count; i++) {
      addSlot(powerName);
    }
  };

  const handleRemoveSlot = (powerName: string, slotIndex: number) => {
    removeSlot(powerName, slotIndex);
  };

  const handlePowerHover = (power: Power | SelectedPower, poolId: string) => {
    // Always update hover content - tooltip uses this even when panel is locked
    setInfoPanelContent({
      type: 'power',
      powerName: power.name,
      powerSet: poolId,
    });
  };

  const handlePowerLeave = () => {
    // Clear content when leaving power area - hides the tooltip
    clearInfoPanel();
  };

  const handleEnhancementHover = (powerName: string, slotIndex: number) => {
    // Show enhancement info in tooltip
    setInfoPanelContent({
      type: 'slotted-enhancement',
      powerName,
      slotIndex,
    });
  };

  const handleClearEnhancement = (powerName: string, slotIndex: number) => {
    clearEnhancement(powerName, slotIndex);
  };

  const handlePowerRightClick = (e: React.MouseEvent, power: Power | SelectedPower, poolId: string) => {
    e.preventDefault();
    // If already locked to this power, unlock; otherwise lock to this power
    if (infoPanelLocked && lockedContent?.type === 'power' && lockedContent.powerName === power.name) {
      unlockInfoPanel();
    } else {
      lockInfoPanel({
        type: 'power',
        powerName: power.name,
        powerSet: poolId,
      });
    }
  };

  // Helper to check if a power is the currently locked one
  const isPowerLocked = (powerName: string) => {
    return infoPanelLocked && lockedContent?.type === 'power' && lockedContent.powerName === powerName;
  };

  // Group inherent powers by category
  const inherentGroups = useMemo(() => {
    const groups: Record<string, SelectedPower[]> = {
      fitness: [],
      basic: [],
      prestige: [],
      archetype: [],
    };

    for (const power of build.inherents) {
      const category = power.inherentCategory || 'basic';
      if (groups[category]) {
        groups[category].push(power);
      }
    }

    return groups;
  }, [build.inherents]);

  // Handler for inherent power hover - uses 'Inherent' as powerSet
  const handleInherentPowerHover = (power: SelectedPower) => {
    setInfoPanelContent({
      type: 'power',
      powerName: power.name,
      powerSet: 'Inherent',
    });
  };

  const handleInherentPowerRightClick = (e: React.MouseEvent, power: SelectedPower) => {
    e.preventDefault();
    if (infoPanelLocked && lockedContent?.type === 'power' && lockedContent.powerName === power.name) {
      unlockInfoPanel();
    } else {
      lockInfoPanel({
        type: 'power',
        powerName: power.name,
        powerSet: 'Inherent',
      });
    }
  };

  return (
    <div className="space-y-2">
      {/* Add pool selector */}
      {canAddPool && availablePoolOptions.length > 0 && (
        <Select
          id="add-pool-select"
          name="add-pool"
          options={[{ value: '', label: 'Add Pool...' }, ...availablePoolOptions]}
          value=""
          onChange={(e) => handleAddPool(e.target.value)}
          className="w-full text-xs"
        />
      )}

      {/* Empty state - only show if no pools AND no inherents */}
      {pools.length === 0 && build.inherents.length === 0 && (
        <div className="text-xs text-slate-500 italic py-4 text-center">
          No power pools selected
        </div>
      )}

      {/* Pool sections */}
      {pools.map((poolSelection) => {
        const pool = getPowerPool(poolSelection.id);
        if (!pool) return null;

        const selectedPowerNames = new Set(poolSelection.powers.map((p) => p.name));
        // available is 0-indexed: available=0 means level 1
        const availablePowers = pool.powers.filter(
          (p) => p.available >= 0 && p.available < build.level && !selectedPowerNames.has(p.name)
        );

        return (
          <PoolPowerGroup
            key={poolSelection.id}
            poolId={poolSelection.id}
            poolName={pool.name}
            selectedPowers={poolSelection.powers}
            availablePowers={availablePowers}
            isPowerLocked={isPowerLocked}
            onRemovePool={() => handleRemovePool(poolSelection.id)}
            onSelectPower={(power) => handleSelectPower(poolSelection.id, power)}
            onRemovePower={handleRemovePower}
            onPowerHover={(power) => handlePowerHover(power, poolSelection.id)}
            onPowerLeave={handlePowerLeave}
            onPowerRightClick={(e, power) => handlePowerRightClick(e, power, poolSelection.id)}
            onEnhancementHover={handleEnhancementHover}
            onClearEnhancement={handleClearEnhancement}
            onAddSlots={handleAddSlots}
            onRemoveSlot={handleRemoveSlot}
          />
        );
      })}

      {/* Epic/Patron Pool Section */}
      <EpicPoolSection
        level={build.level}
        archetypeId={build.archetype.id}
        epicPool={build.epicPool}
      />

      {/* Inherent Powers - displayed below selected pools */}
      {build.inherents.length > 0 && (
        <>
          {/* Fitness Pool */}
          {inherentGroups.fitness.length > 0 && (
            <InherentPowerGroup
              title="Fitness"
              powers={inherentGroups.fitness}
              isPowerLocked={isPowerLocked}
              onPowerHover={handleInherentPowerHover}
              onPowerLeave={handlePowerLeave}
              onPowerRightClick={handleInherentPowerRightClick}
              onEnhancementHover={handleEnhancementHover}
              onClearEnhancement={handleClearEnhancement}
              onAddSlots={handleAddSlots}
              onRemoveSlot={handleRemoveSlot}
            />
          )}

          {/* Basic Inherents (Brawl, Sprint, Rest) */}
          {inherentGroups.basic.length > 0 && (
            <InherentPowerGroup
              title="Basic"
              powers={inherentGroups.basic}
              isPowerLocked={isPowerLocked}
              onPowerHover={handleInherentPowerHover}
              onPowerLeave={handlePowerLeave}
              onPowerRightClick={handleInherentPowerRightClick}
              onEnhancementHover={handleEnhancementHover}
              onClearEnhancement={handleClearEnhancement}
              onAddSlots={handleAddSlots}
              onRemoveSlot={handleRemoveSlot}
            />
          )}

          {/* Prestige Sprints */}
          {inherentGroups.prestige.length > 0 && (
            <InherentPowerGroup
              title="Prestige Sprints"
              powers={inherentGroups.prestige}
              isPowerLocked={isPowerLocked}
              onPowerHover={handleInherentPowerHover}
              onPowerLeave={handlePowerLeave}
              onPowerRightClick={handleInherentPowerRightClick}
              onEnhancementHover={handleEnhancementHover}
              onClearEnhancement={handleClearEnhancement}
              onAddSlots={handleAddSlots}
              onRemoveSlot={handleRemoveSlot}
            />
          )}

          {/* Archetype Inherent */}
          {inherentGroups.archetype.length > 0 && (
            <InherentPowerGroup
              title={`${build.archetype.name || 'Archetype'} Inherent`}
              powers={inherentGroups.archetype}
              isPowerLocked={isPowerLocked}
              onPowerHover={handleInherentPowerHover}
              onPowerLeave={handlePowerLeave}
              onPowerRightClick={handleInherentPowerRightClick}
              onEnhancementHover={handleEnhancementHover}
              onClearEnhancement={handleClearEnhancement}
              onAddSlots={handleAddSlots}
              onRemoveSlot={handleRemoveSlot}
            />
          )}
        </>
      )}
    </div>
  );
}

// ============================================
// POOL POWER GROUP COMPONENT
// ============================================

interface PoolPowerGroupProps {
  poolId: string;
  poolName: string;
  selectedPowers: SelectedPower[];
  availablePowers: Power[];
  isPowerLocked: (powerName: string) => boolean;
  onRemovePool: () => void;
  onSelectPower: (power: Power) => void;
  onRemovePower: (powerName: string) => void;
  onPowerHover: (power: Power | SelectedPower) => void;
  onPowerLeave: () => void;
  onPowerRightClick: (e: React.MouseEvent, power: Power | SelectedPower) => void;
  onEnhancementHover: (powerName: string, slotIndex: number) => void;
  onClearEnhancement: (powerName: string, slotIndex: number) => void;
  onAddSlots: (powerName: string, count: number) => void;
  onRemoveSlot: (powerName: string, slotIndex: number) => void;
}

function PoolPowerGroup({
  poolId,
  poolName,
  selectedPowers,
  availablePowers,
  isPowerLocked,
  onRemovePool,
  onSelectPower,
  onRemovePower,
  onPowerHover,
  onPowerLeave,
  onPowerRightClick,
  onEnhancementHover,
  onClearEnhancement,
  onAddSlots,
  onRemoveSlot,
}: PoolPowerGroupProps) {
  const [collapsed, setCollapsed] = useState(false);
  const openEnhancementPicker = useUIStore((s) => s.openEnhancementPicker);

  return (
    <div className="bg-slate-800/50 rounded p-1.5 border border-slate-700/50">
      {/* Pool header - clickable to collapse */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-1">
          <span className={`text-[10px] text-slate-500 transition-transform ${collapsed ? '' : 'rotate-90'}`}>
            ▶
          </span>
          <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
            {poolName}
          </h4>
          <span className="text-[9px] text-slate-600">({selectedPowers.length})</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemovePool();
          }}
          className="text-xs text-slate-500 hover:text-slate-300"
          title="Remove pool"
        >
          ✕
        </button>
      </div>

      {/* Collapsible content */}
      {!collapsed && (
        <div className="mt-1">
          {/* Selected powers */}
          {selectedPowers.length > 0 && (
            <div className="space-y-0.5 mb-1">
              {selectedPowers.map((power) => {
                const isLocked = isPowerLocked(power.name);
                return (
                  <div
                    key={power.name}
                    className={`flex items-center gap-1 px-1 py-0.5 bg-slate-800 border rounded-sm group transition-colors ${
                      isLocked
                        ? 'border-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.4)] bg-gradient-to-r from-amber-500/10 to-slate-800'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                    onMouseLeave={onPowerLeave}
                  >
                    {/* Power icon and name */}
                    <div
                      className="flex items-center gap-1 flex-1 min-w-0 cursor-default"
                      onMouseEnter={() => onPowerHover(power)}
                      onContextMenu={(e) => onPowerRightClick(e, power)}
                      title={isLocked ? 'Right-click to unlock power info' : 'Right-click to lock power info'}
                    >
                      <img
                        src={getPowerIconPath(poolName, power.icon)}
                        alt=""
                        className="w-4 h-4 rounded-sm flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
                        }}
                      />
                      <span className="text-xs text-slate-200 truncate">
                        {power.name}
                      </span>
                    </div>
                    {/* Enhancement slots - fixed width container to prevent layout shift */}
                    <div className="flex gap-px justify-start items-center flex-shrink-0" style={{ width: '120px' }}>
                      {power.slots.map((slot, index) => (
                        <div
                          key={index}
                          onClick={() => openEnhancementPicker(power.name, poolId, index)}
                          onMouseEnter={() =>
                            slot ? onEnhancementHover(power.name, index) : onPowerHover(power)
                          }
                          onContextMenu={(e) => {
                            e.preventDefault();
                            if (slot) {
                              onClearEnhancement(power.name, index);
                            } else if (index > 0) {
                              onRemoveSlot(power.name, index);
                            }
                          }}
                          className={`
                            w-4 h-4 rounded-full border flex items-center justify-center
                            text-[7px] font-semibold cursor-pointer hover:scale-110 transition-transform
                            ${
                              slot
                                ? 'border-transparent'
                                : 'border-slate-600 bg-slate-700/50 text-slate-500 hover:border-blue-500'
                            }
                          `}
                          title={
                            slot
                              ? `${slot.name || 'Enhancement'} (right-click to remove enhancement)`
                              : `Empty slot${index > 0 ? ' (right-click to remove slot)' : ''}`
                          }
                        >
                          {slot ? (
                            <SlottedEnhancementIcon enhancement={slot} size={16} />
                          ) : (
                            '+'
                          )}
                        </div>
                      ))}
                      {/* Draggable ghost slot to add more */}
                      <DraggableSlotGhost
                        powerName={power.name}
                        currentSlots={power.slots.length}
                        maxSlots={power.maxSlots}
                        onAddSlots={(count) => onAddSlots(power.name, count)}
                      />
                    </div>
                    <button
                      onClick={() => onRemovePower(power.name)}
                      className="text-slate-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity px-0.5"
                      title="Remove power"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Available powers */}
          {availablePowers.length > 0 && (
            <div className="border-t border-slate-700 pt-1 mt-1">
              <div className="flex flex-wrap gap-0.5">
                {availablePowers.map((power) => (
                  <button
                    key={power.name}
                    onClick={() => onSelectPower(power)}
                    onMouseEnter={() => onPowerHover(power)}
                    onContextMenu={(e) => onPowerRightClick(e, power)}
                    className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-700 border border-slate-600 rounded-sm text-[10px] text-slate-300 hover:border-blue-500 hover:bg-slate-600 transition-colors"
                    title="Right-click to lock power info"
                  >
                    <img
                      src={getPowerIconPath(poolName, power.icon)}
                      alt=""
                      className="w-3 h-3 rounded-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
                      }}
                    />
                    {power.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// INHERENT POWER GROUP COMPONENT
// ============================================

interface InherentPowerGroupProps {
  title: string;
  powers: SelectedPower[];
  isPowerLocked: (powerName: string) => boolean;
  onPowerHover: (power: SelectedPower) => void;
  onPowerLeave: () => void;
  onPowerRightClick: (e: React.MouseEvent, power: SelectedPower) => void;
  onEnhancementHover: (powerName: string, slotIndex: number) => void;
  onClearEnhancement: (powerName: string, slotIndex: number) => void;
  onAddSlots: (powerName: string, count: number) => void;
  onRemoveSlot: (powerName: string, slotIndex: number) => void;
  defaultCollapsed?: boolean;
}

function InherentPowerGroup({
  title,
  powers,
  isPowerLocked,
  onPowerHover,
  onPowerLeave,
  onPowerRightClick,
  onEnhancementHover,
  onClearEnhancement,
  onAddSlots,
  onRemoveSlot,
  defaultCollapsed = false,
}: InherentPowerGroupProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const openEnhancementPicker = useUIStore((s) => s.openEnhancementPicker);

  return (
    <div className="bg-slate-800/30 rounded p-1.5 border border-slate-700/50">
      {/* Group header - clickable to collapse */}
      <div
        className="flex items-center gap-1 cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className={`text-[10px] text-slate-500 transition-transform ${collapsed ? '' : 'rotate-90'}`}>
          ▶
        </span>
        <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
          {title}
        </h4>
        <span className="text-[9px] text-slate-600">({powers.length})</span>
      </div>

      {/* Collapsible powers list */}
      {!collapsed && (
        <div className="space-y-0.5 mt-1">
          {powers.map((power) => {
            const isLocked = isPowerLocked(power.name);
            const hasSlots = power.slots.length > 0;
            const canAddMoreSlots = power.maxSlots > power.slots.length;

            return (
              <div
                key={power.name}
                className={`flex items-center gap-1 px-1 py-0.5 bg-slate-800/50 border rounded-sm transition-colors ${
                  isLocked
                    ? 'border-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.4)] bg-gradient-to-r from-amber-500/10 to-slate-800/50'
                    : 'border-slate-700/50 hover:border-slate-600'
                }`}
                onMouseLeave={onPowerLeave}
              >
                {/* Power icon and name */}
                <div
                  className="flex items-center gap-1 flex-1 min-w-0 cursor-default"
                  onMouseEnter={() => onPowerHover(power)}
                  onContextMenu={(e) => onPowerRightClick(e, power)}
                  title={isLocked ? 'Right-click to unlock power info' : 'Right-click to lock power info'}
                >
                  <img
                    src={getInherentIconPath(power)}
                    alt=""
                    className="w-4 h-4 rounded-sm flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
                    }}
                  />
                  <span className="text-xs text-slate-400 truncate">
                    {power.name}
                  </span>
                  {/* Auto indicator for auto powers */}
                  {power.powerType === 'Auto' && (
                    <span className="text-[8px] text-slate-600 uppercase">(Auto)</span>
                  )}
                </div>

                {/* Enhancement slots - show if power has slots OR can have slots */}
                {(hasSlots || power.maxSlots > 0) && (
                  <div className="flex gap-px">
                    {power.slots.map((slot, index) => (
                      <div
                        key={index}
                        onClick={() => openEnhancementPicker(power.name, 'Inherent', index)}
                        onMouseEnter={() =>
                          slot ? onEnhancementHover(power.name, index) : onPowerHover(power)
                        }
                        onContextMenu={(e) => {
                          e.preventDefault();
                          if (slot) {
                            onClearEnhancement(power.name, index);
                          } else if (index > 0) {
                            onRemoveSlot(power.name, index);
                          }
                        }}
                        className={`
                          w-4 h-4 rounded-full border flex items-center justify-center
                          text-[7px] font-semibold cursor-pointer hover:scale-110 transition-transform
                          ${
                            slot
                              ? 'border-transparent'
                              : 'border-slate-600 bg-slate-700/50 text-slate-500 hover:border-blue-500'
                          }
                        `}
                        title={
                          slot
                            ? `${slot.name || 'Enhancement'} (right-click to remove enhancement)`
                            : `Empty slot${index > 0 ? ' (right-click to remove slot)' : ''}`
                        }
                      >
                        {slot ? (
                          <SlottedEnhancementIcon enhancement={slot} size={16} />
                        ) : (
                          '+'
                        )}
                      </div>
                    ))}
                    {/* Draggable ghost slot to add more */}
                    {canAddMoreSlots && (
                      <DraggableSlotGhost
                        powerName={power.name}
                        currentSlots={power.slots.length}
                        maxSlots={power.maxSlots}
                        onAddSlots={(count) => onAddSlots(power.name, count)}
                      />
                    )}
                  </div>
                )}

                {/* No slots indicator for archetype inherents */}
                {!hasSlots && power.maxSlots === 0 && (
                  <span className="text-[8px] text-slate-600 italic">No slots</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// EPIC POOL SECTION COMPONENT
// ============================================

interface EpicPoolSectionProps {
  level: number;
  archetypeId: string | null;
  epicPool: { id: string; name: string; powers: SelectedPower[] } | null;
}

function EpicPoolSection({ level, archetypeId, epicPool }: EpicPoolSectionProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Store actions
  const setEpicPool = useBuildStore((s) => s.setEpicPool);
  const addPower = useBuildStore((s) => s.addPower);
  const removePower = useBuildStore((s) => s.removePower);
  const addSlot = useBuildStore((s) => s.addSlot);
  const removeSlot = useBuildStore((s) => s.removeSlot);
  const clearEnhancement = useBuildStore((s) => s.clearEnhancement);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);
  const clearInfoPanel = useUIStore((s) => s.clearInfoPanel);
  const lockInfoPanel = useUIStore((s) => s.lockInfoPanel);
  const unlockInfoPanel = useUIStore((s) => s.unlockInfoPanel);
  const infoPanelLocked = useUIStore((s) => s.infoPanel.locked);
  const lockedContent = useUIStore((s) => s.infoPanel.lockedContent);
  const openEnhancementPicker = useUIStore((s) => s.openEnhancementPicker);

  // Check if epic pools are unlocked
  const isUnlocked = level >= EPIC_POOL_LEVEL;

  // Get available epic pools for this archetype from the data registry
  const availableEpicPoolData = useMemo(() => {
    if (!archetypeId) return [];
    return getEpicPoolsForArchetype(archetypeId);
  }, [archetypeId]);

  // Get the currently selected epic pool data
  const selectedPoolData = useMemo(() => {
    if (!epicPool?.id) return null;
    return getEpicPool(epicPool.id);
  }, [epicPool?.id]);

  // Get available powers from the selected epic pool
  const availablePowers = useMemo(() => {
    if (!selectedPoolData) return [];
    const selectedPowerNames = new Set(epicPool?.powers.map((p) => p.name) || []);
    // Filter by level (available is 0-indexed, so available=34 means level 35)
    return selectedPoolData.powers.filter(
      (p) => p.available < level && !selectedPowerNames.has(p.name)
    );
  }, [selectedPoolData, epicPool?.powers, level]);

  // Handlers
  const handleSelectPool = (poolId: string) => {
    if (poolId) {
      setEpicPool(poolId);
    }
  };

  const handleRemovePool = () => {
    setEpicPool(null);
  };

  const handleSelectPower = (power: Power) => {
    if (!epicPool) return;
    addPower('epic', {
      ...power,
      powerSet: epicPool.id,
      level: level,
      slots: [null],
    });
  };

  const handleRemovePower = (powerName: string) => {
    removePower('epic', powerName);
  };

  const handlePowerHover = (power: Power | SelectedPower) => {
    if (!epicPool) return;
    setInfoPanelContent({
      type: 'power',
      powerName: power.name,
      powerSet: epicPool.id,
    });
  };

  const handlePowerLeave = () => {
    clearInfoPanel();
  };

  const handlePowerRightClick = (e: React.MouseEvent, power: Power | SelectedPower) => {
    e.preventDefault();
    if (!epicPool) return;
    if (infoPanelLocked && lockedContent?.type === 'power' && lockedContent.powerName === power.name) {
      unlockInfoPanel();
    } else {
      lockInfoPanel({
        type: 'power',
        powerName: power.name,
        powerSet: epicPool.id,
      });
    }
  };

  const handleEnhancementHover = (powerName: string, slotIndex: number) => {
    setInfoPanelContent({
      type: 'slotted-enhancement',
      powerName,
      slotIndex,
    });
  };

  const handleClearEnhancement = (powerName: string, slotIndex: number) => {
    clearEnhancement(powerName, slotIndex);
  };

  const handleAddSlots = (powerName: string, count: number) => {
    for (let i = 0; i < count; i++) {
      addSlot(powerName);
    }
  };

  const handleRemoveSlot = (powerName: string, slotIndex: number) => {
    removeSlot(powerName, slotIndex);
  };

  const isPowerLocked = (powerName: string) => {
    return infoPanelLocked && lockedContent?.type === 'power' && lockedContent.powerName === powerName;
  };

  // Get icon path for epic pool power
  const getEpicPowerIcon = (power: Power | SelectedPower) => {
    if (!selectedPoolData) return resolvePath('/img/Unknown.png');
    return getEpicPoolPowerIconPath(selectedPoolData.name, power.icon);
  };

  // Don't show if no archetype selected
  if (!archetypeId) return null;

  // Build pool options for dropdown
  const poolOptions = [
    { value: '', label: 'Select Epic/Patron Pool...' },
    ...availableEpicPoolData.map((pool) => ({
      value: pool.id,
      label: pool.displayName || pool.name,
    })),
  ];

  return (
    <div className="bg-slate-800/50 rounded p-1.5 border border-purple-700/50">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-1">
          <span className={`text-[10px] text-slate-500 transition-transform ${collapsed ? '' : 'rotate-90'}`}>
            ▶
          </span>
          <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
            {epicPool ? epicPool.name : 'Epic/Patron Pool'}
          </h4>
          {epicPool && (
            <span className="text-[9px] text-slate-600">({epicPool.powers.length})</span>
          )}
          {!isUnlocked && (
            <span className="text-[9px] text-slate-600">(Lvl {EPIC_POOL_LEVEL})</span>
          )}
        </div>
        {epicPool && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemovePool();
            }}
            className="text-xs text-slate-500 hover:text-slate-300"
            title="Remove epic pool"
          >
            ✕
          </button>
        )}
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="mt-1">
          {!isUnlocked ? (
            <div className="text-[10px] text-slate-500 italic px-1">
              Epic/Patron pools unlock at level {EPIC_POOL_LEVEL}. You are currently level {level}.
            </div>
          ) : !epicPool ? (
            // Show pool selector
            <Select
              id="epic-pool-select"
              name="epic-pool"
              options={poolOptions}
              value=""
              onChange={(e) => handleSelectPool(e.target.value)}
              className="w-full text-xs"
            />
          ) : (
            // Show selected pool powers
            <div className="space-y-1">
              {/* Selected powers */}
              {epicPool.powers.length > 0 && (
                <div className="space-y-0.5">
                  {epicPool.powers.map((power) => {
                    const isLocked = isPowerLocked(power.name);
                    return (
                      <div
                        key={power.name}
                        className={`flex items-center gap-1 px-1 py-0.5 bg-slate-800 border rounded-sm group transition-colors ${
                          isLocked
                            ? 'border-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.4)] bg-gradient-to-r from-amber-500/10 to-slate-800'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                        onMouseLeave={handlePowerLeave}
                      >
                        {/* Power icon and name */}
                        <div
                          className="flex items-center gap-1 flex-1 min-w-0 cursor-default"
                          onMouseEnter={() => handlePowerHover(power)}
                          onContextMenu={(e) => handlePowerRightClick(e, power)}
                          title={isLocked ? 'Right-click to unlock power info' : 'Right-click to lock power info'}
                        >
                          <img
                            src={getEpicPowerIcon(power)}
                            alt=""
                            className="w-4 h-4 rounded-sm flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
                            }}
                          />
                          <span className="text-xs text-slate-200 truncate">
                            {power.name}
                          </span>
                        </div>
                        {/* Enhancement slots - fixed width container to prevent layout shift */}
                        <div className="flex gap-px justify-start items-center flex-shrink-0" style={{ width: '120px' }}>
                          {power.slots.map((slot, index) => (
                            <div
                              key={index}
                              onClick={() => openEnhancementPicker(power.name, epicPool.id, index)}
                              onMouseEnter={() =>
                                slot ? handleEnhancementHover(power.name, index) : handlePowerHover(power)
                              }
                              onContextMenu={(e) => {
                                e.preventDefault();
                                if (slot) {
                                  handleClearEnhancement(power.name, index);
                                } else if (index > 0) {
                                  handleRemoveSlot(power.name, index);
                                }
                              }}
                              className={`
                                w-4 h-4 rounded-full border flex items-center justify-center
                                text-[7px] font-semibold cursor-pointer hover:scale-110 transition-transform
                                ${
                                  slot
                                    ? 'border-transparent'
                                    : 'border-slate-600 bg-slate-700/50 text-slate-500 hover:border-purple-500'
                                }
                              `}
                              title={
                                slot
                                  ? `${slot.name || 'Enhancement'} (right-click to remove enhancement)`
                                  : `Empty slot${index > 0 ? ' (right-click to remove slot)' : ''}`
                              }
                            >
                              {slot ? (
                                <SlottedEnhancementIcon enhancement={slot} size={16} />
                              ) : (
                                '+'
                              )}
                            </div>
                          ))}
                          {/* Draggable ghost slot to add more */}
                          <DraggableSlotGhost
                            powerName={power.name}
                            currentSlots={power.slots.length}
                            maxSlots={power.maxSlots}
                            onAddSlots={(count) => handleAddSlots(power.name, count)}
                          />
                        </div>
                        <button
                          onClick={() => handleRemovePower(power.name)}
                          className="text-slate-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity px-0.5"
                          title="Remove power"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Available powers */}
              {availablePowers.length > 0 && (
                <div className={epicPool.powers.length > 0 ? 'border-t border-slate-700 pt-1 mt-1' : ''}>
                  <div className="flex flex-wrap gap-0.5">
                    {availablePowers.map((power) => (
                      <button
                        key={power.name}
                        onClick={() => handleSelectPower(power)}
                        onMouseEnter={() => handlePowerHover(power)}
                        onContextMenu={(e) => handlePowerRightClick(e, power)}
                        className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-700 border border-slate-600 rounded-sm text-[10px] text-slate-300 hover:border-purple-500 hover:bg-slate-600 transition-colors"
                        title="Right-click to lock power info"
                      >
                        <img
                          src={getEpicPowerIcon(power)}
                          alt=""
                          className="w-3 h-3 rounded-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
                          }}
                        />
                        {power.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {epicPool.powers.length === 0 && availablePowers.length === 0 && (
                <div className="text-[10px] text-slate-500 italic px-1">
                  No powers available at current level.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
