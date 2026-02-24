/**
 * AvailablePoolPowers - Renders pool and epic pool selection in column 1,
 * matching the AvailablePowers styling (full-row PowerItem components).
 */

import { useState, useMemo } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import {
  getAllPowerPools,
  getPowerPool,
  getEpicPoolsForArchetype,
  getEpicPool,
  getEpicPoolPowerIconPath,
  POOL_UNLOCK_LEVEL,
  arePoolsUnlocked,
  isPowerAvailableInPool,
  areEpicPoolsUnlocked,
  isEpicPowerAvailable,
  MAX_POWER_PICKS,
} from '@/data';
import { Select } from '@/components/ui';
import { PowerItem } from './AvailablePowers';
import type { Power } from '@/types';

export function AvailablePoolPowers() {
  const build = useBuildStore((s) => s.build);
  const addPool = useBuildStore((s) => s.addPool);
  const removePool = useBuildStore((s) => s.removePool);
  const addPower = useBuildStore((s) => s.addPower);
  const setEpicPool = useBuildStore((s) => s.setEpicPool);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);
  const clearInfoPanel = useUIStore((s) => s.clearInfoPanel);
  const lockInfoPanel = useUIStore((s) => s.lockInfoPanel);
  const unlockInfoPanel = useUIStore((s) => s.unlockInfoPanel);
  const infoPanelLocked = useUIStore((s) => s.infoPanel.locked);
  const lockedContent = useUIStore((s) => s.infoPanel.lockedContent);

  const poolsUnlocked = arePoolsUnlocked(build.level);
  const epicUnlocked = areEpicPoolsUnlocked(build.level);
  const pools = build.pools;
  const canAddPool = pools.length < 4;

  // Check if 24-power limit has been reached
  const powerLimitReached =
    build.primary.powers.length +
    build.secondary.powers.length +
    build.pools.reduce((sum: number, pool: { powers: unknown[] }) => sum + pool.powers.length, 0) +
    (build.epicPool?.powers.length ?? 0) >= MAX_POWER_PICKS;

  // Available pools for dropdown
  const allPools = getAllPowerPools();
  const selectedPoolIds = new Set(pools.map((p) => p.id));
  const availablePoolOptions = poolsUnlocked
    ? Object.entries(allPools)
        .filter(([id]) => !selectedPoolIds.has(id) && id !== 'fitness')
        .map(([id, pool]) => ({ value: id, label: pool.name }))
    : [];

  // Epic pools for dropdown
  const availableEpicPools = useMemo(() => {
    if (!build.archetype.id) return [];
    return getEpicPoolsForArchetype(build.archetype.id);
  }, [build.archetype.id]);

  // Info panel helpers
  const isPowerLocked = (powerName: string) => {
    return infoPanelLocked && lockedContent?.type === 'power' && lockedContent.powerName === powerName;
  };

  const handlePowerHover = (power: Power, poolId: string) => {
    setInfoPanelContent({
      type: 'power',
      powerName: power.name,
      powerSet: poolId,
    });
  };

  const handlePowerLeave = () => {
    clearInfoPanel();
  };

  const handleLockToggle = (power: Power, poolId: string) => {
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

  const handleShowInfo = (power: Power, poolId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    lockInfoPanel({
      type: 'power',
      powerName: power.name,
      powerSet: poolId,
    });
  };

  // Pool actions
  const handleAddPool = (poolId: string) => {
    if (poolId) addPool(poolId);
  };

  const handleSelectPoolPower = (poolId: string, power: Power) => {
    addPower('pool', {
      ...power,
      powerSet: poolId,
      level: build.level,
      slots: [null],
    });
  };

  const handleSelectEpicPower = (power: Power) => {
    if (!build.epicPool) return;
    addPower('epic', {
      ...power,
      powerSet: build.epicPool.id,
      level: build.level,
      slots: [null],
    });
  };

  const handleSelectEpicPool = (poolId: string) => {
    if (poolId) setEpicPool(poolId);
  };

  // Pools not unlocked yet
  if (!poolsUnlocked && !epicUnlocked) {
    return (
      <div className="mb-3">
        <div className="text-[10px] text-slate-500 italic px-1 py-2 text-center bg-slate-800/30 rounded border border-slate-700/30">
          Power Pools unlock at level {POOL_UNLOCK_LEVEL}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Pool sections */}
      {poolsUnlocked && (
        <>
          {/* Add pool dropdown */}
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

          {/* Each added pool as a collapsible section */}
          {pools.map((poolSelection) => {
            const pool = getPowerPool(poolSelection.id);
            if (!pool) return null;

            const selectedPowerNames = poolSelection.powers.map((p) => p.name);
            const selectedSet = new Set(selectedPowerNames);

            return (
              <AvailablePoolSection
                key={poolSelection.id}
                poolId={poolSelection.id}
                poolName={pool.name}
                allPowers={pool.powers}
                selectedPowerNames={selectedSet}
                level={build.level}
                isPowerLocked={isPowerLocked}
                onSelectPower={(power) => handleSelectPoolPower(poolSelection.id, power)}
                onRemovePool={() => removePool(poolSelection.id)}
                onPowerHover={(power) => handlePowerHover(power, poolSelection.id)}
                onPowerLeave={handlePowerLeave}
                onLockToggle={(power) => handleLockToggle(power, poolSelection.id)}
                onShowInfo={(power, e) => handleShowInfo(power, poolSelection.id, e)}
                color="blue"
                checkAvailability={(power) =>
                  isPowerAvailableInPool(poolSelection.id, power, build.level, selectedPowerNames)
                }
                powerLimitReached={powerLimitReached}
              />
            );
          })}
        </>
      )}

      {/* Epic/Patron Pool section */}
      {epicUnlocked && build.archetype.id && (
        <>
          {!build.epicPool ? (
            <div className="mb-3">
              <div className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-1">
                Epic/Patron Pool
              </div>
              <Select
                id="epic-pool-select"
                name="epic-pool"
                options={[
                  { value: '', label: 'Select Epic/Patron Pool...' },
                  ...availableEpicPools.map((pool) => ({
                    value: pool.id,
                    label: pool.displayName || pool.name,
                  })),
                ]}
                value=""
                onChange={(e) => handleSelectEpicPool(e.target.value)}
                className="w-full text-xs"
              />
            </div>
          ) : (
            <AvailableEpicPoolSection
              epicPool={build.epicPool}
              level={build.level}
              isPowerLocked={isPowerLocked}
              onSelectPower={handleSelectEpicPower}
              onRemovePool={() => setEpicPool(null)}
              onPowerHover={(power) => handlePowerHover(power, build.epicPool!.id)}
              onPowerLeave={handlePowerLeave}
              onLockToggle={(power) => handleLockToggle(power, build.epicPool!.id)}
              onShowInfo={(power, e) => handleShowInfo(power, build.epicPool!.id, e)}
              powerLimitReached={powerLimitReached}
            />
          )}
        </>
      )}
    </div>
  );
}

