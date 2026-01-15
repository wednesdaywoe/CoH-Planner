/**
 * AvailablePowers component - shows powers available to select
 */

import { useBuildStore, useUIStore } from '@/stores';
import { getPowerset } from '@/data';
import { PowerColumn, PowerColumnEmpty } from './PowerColumn';
import { Tooltip } from '@/components/ui';
import type { Power } from '@/types';

interface AvailablePowersProps {
  powersetId: string | null;
  category: 'primary' | 'secondary';
  selectedPowerNames: string[];
  onSelectPower: (power: Power) => void;
}

export function AvailablePowers({
  powersetId,
  category,
  selectedPowerNames,
  onSelectPower,
}: AvailablePowersProps) {
  const build = useBuildStore((s) => s.build);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);

  if (!powersetId) {
    return (
      <PowerColumn title={category === 'primary' ? 'Primary Powers' : 'Secondary Powers'}>
        <PowerColumnEmpty message="Select an archetype and powerset" />
      </PowerColumn>
    );
  }

  const powerset = getPowerset(powersetId);
  if (!powerset) {
    return (
      <PowerColumn title={category === 'primary' ? 'Primary Powers' : 'Secondary Powers'}>
        <PowerColumnEmpty message="Powerset not found" />
      </PowerColumn>
    );
  }

  const availablePowers = powerset.powers.filter(
    (p) => p.available <= build.level && p.available >= 0
  );
  const selectedSet = new Set(selectedPowerNames);

  const handlePowerHover = (power: Power) => {
    setInfoPanelContent({
      type: 'power',
      powerName: power.name,
      powerSet: powersetId,
    });
  };

  return (
    <PowerColumn
      title={powerset.name}
      subtitle={`${category === 'primary' ? 'Primary' : 'Secondary'} Powerset`}
    >
      {availablePowers.length === 0 ? (
        <PowerColumnEmpty message="No powers available at this level" />
      ) : (
        <div className="space-y-1">
          {availablePowers.map((power) => {
            const isSelected = selectedSet.has(power.name);

            return (
              <Tooltip
                key={power.name}
                content={<PowerTooltipContent power={power} />}
                position="right"
              >
                <button
                  onClick={() => !isSelected && onSelectPower(power)}
                  onMouseEnter={() => handlePowerHover(power)}
                  disabled={isSelected}
                  className={`
                    w-full flex items-center gap-2 p-2 rounded
                    transition-colors text-left
                    ${
                      isSelected
                        ? 'bg-blue-900/30 border border-blue-600/50 cursor-not-allowed'
                        : 'bg-gray-800 border border-gray-700 hover:border-blue-500 cursor-pointer'
                    }
                  `}
                >
                  <img
                    src={power.icon || '/img/Unknown.png'}
                    alt=""
                    className="w-6 h-6 rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/img/Unknown.png';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-200 truncate">{power.name}</div>
                    <div className="text-xs text-gray-500">
                      Lvl {power.available} • {power.powerType}
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-xs text-blue-400">Selected</span>
                  )}
                </button>
              </Tooltip>
            );
          })}
        </div>
      )}
    </PowerColumn>
  );
}

interface PowerTooltipContentProps {
  power: Power;
}

function PowerTooltipContent({ power }: PowerTooltipContentProps) {
  return (
    <div className="max-w-xs">
      <div className="font-medium text-white">{power.name}</div>
      <div className="text-xs text-gray-400 mb-1">
        Level {power.available} • {power.powerType}
      </div>
      <p className="text-sm text-gray-300">{power.description}</p>
      {power.effects && (
        <div className="mt-2 text-xs text-gray-400">
          {power.effects.recharge && (
            <div>Recharge: {power.effects.recharge}s</div>
          )}
          {power.effects.enduranceCost && (
            <div>End Cost: {power.effects.enduranceCost}</div>
          )}
        </div>
      )}
    </div>
  );
}
