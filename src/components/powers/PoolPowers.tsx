/**
 * PoolPowers component - displays power pool selection and selected pool powers
 */

import { useBuildStore, useUIStore } from '@/stores';
import { getAllPowerPools, getPowerPool } from '@/data';
import { PowerColumn, PowerColumnEmpty } from './PowerColumn';
import { PowerCard } from './PowerCard';
import { Button, Select, Tooltip } from '@/components/ui';
import type { Power } from '@/types';

export function PoolPowers() {
  const build = useBuildStore((s) => s.build);
  const addPool = useBuildStore((s) => s.addPool);
  const removePool = useBuildStore((s) => s.removePool);
  const addPower = useBuildStore((s) => s.addPower);
  const removePower = useBuildStore((s) => s.removePower);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);

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
    // SelectedPower extends Power, so we spread all Power properties
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

  return (
    <PowerColumn
      title="Power Pools"
      subtitle={`${pools.length}/4 pools`}
      headerAction={
        canAddPool && availablePoolOptions.length > 0 ? (
          <Select
            options={[{ value: '', label: 'Add Pool...' }, ...availablePoolOptions]}
            value=""
            onChange={(e) => handleAddPool(e.target.value)}
            className="w-32 text-xs"
          />
        ) : undefined
      }
    >
      {pools.length === 0 ? (
        <PowerColumnEmpty
          message="No power pools selected"
          action={
            availablePoolOptions.length > 0 && (
              <Select
                options={[{ value: '', label: 'Select a pool...' }, ...availablePoolOptions]}
                value=""
                onChange={(e) => handleAddPool(e.target.value)}
                className="w-40"
              />
            )
          }
        />
      ) : (
        <div className="space-y-4">
          {pools.map((poolSelection) => {
            const pool = getPowerPool(poolSelection.id);
            if (!pool) return null;

            const selectedPowerNames = new Set(poolSelection.powers.map((p) => p.name));
            const availablePowers = pool.powers.filter(
              (p) => p.available <= build.level && !selectedPowerNames.has(p.name)
            );

            return (
              <div key={poolSelection.id} className="bg-gray-800/50 rounded p-2">
                {/* Pool header */}
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-200">{pool.name}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePool(poolSelection.id)}
                  >
                    Remove
                  </Button>
                </div>

                {/* Selected powers */}
                {poolSelection.powers.length > 0 && (
                  <div className="space-y-2 mb-2">
                    {poolSelection.powers.map((power) => (
                      <PowerCard
                        key={power.name}
                        power={power}
                        category="pool"
                        powersetId={poolSelection.id}
                        onRemove={() => handleRemovePower(power.name)}
                      />
                    ))}
                  </div>
                )}

                {/* Available powers */}
                {availablePowers.length > 0 && (
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="text-xs text-gray-500 mb-1">Available:</div>
                    <div className="flex flex-wrap gap-1">
                      {availablePowers.map((power) => (
                        <Tooltip
                          key={power.name}
                          content={power.description}
                          position="top"
                        >
                          <button
                            onClick={() => handleSelectPower(poolSelection.id, power)}
                            onMouseEnter={() =>
                              setInfoPanelContent({
                                type: 'power',
                                powerName: power.name,
                                powerSet: poolSelection.id,
                              })
                            }
                            className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded text-xs text-gray-300 hover:bg-gray-600 transition-colors"
                          >
                            <img
                              src={power.icon || '/img/Unknown.png'}
                              alt=""
                              className="w-4 h-4 rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/img/Unknown.png';
                              }}
                            />
                            {power.name}
                          </button>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </PowerColumn>
  );
}