// ============================================
// AVAILABLE POOL SECTION (per pool)
// ============================================

interface AvailablePoolSectionProps {
  poolId: string;
  poolName: string;
  allPowers: Power[];
  selectedPowerNames: Set<string>;
  level: number;
  isPowerLocked: (powerName: string) => boolean;
  onSelectPower: (power: Power) => void;
  onRemovePool: () => void;
  onPowerHover: (power: Power) => void;
  onPowerLeave: () => void;
  onLockToggle: (power: Power) => void;
  onShowInfo: (power: Power, e?: React.MouseEvent) => void;
  color: 'blue' | 'purple';
  checkAvailability: (power: Power) => boolean;
  powerLimitReached?: boolean;
}

function AvailablePoolSection({
  poolId,
  poolName,
  allPowers,
  selectedPowerNames,
  isPowerLocked,
  onSelectPower,
  onRemovePool,
  onPowerHover,
  onPowerLeave,
  onLockToggle,
  onShowInfo,
  color,
  checkAvailability,
  powerLimitReached,
}: AvailablePoolSectionProps) {
  const [collapsed, setCollapsed] = useState(false);

  const colorClass = color === 'blue' ? 'text-blue-400' : 'text-purple-400';

  // Filter out auto-granted powers (available < 0)
  const visiblePowers = allPowers.filter((p) => p.available >= 0);

  return (
    <div className="mb-3">
      {/* Section header */}
      <div
        className="flex items-center justify-between mb-1 cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-1">
          <span className={`text-[10px] text-slate-500 transition-transform ${collapsed ? '' : 'rotate-90'}`}>
            ▶
          </span>
          <div className={`text-xs font-semibold ${colorClass} uppercase tracking-wide`}>
            {poolName}
          </div>
          <span className="text-[9px] text-slate-600">({selectedPowerNames.size})</span>
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

      {/* Power list */}
      {!collapsed && (
        <div className="space-y-0.5">
          {visiblePowers.map((power) => {
            const isSelected = selectedPowerNames.has(power.name);
            const isAvailable = !isSelected && checkAvailability(power);
            const isDisabled = isSelected || !isAvailable || !!powerLimitReached;
            const isLocked = isPowerLocked(power.name);

            return (
              <PowerItem
                key={power.name}
                power={power}
                powersetId={poolId}
                powersetName={poolName}
                isSelected={isSelected}
                isAvailable={isAvailable}
                isDisabled={isDisabled}
                isLocked={isLocked}
                onSelect={() => onSelectPower(power)}
                onHover={() => onPowerHover(power)}
                onLeave={onPowerLeave}
                onLockToggle={() => onLockToggle(power)}
                onShowInfo={(e) => onShowInfo(power, e)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// AVAILABLE EPIC POOL SECTION
// ============================================

interface AvailableEpicPoolSectionProps {
  epicPool: { id: string; name: string; powers: { name: string }[] };
  level: number;
  isPowerLocked: (powerName: string) => boolean;
  onSelectPower: (power: Power) => void;
  onRemovePool: () => void;
  onPowerHover: (power: Power) => void;
  onPowerLeave: () => void;
  onLockToggle: (power: Power) => void;
  onShowInfo: (power: Power, e?: React.MouseEvent) => void;
  powerLimitReached?: boolean;
}

function AvailableEpicPoolSection({
  epicPool,
  level,
  isPowerLocked,
  onSelectPower,
  onRemovePool,
  onPowerHover,
  onPowerLeave,
  onLockToggle,
  onShowInfo,
  powerLimitReached,
}: AvailableEpicPoolSectionProps) {
  const [collapsed, setCollapsed] = useState(false);

  const poolData = useMemo(() => getEpicPool(epicPool.id), [epicPool.id]);
  if (!poolData) return null;

  const selectedPowerNames = new Set(epicPool.powers.map((p) => p.name));
  const visiblePowers = poolData.powers.filter((p) => p.available >= 0);

  return (
    <div className="mb-3">
      {/* Section header */}
      <div
        className="flex items-center justify-between mb-1 cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-1">
          <span className={`text-[10px] text-slate-500 transition-transform ${collapsed ? '' : 'rotate-90'}`}>
            ▶
          </span>
          <div className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
            {epicPool.name}
          </div>
          <span className="text-[9px] text-slate-600">({selectedPowerNames.size})</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemovePool();
          }}
          className="text-xs text-slate-500 hover:text-slate-300"
          title="Remove epic pool"
        >
          ✕
        </button>
      </div>

      {/* Power list */}
      {!collapsed && (
        <div className="space-y-0.5">
          {visiblePowers.map((power) => {
            const isSelected = selectedPowerNames.has(power.name);
            const selectedNames = epicPool.powers.map((p) => p.name);
            const isAvailable = !isSelected && isEpicPowerAvailable(power, level, selectedNames);
            const isDisabled = isSelected || !isAvailable || !!powerLimitReached;
            const isLocked = isPowerLocked(power.name);

            return (
              <PowerItem
                key={power.name}
                power={power}
                powersetId={epicPool.id}
                powersetName={poolData.name}
                iconSrc={getEpicPoolPowerIconPath(poolData.name, power.icon)}
                accentColor="purple"
                isSelected={isSelected}
                isAvailable={isAvailable}
                isDisabled={isDisabled}
                isLocked={isLocked}
                onSelect={() => onSelectPower(power)}
                onHover={() => onPowerHover(power)}
                onLeave={onPowerLeave}
                onLockToggle={() => onLockToggle(power)}
                onShowInfo={(e) => onShowInfo(power, e)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
