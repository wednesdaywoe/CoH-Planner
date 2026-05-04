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
  getPowerIconPath,
  POOL_UNLOCK_LEVEL,
  arePoolsUnlocked,
  isPowerAvailableInPool,
  areEpicPoolsUnlocked,
  isEpicPowerAvailable,
  MAX_POWER_PICKS,
  getPowerPicksAtLevel,
} from '@/data';
import { PoolPickerModal } from '@/components/modals/PoolPickerModal';
import { PowerItem } from './AvailablePowers';
import type { Power } from '@/types';

interface AvailablePoolPowersProps {
  /** Compact mode: 2-column grid layout for pools */
  compact?: boolean;
}

export function AvailablePoolPowers({ compact = false }: AvailablePoolPowersProps) {
  const build = useBuildStore((s) => s.build);
  const addPool = useBuildStore((s) => s.addPool);
  const removePool = useBuildStore((s) => s.removePool);
  const addPower = useBuildStore((s) => s.addPower);
  const removePower = useBuildStore((s) => s.removePower);
  const setEpicPool = useBuildStore((s) => s.setEpicPool);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);
  const lockInfoPanel = useUIStore((s) => s.lockInfoPanel);
  const unlockInfoPanel = useUIStore((s) => s.unlockInfoPanel);
  const infoPanelLocked = useUIStore((s) => s.infoPanel.locked);
  const lockedContent = useUIStore((s) => s.infoPanel.lockedContent);

  const poolsUnlocked = arePoolsUnlocked(build.level);
  const epicUnlocked = areEpicPoolsUnlocked(build.level);
  const pools = build.pools;
  const canAddPool = pools.length < 4;

  // Check if 24-power limit has been reached (exclude auto-granted form sub-powers)
  const countNonGranted = (powers: { isAutoGranted?: boolean }[]) =>
    powers.filter(p => !p.isAutoGranted).length;
  const totalPicksUsed =
    countNonGranted(build.primary.powers) +
    countNonGranted(build.secondary.powers) +
    build.pools.reduce((sum: number, pool: { powers: { isAutoGranted?: boolean }[] }) => sum + countNonGranted(pool.powers), 0) +
    (build.epicPool ? countNonGranted(build.epicPool.powers) : 0);
  const powerLimitReached = totalPicksUsed >= MAX_POWER_PICKS;

  // Level Up mode: if the per-level pick quota is full, collapse into the
  // same "limit reached" gate so pool/epic power selection is blocked too
  const levelUpMode = useUIStore((s) => s.levelUpMode);
  const levelUpPickQuotaReached = levelUpMode && totalPicksUsed >= getPowerPicksAtLevel(build.level);
  const pickGateClosed = powerLimitReached || levelUpPickQuotaReached;

  // Available pools (used to compute whether the "Add Pool" button has any choices)
  const allPools = getAllPowerPools();
  const selectedPoolIds = new Set(pools.map((p) => p.id));
  const hasAnyAvailablePool = poolsUnlocked
    ? Object.keys(allPools).some(
        (id) => id !== 'fitness' && !selectedPoolIds.has(id),
      )
    : false;

  // Epic pools available for this archetype (used to gate the epic picker)
  const availableEpicPools = useMemo(() => {
    if (!build.archetype.id) return [];
    return getEpicPoolsForArchetype(build.archetype.id);
  }, [build.archetype.id]);

  // Picker modal state
  const [poolPickerOpen, setPoolPickerOpen] = useState(false);
  const [epicPickerOpen, setEpicPickerOpen] = useState(false);

  // Info panel helpers (powerName here is internalName)
  const isPowerLocked = (powerName: string) => {
    return infoPanelLocked && lockedContent?.type === 'power' && lockedContent.powerName === powerName;
  };

  const handlePowerHover = (power: Power, poolId: string) => {
    setInfoPanelContent({
      type: 'power',
      powerName: power.internalName,
      powerSet: poolId,
    });
  };

  const handlePowerLeave = () => {
    // Don't clear — keep showing the last-hovered power until a new one is hovered
  };

  const handleLockToggle = (power: Power, poolId: string) => {
    if (infoPanelLocked && lockedContent?.type === 'power' && lockedContent.powerName === power.internalName) {
      unlockInfoPanel();
    } else {
      lockInfoPanel({
        type: 'power',
        powerName: power.internalName,
        powerSet: poolId,
      });
    }
  };

  const handleShowInfo = (power: Power, poolId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    lockInfoPanel({
      type: 'power',
      powerName: power.internalName,
      powerSet: poolId,
    });
  };

  // Pool actions
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

  // Picker callbacks: add the pool, then (optionally) the chosen power.
  const handlePickerAddPool = (poolId: string, powerInternalName?: string) => {
    addPool(poolId);
    if (!powerInternalName) return;
    const pool = getPowerPool(poolId);
    const power = pool?.powers.find((p) => p.internalName === powerInternalName);
    if (power) {
      addPower('pool', {
        ...power,
        powerSet: poolId,
        level: build.level,
        slots: [null],
      });
    }
  };

  const handlePickerAddEpic = (poolId: string, powerInternalName?: string) => {
    setEpicPool(poolId);
    if (!powerInternalName) return;
    const epic = getEpicPool(poolId);
    const power = epic?.powers.find((p) => p.internalName === powerInternalName);
    if (power) {
      addPower('epic', {
        ...power,
        powerSet: poolId,
        level: build.level,
        slots: [null],
      });
    }
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

  // Build pool tile elements for reuse in both layouts
  const poolTiles = poolsUnlocked ? pools.map((poolSelection) => {
    const pool = getPowerPool(poolSelection.id);
    if (!pool) return null;
    const selectedSet = new Set(poolSelection.powers.map((p) => p.name));
    const selectedInternalNames = poolSelection.powers.map((p) => p.internalName);
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
        onRemovePower={(power) => removePower('pool', power.internalName)}
        onRemovePool={() => removePool(poolSelection.id)}
        onPowerHover={(power) => handlePowerHover(power, poolSelection.id)}
        onPowerLeave={handlePowerLeave}
        onLockToggle={(power) => handleLockToggle(power, poolSelection.id)}
        onShowInfo={(power, e) => handleShowInfo(power, poolSelection.id, e)}
        color="blue"
        checkAvailability={(power) =>
          isPowerAvailableInPool(poolSelection.id, power, build.level, selectedInternalNames)
        }
        powerLimitReached={pickGateClosed}
        compact={compact}
      />
    );
  }).filter(Boolean) : [];

  const epicTile = epicUnlocked && build.archetype.id ? (
    !build.epicPool ? (
      <div className={compact ? 'bg-slate-900 p-2 flex items-center justify-center' : ''}>
        <button
          type="button"
          onClick={() => setEpicPickerOpen(true)}
          disabled={availableEpicPools.length === 0}
          className="w-full text-xs px-2 py-1.5 rounded border border-purple-600/40 bg-slate-800 text-purple-200 hover:border-purple-500 hover:bg-slate-700/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          + Choose Epic / Patron Pool…
        </button>
      </div>
    ) : (
      <AvailableEpicPoolSection
        epicPool={build.epicPool}
        level={build.level}
        isPowerLocked={isPowerLocked}
        onSelectPower={handleSelectEpicPower}
        onRemovePower={(power) => removePower('epic', power.internalName)}
        onRemovePool={() => setEpicPool(null)}
        onPowerHover={(power) => handlePowerHover(power, build.epicPool!.id)}
        onPowerLeave={handlePowerLeave}
        onLockToggle={(power) => handleLockToggle(power, build.epicPool!.id)}
        onShowInfo={(power, e) => handleShowInfo(power, build.epicPool!.id, e)}
        powerLimitReached={pickGateClosed}
        compact={compact}
      />
    )
  ) : null;

  const addPoolDropdown = poolsUnlocked && canAddPool && hasAnyAvailablePool ? (
    <div className={compact ? 'bg-slate-900 p-2 flex items-center justify-center' : ''}>
      <button
        type="button"
        onClick={() => setPoolPickerOpen(true)}
        className="w-full text-xs px-2 py-1.5 rounded border border-blue-600/40 bg-slate-800 text-blue-200 hover:border-blue-500 hover:bg-slate-700/60 transition-colors"
      >
        + Add Power Pool…
      </button>
    </div>
  ) : null;

  const pickers = (
    <>
      <PoolPickerModal
        isOpen={poolPickerOpen}
        onClose={() => setPoolPickerOpen(false)}
        mode="pool"
        level={build.level}
        excludeIds={selectedPoolIds}
        onSelect={handlePickerAddPool}
      />
      <PoolPickerModal
        isOpen={epicPickerOpen}
        onClose={() => setEpicPickerOpen(false)}
        mode="epic"
        archetypeId={build.archetype.id ?? undefined}
        level={build.level}
        excludeIds={build.epicPool ? new Set([build.epicPool.id]) : new Set()}
        onSelect={handlePickerAddEpic}
      />
    </>
  );

  // Compact mode: single column on mobile, 2-column grid on sm+.
  // Order: existing pools → "+ Add Pool" → epic (always last).
  if (compact) {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-700">
          {poolTiles}
          {addPoolDropdown}
          {epicTile}
        </div>
        {pickers}
      </>
    );
  }

  // Normal mode: stacked layout
  return (
    <>
      <div className="space-y-3">
        {addPoolDropdown}
        {poolTiles}
        {epicTile}
      </div>
      {pickers}
    </>
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
  onRemovePower: (power: Power) => void;
  onRemovePool: () => void;
  onPowerHover: (power: Power) => void;
  onPowerLeave: () => void;
  onLockToggle: (power: Power) => void;
  onShowInfo: (power: Power, e?: React.MouseEvent) => void;
  color: 'blue' | 'purple';
  checkAvailability: (power: Power) => boolean;
  powerLimitReached?: boolean;
  compact?: boolean;
}

