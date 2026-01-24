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
  POOL_UNLOCK_LEVEL,
  arePoolsUnlocked,
  getAvailablePoolPowers,
  areEpicPoolsUnlocked,
  getAvailableEpicPoolPowers,
  hasGrantedPowers,
  getGrantedPowerGroup,
} from '@/data';
import { resolvePath } from '@/utils/paths';
import { Select, Tooltip } from '@/components/ui';
import { DraggableSlotGhost } from './DraggableSlotGhost';
import { SlottedEnhancementIcon } from './SlottedEnhancementIcon';
import type { Power, SelectedPower } from '@/types';

/**
 * Determine if a power should show a toggle switch for stat calculations.
 * - Toggle powers (always)
 * - Click powers that target self (Build Up, Aim, Hasten, etc.)
 */
function shouldShowToggle(power: SelectedPower): boolean {
  const powerType = power.powerType?.toLowerCase();
  const targetType = power.targetType?.toLowerCase();
  const shortHelp = power.shortHelp?.toLowerCase() || '';

  // Toggle powers always show toggle
  if (powerType === 'toggle') return true;

  // Click powers that target self (self-buffs)
  // Check both targetType field and shortHelp text (pool powers often lack targetType)
  if (powerType === 'click') {
    if (targetType === 'self') return true;
    if (shortHelp.startsWith('self ') || shortHelp.includes('self +')) return true;
  }

  return false;
}

