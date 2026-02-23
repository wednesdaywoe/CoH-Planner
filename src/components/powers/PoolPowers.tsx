/**
 * PoolPowers component - displays selected pool powers, epic powers, and inherent powers
 * Selection UI (dropdowns, available powers) has moved to AvailablePoolPowers in column 1.
 * This component only renders selected powers with slots, toggles, and enhancement management.
 */

import { useMemo, useState } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import {
  getPowerPool,
  getPowerIconPath,
  getEpicPool,
  getEpicPoolPowerIconPath,
  hasGrantedPowers,
  getGrantedPowerGroup,
} from '@/data';
import { resolvePath } from '@/utils/paths';
import { Tooltip } from '@/components/ui';
import { PowerRow } from './PowerRow';
import { shouldShowToggle, getInherentIconPath } from './power-row-utils';
import type { Power, SelectedPower } from '@/types';

export function PoolPowers() {
  const build = useBuildStore((s) => s.build);
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

  const handleRemoveAllSlots = (powerName: string, totalSlots: number) => {
    for (let i = totalSlots - 1; i > 0; i--) {
      removeSlot(powerName, i);
    }
  };

  const handleClearAllEnhancements = (powerName: string, totalSlots: number) => {
    for (let i = 0; i < totalSlots; i++) {
      clearEnhancement(powerName, i);
    }
  };

  const handlePowerHover = (power: Power | SelectedPower, poolId: string) => {
    setInfoPanelContent({
      type: 'power',
      powerName: power.name,
      powerSet: poolId,
    });
  };

  const handlePowerLeave = () => {
    clearInfoPanel();
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

  const handlePowerRightClick = (e: React.MouseEvent, power: Power | SelectedPower, poolId: string) => {
    e.preventDefault();
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

  // Check if there are any selected powers or inherents to display
  const hasSelectedPoolPowers = pools.some((p) => p.powers.length > 0);
  const hasEpicPowers = build.epicPool && build.epicPool.powers.length > 0;
  const hasInherents = build.inherents.length > 0;
  const hasAnything = hasSelectedPoolPowers || hasEpicPowers || hasInherents;

  if (!hasAnything) {
    return (
      <div className="text-xs text-slate-500 italic py-4 text-center">
        No pool powers or inherents yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Pool sections — only show pools that have selected powers */}
      {pools.map((poolSelection) => {
        if (poolSelection.powers.length === 0) return null;
        const pool = getPowerPool(poolSelection.id);
        if (!pool) return null;

        return (
          <PoolPowerGroup
            key={poolSelection.id}
            poolId={poolSelection.id}
            poolName={pool.name}
            poolPowers={pool.powers}
            selectedPowers={poolSelection.powers}
            isPowerLocked={isPowerLocked}
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
            onRemoveAllSlots={handleRemoveAllSlots}
            onClearAllEnhancements={handleClearAllEnhancements}
          />
        );
      })}

      {/* Epic/Patron Pool — only show if has selected powers */}
      {hasEpicPowers && (
        <EpicPoolSelectedPowers
          epicPool={build.epicPool!}
          isPowerLocked={isPowerLocked}
        />
      )}

      {/* Inherent Powers */}
      {hasInherents && (
        <>
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
              onRemoveAllSlots={handleRemoveAllSlots}
              onClearAllEnhancements={handleClearAllEnhancements}
            />
          )}

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
              onRemoveAllSlots={handleRemoveAllSlots}
              onClearAllEnhancements={handleClearAllEnhancements}
              defaultCollapsed
            />
          )}

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
              onRemoveAllSlots={handleRemoveAllSlots}
              onClearAllEnhancements={handleClearAllEnhancements}
              defaultCollapsed
            />
          )}

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
              onRemoveAllSlots={handleRemoveAllSlots}
              onClearAllEnhancements={handleClearAllEnhancements}
              defaultCollapsed
            />
          )}
        </>
      )}
    </div>
  );
}

// ============================================
// POOL POWER GROUP COMPONENT (selected only)
// ============================================

interface PoolPowerGroupProps {
  poolId: string;
  poolName: string;
  poolPowers: Power[];
  selectedPowers: SelectedPower[];
  isPowerLocked: (powerName: string) => boolean;
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
  onRemoveAllSlots: (powerName: string, totalSlots: number) => void;
  onClearAllEnhancements: (powerName: string, totalSlots: number) => void;
}