function AvailablePoolSection({
  poolId,
  poolName,
  allPowers,
  selectedPowerNames,
  isPowerLocked,
  onSelectPower,
  onRemovePower,
  onRemovePool,
  onPowerHover,
  onPowerLeave,
  onLockToggle,
  onShowInfo,
  color,
  checkAvailability,
  powerLimitReached,
  compact = false,
}: AvailablePoolSectionProps) {
  const [collapsed, setCollapsed] = useState(false);

  const isPool = color === 'blue';
  const colorClass = isPool ? 'text-blue-400' : 'text-purple-400';

  // Filter out auto-granted powers (available < 0)
  const visiblePowers = allPowers.filter((p) => p.available >= 0);

  if (compact) {
    return (
      <div className="bg-slate-900">
        {/* Compact tile header */}
        <div className="flex items-center justify-between px-2 h-7 bg-slate-800/80 border-b border-slate-700">
          <div className={`text-[10px] font-semibold ${colorClass} uppercase tracking-wide truncate`}>
            {poolName}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onRemovePool(); }}
            className="text-[10px] text-slate-600 hover:text-red-400 ml-1"
            title="Remove pool"
          >✕</button>
        </div>
        {/* Power list */}
        <div>
          {visiblePowers.map((power) => {
            const isSelected = selectedPowerNames.has(power.name);
            const isAvailable = !isSelected && checkAvailability(power);
            const isDisabled = !isSelected && (!isAvailable || !!powerLimitReached);
            const isLocked = isPowerLocked(power.internalName);
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
                onRemove={() => onRemovePower(power)}
                onHover={() => onPowerHover(power)}
                onLeave={onPowerLeave}
                onLockToggle={() => onLockToggle(power)}
                onShowInfo={(e) => onShowInfo(power, e)}
              />
            );
          })}
        </div>
      </div>
    );
  }

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
          <div className={`text-xs font-semibold text-blue-400 uppercase tracking-wide`}>
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
            const isDisabled = !isSelected && (!isAvailable || !!powerLimitReached);
            const isLocked = isPowerLocked(power.internalName);

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
                onRemove={() => onRemovePower(power)}
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
  onRemovePower: (power: Power) => void;
  onRemovePool: () => void;
  onPowerHover: (power: Power) => void;
  onPowerLeave: () => void;
  onLockToggle: (power: Power) => void;
  onShowInfo: (power: Power, e?: React.MouseEvent) => void;
  powerLimitReached?: boolean;
  compact?: boolean;
}