/** Get the icon path for an inherent power based on its category */
function getInherentIconPath(power: SelectedPower): string {
  const category = power.inherentCategory || 'basic';
  // Icon files are stored in lowercase to match the data
  const lowercaseIcon = power.icon?.toLowerCase() || 'unknown.png';

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

export function PoolPowers() {
  const build = useBuildStore((s) => s.build);
  const addPool = useBuildStore((s) => s.addPool);
  const removePool = useBuildStore((s) => s.removePool);
  const addPower = useBuildStore((s) => s.addPower);
  const removePower = useBuildStore((s) => s.removePower);
  const addSlot = useBuildStore((s) => s.addSlot);
  const removeSlot = useBuildStore((s) => s.removeSlot);
  const clearEnhancement = useBuildStore((s) => s.clearEnhancement);
  const togglePowerActive = useBuildStore((s) => s.togglePowerActive);
  const setActiveSubPower = useBuildStore((s) => s.setActiveSubPower);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);
  const clearInfoPanel = useUIStore((s) => s.clearInfoPanel);
  const lockInfoPanel = useUIStore((s) => s.lockInfoPanel);
  const unlockInfoPanel = useUIStore((s) => s.unlockInfoPanel);
  const infoPanelLocked = useUIStore((s) => s.infoPanel.locked);
  const lockedContent = useUIStore((s) => s.infoPanel.lockedContent);

  const pools = build.pools;
  const canAddPool = pools.length < 4;
  const poolsUnlocked = arePoolsUnlocked(build.level);

  // Get all available pools (only when pools are unlocked at level 4+)
  const allPools = getAllPowerPools();
  const selectedPoolIds = new Set(pools.map((p) => p.id));
  const availablePoolOptions = poolsUnlocked
    ? Object.entries(allPools)
        .filter(([id]) => !selectedPoolIds.has(id))
        .map(([id, pool]) => ({ value: id, label: pool.name }))
    : [];

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
      {/* Pool unlock message - show when pools are locked */}
      {!poolsUnlocked && (
        <div className="text-[10px] text-slate-500 italic px-1 py-2 text-center bg-slate-800/30 rounded border border-slate-700/30">
          Power Pools unlock at level {POOL_UNLOCK_LEVEL}. You are currently level {build.level}.
        </div>
      )}

      {/* Add pool selector - only show when pools are unlocked */}
      {poolsUnlocked && canAddPool && availablePoolOptions.length > 0 && (
        <Select
          id="add-pool-select"
          name="add-pool"
          options={[{ value: '', label: 'Add Pool...' }, ...availablePoolOptions]}
          value=""
          onChange={(e) => handleAddPool(e.target.value)}
          className="w-full text-xs"
        />
      )}

      {/* Empty state - only show if pools unlocked but no pools AND no inherents */}
      {poolsUnlocked && pools.length === 0 && build.inherents.length === 0 && (
        <div className="text-xs text-slate-500 italic py-4 text-center">
          No power pools selected
        </div>
      )}

      {/* Pool sections */}
      {pools.map((poolSelection) => {
        const pool = getPowerPool(poolSelection.id);
        if (!pool) return null;

        const selectedPowerNames = poolSelection.powers.map((p) => p.name);
        // Use the new availability function that handles prerequisites and level requirements
        const availablePowers = getAvailablePoolPowers(
          poolSelection.id,
          build.level,
          selectedPowerNames
        );

        return (
          <PoolPowerGroup
            key={poolSelection.id}
            poolId={poolSelection.id}
            poolName={pool.name}
            poolPowers={pool.powers}
            selectedPowers={poolSelection.powers}
            availablePowers={availablePowers}
            isPowerLocked={isPowerLocked}
            onRemovePool={() => handleRemovePool(poolSelection.id)}
            onSelectPower={(power) => handleSelectPower(poolSelection.id, power)}
            onRemovePower={handleRemovePower}
            onPowerHover={(power) => handlePowerHover(power, poolSelection.id)}
            onToggle={togglePowerActive}
            onSetActiveSubPower={setActiveSubPower}
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
  poolPowers: Power[];
  selectedPowers: SelectedPower[];
  availablePowers: Power[];
  isPowerLocked: (powerName: string) => boolean;
  onRemovePool: () => void;
  onSelectPower: (power: Power) => void;
  onRemovePower: (powerName: string) => void;
  onPowerHover: (power: Power | SelectedPower) => void;
  onToggle: (powerName: string) => void;
  onSetActiveSubPower: (parentPowerName: string, subPowerName: string | null) => void;
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
  poolPowers,
  selectedPowers,
  availablePowers,
  isPowerLocked,
  onRemovePool,
  onSelectPower,
  onRemovePower,
  onPowerHover,
  onToggle,
  onSetActiveSubPower,
  onPowerLeave,
  onPowerRightClick,
  onEnhancementHover,
  onClearEnhancement,
  onAddSlots,
  onRemoveSlot,
}: PoolPowerGroupProps) {
  const [collapsed, setCollapsed] = useState(false);
  const openEnhancementPicker = useUIStore((s) => s.openEnhancementPicker);

  // Sort selected powers by their position in the pool (available level)
  const sortedPowers = [...selectedPowers].sort((a, b) => a.available - b.available);

  // Get sub-powers for a parent power from pool powers
  const getSubPowers = (parentPowerName: string): Power[] => {
    if (!hasGrantedPowers(parentPowerName)) return [];
    const group = getGrantedPowerGroup(parentPowerName);
    if (!group) return [];

    // Find sub-powers in the pool powers
    return poolPowers.filter(p => group.grantedPowers.includes(p.name));
  };

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
          {/* Selected powers - sorted by pool position */}
          {sortedPowers.length > 0 && (
            <div className="space-y-0.5 mb-1">
              {sortedPowers.map((power) => {
                const isLocked = isPowerLocked(power.name);
                const subPowers = getSubPowers(power.name);
                const grantedGroup = getGrantedPowerGroup(power.name);
                return (
                  <div key={power.name}>
                    <div
                      className={`flex items-center gap-1.5 px-1.5 py-1 bg-slate-800 border rounded-sm group transition-colors ${
                      isLocked
                        ? 'border-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.4)] bg-gradient-to-r from-amber-500/10 to-slate-800'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                    onMouseLeave={onPowerLeave}
                  >
                    {/* Power icon and name */}
                    <div
                      className="flex items-center gap-1.5 flex-1 min-w-0 cursor-default"
                      onMouseEnter={() => onPowerHover(power)}
                      onContextMenu={(e) => onPowerRightClick(e, power)}
                      title={isLocked ? 'Right-click to unlock power info' : 'Right-click to lock power info'}
                    >
                      <img
                        src={getPowerIconPath(poolName, power.icon)}
                        alt=""
                        className="w-5 h-5 rounded-sm flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
                        }}
                      />
                      <span className="text-sm text-slate-200 truncate">
                        {power.name}
                      </span>
                    </div>
                    {/* Enhancement slots - fixed width container to prevent layout shift */}
                    <div className="flex gap-0.5 justify-start items-center flex-shrink-0" style={{ width: '180px' }}>
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
                            w-6 h-6 rounded-full border flex items-center justify-center
                            text-[9px] font-semibold cursor-pointer hover:scale-110 transition-transform
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
                            <SlottedEnhancementIcon enhancement={slot} size={24} />
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
                    {/* Toggle switch container - always reserve space to prevent layout shift */}
                    <div className="w-8 flex-shrink-0">
                      {shouldShowToggle(power) && (
                        <Tooltip
                          content={
                            power.isActive
                              ? 'Power ON - stats included'
                              : 'Power OFF - click to include'
                          }
                        >
                          <button
                            onClick={() => onToggle(power.name)}
                            className={`
                              relative w-8 h-4 rounded-full transition-colors duration-200
                              ${power.isActive ? 'bg-green-600' : 'bg-slate-600'}
                            `}
                          >
                            <span
                              className={`
                                absolute top-[2px] left-[2px] w-3 h-3 rounded-full bg-white shadow-sm
                                transition-transform duration-200
                                ${power.isActive ? 'translate-x-4' : 'translate-x-0'}
                              `}
                            />
                          </button>
                        </Tooltip>
                      )}
                    </div>
                    <button
                      onClick={() => onRemovePower(power.name)}
                      className="text-slate-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity px-0.5"
                      title="Remove power"
                    >
                      ✕
                    </button>
                    </div>

                    {/* Granted sub-powers display */}
                    {subPowers.length > 0 && (
                      <GrantedPoolSubPowers
                        subPowers={subPowers}
                        poolName={poolName}
                        isMutuallyExclusive={grantedGroup?.mutuallyExclusive ?? false}
                        activeSubPower={power.activeSubPower}
                        onSetActive={(subPowerName) => onSetActiveSubPower(power.name, subPowerName)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Available powers */}
          {availablePowers.length > 0 && (
            <div className="border-t border-slate-700 pt-1 mt-1">
              <div className="flex flex-wrap gap-1">
                {availablePowers.map((power) => (
                  <button
                    key={power.name}
                    onClick={() => onSelectPower(power)}
                    onMouseEnter={() => onPowerHover(power)}
                    onContextMenu={(e) => onPowerRightClick(e, power)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-slate-700 border border-slate-600 rounded-sm text-xs text-slate-300 hover:border-blue-500 hover:bg-slate-600 transition-colors"
                    title="Right-click to lock power info"
                  >
                    <img
                      src={getPowerIconPath(poolName, power.icon)}
                      alt=""
                      className="w-4 h-4 rounded-sm"
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
// GRANTED SUB-POWERS FOR POOLS COMPONENT
// ============================================

interface GrantedPoolSubPowersProps {
  subPowers: Power[];
  poolName: string;
  isMutuallyExclusive: boolean;
  activeSubPower?: string;
  onSetActive: (subPowerName: string | null) => void;
}

/**
 * Displays granted sub-powers below a parent power in a pool
 * For non-mutually exclusive powers (like Fly → Afterburner), shows toggle-style selection
 */
function GrantedPoolSubPowers({
  subPowers,
  poolName,
  isMutuallyExclusive,
  activeSubPower,
  onSetActive,
}: GrantedPoolSubPowersProps) {
  return (
    <div className="ml-6 mt-0.5 space-y-0.5">
      {subPowers.map((subPower) => {
        const isActive = activeSubPower === subPower.name;

        return (
          <div
            key={subPower.name}
            className={`
              flex items-center gap-1.5 px-1.5 py-0.5 rounded-sm
              border transition-colors
              ${isActive
                ? 'bg-slate-700/50 border-green-600/50'
                : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
              }
            `}
          >
            {/* Sub-power icon and name */}
            <img
              src={getPowerIconPath(poolName, subPower.icon)}
              alt=""
              className="w-4 h-4 rounded-sm flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
              }}
            />
            <span className={`text-xs truncate flex-1 ${isActive ? 'text-green-300' : 'text-slate-400'}`}>
              {subPower.name}
            </span>

            {/* Toggle/Radio button for sub-power */}
            {isMutuallyExclusive ? (
              <Tooltip
                content={
                  isActive
                    ? `${subPower.name} is active`
                    : `Activate ${subPower.name}`
                }
              >
                <button
                  onClick={() => onSetActive(isActive ? null : subPower.name)}
                  className={`
                    w-4 h-4 rounded-full border-2 flex items-center justify-center
                    transition-colors
                    ${isActive
                      ? 'border-green-500 bg-green-500'
                      : 'border-slate-500 hover:border-green-400'
                    }
                  `}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              </Tooltip>
            ) : (
              <Tooltip
                content={
                  isActive
                    ? `${subPower.name} ON`
                    : `${subPower.name} OFF`
                }
              >
                <button
                  onClick={() => onSetActive(isActive ? null : subPower.name)}
                  className={`
                    relative w-6 h-3 rounded-full transition-colors duration-200
                    ${isActive ? 'bg-green-600' : 'bg-slate-600'}
                  `}
                >
                  <span
                    className={`
                      absolute top-[2px] left-[2px] w-2 h-2 rounded-full bg-white shadow-sm
                      transition-transform duration-200
                      ${isActive ? 'translate-x-3' : 'translate-x-0'}
                    `}
                  />
                </button>
              </Tooltip>
            )}
          </div>
        );
      })}
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

  // Sort inherent powers by their position (available level)
  const sortedPowers = [...powers].sort((a, b) => a.available - b.available);

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
        <span className="text-[9px] text-slate-600">({sortedPowers.length})</span>
      </div>

      {/* Collapsible powers list - sorted by position */}
      {!collapsed && (
        <div className="space-y-0.5 mt-1">
          {sortedPowers.map((power) => {
            const isLocked = isPowerLocked(power.name);
            const hasSlots = power.slots.length > 0;
            const canAddMoreSlots = power.maxSlots > power.slots.length;

            return (
              <div
                key={power.name}
                className={`flex items-center gap-1.5 px-1.5 py-1 bg-slate-800/50 border rounded-sm transition-colors ${
                  isLocked
                    ? 'border-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.4)] bg-gradient-to-r from-amber-500/10 to-slate-800/50'
                    : 'border-slate-700/50 hover:border-slate-600'
                }`}
                onMouseLeave={onPowerLeave}
              >
                {/* Power icon and name */}
                <div
                  className="flex items-center gap-1.5 flex-1 min-w-0 cursor-default"
                  onMouseEnter={() => onPowerHover(power)}
                  onContextMenu={(e) => onPowerRightClick(e, power)}
                  title={isLocked ? 'Right-click to unlock power info' : 'Right-click to lock power info'}
                >
                  <img
                    src={getInherentIconPath(power)}
                    alt=""
                    className="w-5 h-5 rounded-sm flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
                    }}
                  />
                  <span className="text-sm text-slate-400 truncate">
                    {power.name}
                  </span>
                  {/* Auto indicator for auto powers */}
                  {power.powerType === 'Auto' && (
                    <span className="text-[9px] text-slate-600 uppercase">(Auto)</span>
                  )}
                </div>

                {/* Enhancement slots - fixed width container to match other power rows */}
                <div className="flex gap-0.5 justify-start items-center flex-shrink-0" style={{ width: '180px' }}>
                  {(hasSlots || power.maxSlots > 0) && (
                    <>
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
                            w-6 h-6 rounded-full border flex items-center justify-center
                            text-[9px] font-semibold cursor-pointer hover:scale-110 transition-transform
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
                            <SlottedEnhancementIcon enhancement={slot} size={24} />
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
                    </>
                  )}
                  {/* No slots indicator for archetype inherents */}
                  {!hasSlots && power.maxSlots === 0 && (
                    <span className="text-[9px] text-slate-600 italic">No slots</span>
                  )}
                </div>

                {/* Toggle space reservation to match other power rows */}
                <div className="w-8 flex-shrink-0"></div>
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

  // Check if epic pools are unlocked (level 35+)
  const isUnlocked = areEpicPoolsUnlocked(level);

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

  // Get available powers from the selected epic pool using new availability function
  const availablePowers = useMemo(() => {
    if (!epicPool?.id) return [];
    const selectedPowerNames = epicPool?.powers.map((p) => p.name) || [];
    // Use the new availability function that handles level and prerequisite requirements
    return getAvailableEpicPoolPowers(epicPool.id, level, selectedPowerNames);
  }, [epicPool?.id, epicPool?.powers, level]);

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

  // Don't show if no archetype selected or if epic pools aren't unlocked yet
  if (!archetypeId) return null;
  if (!isUnlocked) return null;

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
          {!epicPool ? (
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
              {/* Selected powers - sorted by pool position */}
              {epicPool.powers.length > 0 && (
                <div className="space-y-0.5">
                  {[...epicPool.powers].sort((a, b) => a.available - b.available).map((power) => {
                    const isLocked = isPowerLocked(power.name);
                    return (
                      <div
                        key={power.name}
                        className={`flex items-center gap-1.5 px-1.5 py-1 bg-slate-800 border rounded-sm group transition-colors ${
                          isLocked
                            ? 'border-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.4)] bg-gradient-to-r from-amber-500/10 to-slate-800'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                        onMouseLeave={handlePowerLeave}
                      >
                        {/* Power icon and name */}
                        <div
                          className="flex items-center gap-1.5 flex-1 min-w-0 cursor-default"
                          onMouseEnter={() => handlePowerHover(power)}
                          onContextMenu={(e) => handlePowerRightClick(e, power)}
                          title={isLocked ? 'Right-click to unlock power info' : 'Right-click to lock power info'}
                        >
                          <img
                            src={getEpicPowerIcon(power)}
                            alt=""
                            className="w-5 h-5 rounded-sm flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
                            }}
                          />
                          <span className="text-sm text-slate-200 truncate">
                            {power.name}
                          </span>
                        </div>
                        {/* Enhancement slots - fixed width container to prevent layout shift */}
                        <div className="flex gap-0.5 justify-start items-center flex-shrink-0" style={{ width: '180px' }}>
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
                                w-6 h-6 rounded-full border flex items-center justify-center
                                text-[9px] font-semibold cursor-pointer hover:scale-110 transition-transform
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
                                <SlottedEnhancementIcon enhancement={slot} size={24} />
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
                        {/* Toggle space reservation to match other power rows */}
                        <div className="w-8 flex-shrink-0"></div>
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
                  <div className="flex flex-wrap gap-1">
                    {availablePowers.map((power) => (
                      <button
                        key={power.name}
                        onClick={() => handleSelectPower(power)}
                        onMouseEnter={() => handlePowerHover(power)}
                        onContextMenu={(e) => handlePowerRightClick(e, power)}
                        className="flex items-center gap-1.5 px-2 py-1 bg-slate-700 border border-slate-600 rounded-sm text-xs text-slate-300 hover:border-purple-500 hover:bg-slate-600 transition-colors"
                        title="Right-click to lock power info"
                      >
                        <img
                          src={getEpicPowerIcon(power)}
                          alt=""
                          className="w-4 h-4 rounded-sm"
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
