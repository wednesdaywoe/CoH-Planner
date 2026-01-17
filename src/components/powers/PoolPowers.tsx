/**
 * PoolPowers component - displays power pool selection and selected pool powers
 * Renders inline within the Pool Powers column (column headers are in PlannerPage)
 */

import { useBuildStore, useUIStore } from '@/stores';
import { getAllPowerPools, getPowerPool } from '@/data';
import { Select } from '@/components/ui';
import { DraggableSlotGhost } from './DraggableSlotGhost';
import type { Power, SelectedPower } from '@/types';

export function PoolPowers() {
  const build = useBuildStore((s) => s.build);
  const addPool = useBuildStore((s) => s.addPool);
  const removePool = useBuildStore((s) => s.removePool);
  const addPower = useBuildStore((s) => s.addPower);
  const removePower = useBuildStore((s) => s.removePower);
  const addSlot = useBuildStore((s) => s.addSlot);
  const removeSlot = useBuildStore((s) => s.removeSlot);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);
  const lockInfoPanel = useUIStore((s) => s.lockInfoPanel);
  const infoPanelLocked = useUIStore((s) => s.infoPanel.locked);

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
    if (!infoPanelLocked) {
      setInfoPanelContent({
        type: 'power',
        powerName: power.name,
        powerSet: poolId,
      });
    }
  };

  const handlePowerRightClick = (e: React.MouseEvent, power: Power | SelectedPower, poolId: string) => {
    e.preventDefault();
    lockInfoPanel({
      type: 'power',
      powerName: power.name,
      powerSet: poolId,
    });
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

      {/* Empty state */}
      {pools.length === 0 && (
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
          <div key={poolSelection.id} className="bg-slate-800/50 rounded p-1.5">
            {/* Pool header */}
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
                {pool.name}
              </h4>
              <button
                onClick={() => handleRemovePool(poolSelection.id)}
                className="text-xs text-slate-500 hover:text-slate-300"
                title="Remove pool"
              >
                ✕
              </button>
            </div>

            {/* Selected powers */}
            {poolSelection.powers.length > 0 && (
              <div className="space-y-0.5 mb-1">
                {poolSelection.powers.map((power) => (
                    <div
                      key={power.name}
                      className="flex items-center gap-1 px-1 py-0.5 bg-slate-800 border border-slate-700 rounded-sm hover:border-slate-600 group"
                      onMouseEnter={() => handlePowerHover(power, poolSelection.id)}
                    >
                      {/* Power icon and name - right-click to lock info panel */}
                      <div
                        className="flex items-center gap-1 flex-1 min-w-0 cursor-default"
                        onContextMenu={(e) => handlePowerRightClick(e, power, poolSelection.id)}
                        title="Right-click to lock power info"
                      >
                        <img
                          src={power.icon || '/img/Unknown.png'}
                          alt=""
                          className="w-4 h-4 rounded-sm flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/img/Unknown.png';
                          }}
                        />
                        <span className="text-xs text-slate-200 truncate">
                          {power.name}
                        </span>
                      </div>
                      {/* Enhancement slots */}
                      <div className="flex gap-px">
                        {power.slots.map((slot, index) => (
                          <div
                            key={index}
                            onClick={() => console.log('TODO: Open enhancement picker')}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              if (index > 0) handleRemoveSlot(power.name, index);
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
                                ? `${slot.name || 'Enhancement'}${index > 0 ? ' (right-click to remove slot)' : ''}`
                                : `Empty slot${index > 0 ? ' (right-click to remove)' : ''}`
                            }
                          >
                            {slot ? (
                              <img
                                src={slot.icon || '/img/Unknown.png'}
                                alt=""
                                className="w-full h-full rounded-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/img/Unknown.png';
                                }}
                              />
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
                  ))}
              </div>
            )}

            {/* Available powers */}
            {availablePowers.length > 0 && (
              <div className="border-t border-slate-700 pt-1 mt-1">
                <div className="flex flex-wrap gap-0.5">
                  {availablePowers.map((power) => (
                    <button
                      key={power.name}
                      onClick={() => handleSelectPower(poolSelection.id, power)}
                      onMouseEnter={() => handlePowerHover(power, poolSelection.id)}
                      onContextMenu={(e) => handlePowerRightClick(e, power, poolSelection.id)}
                      className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-700 border border-slate-600 rounded-sm text-[10px] text-slate-300 hover:border-blue-500 hover:bg-slate-600 transition-colors"
                      title="Right-click to lock power info"
                    >
                      <img
                        src={power.icon || '/img/Unknown.png'}
                        alt=""
                        className="w-3 h-3 rounded-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/img/Unknown.png';
                        }}
                      />
                      {power.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