function AvailableEpicPoolSection({
  epicPool,
  level,
  isPowerLocked,
  onSelectPower,
  onRemovePower,
  onRemovePool,
  onPowerHover,
  onPowerLeave,
  onLockToggle,
  onShowInfo,
  powerLimitReached,
  compact = false,
}: AvailableEpicPoolSectionProps) {
  const [collapsed, setCollapsed] = useState(false);

  const poolData = useMemo(() => getEpicPool(epicPool.id), [epicPool.id]);
  if (!poolData) return null;

  const selectedPowerNames = new Set(epicPool.powers.map((p) => p.name));
  const visiblePowers = poolData.powers.filter((p) => p.available >= 0);

  const powerList = visiblePowers.map((power) => {
    const isSelected = selectedPowerNames.has(power.name);
    const selectedNames = epicPool.powers.map((p) => p.name);
    const isAvailable = !isSelected && isEpicPowerAvailable(power, level, selectedNames);
    const isDisabled = !isSelected && (!isAvailable || !!powerLimitReached);
    const isLocked = isPowerLocked(power.internalName);
    return (
      <PowerItem
        key={power.name}
        power={power}
        powersetId={epicPool.id}
        powersetName={poolData.name}
        iconSrc={getPowerIconPath(power.icon)}
        accentColor="purple"
        isSelected={isSelected}
        isAvailable={isAvailable}
        isDisabled={isDisabled}
        isLocked={isLocked}
        onSelect={() => onSelectPower(power)}
        onRemove={() => onRemovePower(power)}
        onHover={() => onPowerHover(power)}
        onLeave={onPowerLeave}
        onLockToggle={() => onLockToggle(power)}
        onShowInfo={(e) => onShowInfo(power, e)}
      />
    );
  });

  if (compact) {
    return (
      <div className="bg-slate-900">
        <div className="flex items-center justify-between px-2 h-7 bg-slate-800/80 border-b border-slate-700">
          <div className="text-[10px] font-semibold text-purple-400 uppercase tracking-wide truncate">
            {epicPool.name}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onRemovePool(); }}
            className="text-[10px] text-slate-600 hover:text-red-400 ml-1"
            title="Remove epic pool"
          >✕</button>
        </div>
        <div>{powerList}</div>
      </div>
    );
  }

  return (
    <div className="mb-3">
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
      {!collapsed && <div className="space-y-0.5">{powerList}</div>}
    </div>
  );
}