function PoolPowerGroup({
  poolId,
  poolName,
  poolPowers,
  selectedPowers,
  isPowerLocked,
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
  onRemoveAllSlots,
  onClearAllEnhancements,
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

    return poolPowers.filter(p => group.grantedPowers.includes(p.name));
  };

  return (
    <div>
      {/* Pool header - clickable to collapse */}
      <div
        className="flex items-center gap-1 mb-1.5 cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className={`text-[10px] text-slate-500 transition-transform ${collapsed ? '' : 'rotate-90'}`}>
          ▶
        </span>
        <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
          {poolName}
        </h4>
        <span className="text-[9px] text-slate-600">({selectedPowers.length})</span>
      </div>

      {/* Collapsible content */}
      {!collapsed && (
        <div className="space-y-0.5">
          {sortedPowers.map((power) => {
            const isLocked = isPowerLocked(power.name);
            const subPowers = getSubPowers(power.name);
            const grantedGroup = getGrantedPowerGroup(power.name);
            return (
              <div key={power.name}>
                <PowerRow
                  name={power.name}
                  iconSrc={getPowerIconPath(poolName, power.icon)}
                  size="lg"
                  stackedLayout
                  level={power.level}
                  isLocked={isLocked}
                  toggleSize={shouldShowToggle(power) ? 'md' : undefined}
                  isActive={power.isActive ?? false}
                  onToggle={() => onToggle(power.name)}
                  slots={power.slots}
                  maxSlots={power.maxSlots}
                  onRemove={() => onRemovePower(power.name)}
                  onAddSlots={(count) => onAddSlots(power.name, count)}
                  onRemoveSlot={(index) => onRemoveSlot(power.name, index)}
                  onRemoveAllSlots={() => onRemoveAllSlots(power.name, power.slots.length)}
                  onClearEnhancement={(index) => onClearEnhancement(power.name, index)}
                  onClearAllEnhancements={() => onClearAllEnhancements(power.name, power.slots.length)}
                  onOpenPicker={(slotIndex) => openEnhancementPicker(power.name, poolId, slotIndex)}
                  onHover={() => onPowerHover(power)}
                  onLeave={onPowerLeave}
                  onEnhancementHover={(index) => onEnhancementHover(power.name, index)}
                  onRightClick={(e) => onPowerRightClick(e, power)}
                />

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
// EPIC POOL SELECTED POWERS COMPONENT
// ============================================

interface EpicPoolSelectedPowersProps {
  epicPool: { id: string; name: string; powers: SelectedPower[] };
  isPowerLocked: (powerName: string) => boolean;
}

function EpicPoolSelectedPowers({ epicPool, isPowerLocked }: EpicPoolSelectedPowersProps) {
  const [collapsed, setCollapsed] = useState(false);

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

  const selectedPoolData = useMemo(() => getEpicPool(epicPool.id), [epicPool.id]);

  const getEpicPowerIcon = (power: Power | SelectedPower) => {
    if (!selectedPoolData) return resolvePath('/img/Unknown.png');
    return getEpicPoolPowerIconPath(selectedPoolData.name, power.icon);
  };

  const handlePowerHover = (power: Power | SelectedPower) => {
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

  const handleRemoveAllSlots = (powerName: string, totalSlots: number) => {
    for (let i = totalSlots - 1; i > 0; i--) {
      removeSlot(powerName, i);
    }
  };

  const handleClearAllEnhancements = (powerName: string, totalSlots: number) => {
    for (let i = 0; i < totalSlots; i++) {
      clearEnhancement(powerName, i);
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        className="flex items-center gap-1 mb-1.5 cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className={`text-[10px] text-slate-500 transition-transform ${collapsed ? '' : 'rotate-90'}`}>
          ▶
        </span>
        <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
          {epicPool.name}
        </h4>
        <span className="text-[9px] text-slate-600">({epicPool.powers.length})</span>
      </div>

      {/* Selected powers */}
      {!collapsed && (
        <div className="space-y-0.5">
          {[...epicPool.powers].sort((a, b) => a.available - b.available).map((power) => {
            const isLocked = isPowerLocked(power.name);
            return (
              <PowerRow
                key={power.name}
                name={power.name}
                iconSrc={getEpicPowerIcon(power)}
                size="lg"
                stackedLayout
                level={power.level}
                isLocked={isLocked}
                slots={power.slots}
                maxSlots={power.maxSlots}
                onRemove={() => removePower('epic', power.name)}
                onAddSlots={(count) => handleAddSlots(power.name, count)}
                onRemoveSlot={(index) => handleRemoveSlot(power.name, index)}
                onRemoveAllSlots={() => handleRemoveAllSlots(power.name, power.slots.length)}
                onClearEnhancement={(index) => handleClearEnhancement(power.name, index)}
                onClearAllEnhancements={() => handleClearAllEnhancements(power.name, power.slots.length)}
                onOpenPicker={(slotIndex) => openEnhancementPicker(power.name, epicPool.id, slotIndex)}
                onHover={() => handlePowerHover(power)}
                onLeave={handlePowerLeave}
                onEnhancementHover={(index) => handleEnhancementHover(power.name, index)}
                onRightClick={(e) => handlePowerRightClick(e, power)}
              />
            );
          })}
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
  onRemoveAllSlots: (powerName: string, totalSlots: number) => void;
  onClearAllEnhancements: (powerName: string, totalSlots: number) => void;
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
  onRemoveAllSlots,
  onClearAllEnhancements,
  defaultCollapsed = false,
}: InherentPowerGroupProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const openEnhancementPicker = useUIStore((s) => s.openEnhancementPicker);

  const sortedPowers = [...powers].sort((a, b) => a.available - b.available);

  return (
    <div>
      <div
        className="flex items-center gap-1 mb-1.5 cursor-pointer select-none"
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

      {!collapsed && (
        <div className="space-y-0.5">
          {sortedPowers.map((power) => {
            const isLocked = isPowerLocked(power.name);

            return (
              <PowerRow
                key={power.name}
                name={power.name}
                iconSrc={getInherentIconPath(power)}
                size="sm"
                muted
                showRemove={false}
                showAutoLabel={power.powerType === 'Auto'}
                isLocked={isLocked}
                slots={power.slots}
                maxSlots={power.maxSlots}
                onAddSlots={(count) => onAddSlots(power.name, count)}
                onRemoveSlot={(index) => onRemoveSlot(power.name, index)}
                onRemoveAllSlots={() => onRemoveAllSlots(power.name, power.slots.length)}
                onClearEnhancement={(index) => onClearEnhancement(power.name, index)}
                onClearAllEnhancements={() => onClearAllEnhancements(power.name, power.slots.length)}
                onOpenPicker={(slotIndex) => openEnhancementPicker(power.name, 'Inherent', slotIndex)}
                onHover={() => onPowerHover(power)}
                onLeave={onPowerLeave}
                onEnhancementHover={(index) => onEnhancementHover(power.name, index)}
                onRightClick={(e) => onPowerRightClick(e, power)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
