/**
 * PowerCard component - displays a selected power with its enhancement slots
 */

import { useBuildStore, useUIStore } from '@/stores';
import type { SelectedPower } from '@/types';
import type { PowerCategory } from '@/stores';
import { getPowerIconPath } from '@/data';
import { resolvePath } from '@/utils/paths';
import { PowerSlot } from './PowerSlot';
import { Tooltip } from '@/components/ui';

/**
 * Determine if a power should show a toggle switch for stat calculations.
 * This includes:
 * - Toggle powers (always toggleable)
 * - Click powers that buff self (targetType: Self)
 * - Click powers that are PBAoE and affect allies (buffs teammates AND user)
 */
function shouldShowToggle(power: SelectedPower): boolean {
  const powerType = power.powerType?.toLowerCase();
  const targetType = power.targetType?.toLowerCase();
  const effectArea = power.effectArea?.toLowerCase();

  // Toggle powers always show toggle
  if (powerType === 'toggle') {
    return true;
  }

  // Click powers that target self (self-buffs like Build Up, Aim)
  if (powerType === 'click' && targetType === 'self') {
    return true;
  }

  // Click powers that are PBAoE and target allies (like Accelerate Metabolism)
  // These buff the user as well as nearby allies
  if (powerType === 'click' && effectArea === 'pbaoe' && targetType === 'ally') {
    return true;
  }

  return false;
}

interface PowerCardProps {
  power: SelectedPower;
  category: PowerCategory;
  powersetId: string;
  powersetName: string;
  onRemove?: () => void;
  showLevel?: boolean;
}

export function PowerCard({
  power,
  powersetId,
  powersetName,
  onRemove,
  showLevel = true,
}: PowerCardProps) {
  const addSlot = useBuildStore((s) => s.addSlot);
  const clearEnhancement = useBuildStore((s) => s.clearEnhancement);
  const togglePowerActive = useBuildStore((s) => s.togglePowerActive);
  const openEnhancementPicker = useUIStore((s) => s.openEnhancementPicker);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);

  const canAddSlot = power.slots.length < power.maxSlots;
  const showToggle = shouldShowToggle(power);
  const isActive = power.isActive ?? false;

  const handleSlotClick = (slotIndex: number) => {
    openEnhancementPicker(power.name, powersetId, slotIndex);
  };

  const handleSlotRightClick = (slotIndex: number) => {
    if (power.slots[slotIndex]) {
      clearEnhancement(power.name, slotIndex);
    }
  };

  const handlePowerHover = () => {
    setInfoPanelContent({
      type: 'power',
      powerName: power.name,
      powerSet: powersetId,
    });
  };

  const handleAddSlot = () => {
    addSlot(power.name);
  };

  return (
    <div
      className="bg-gray-800 rounded-lg px-3 py-2 border border-gray-700 hover:border-gray-600 transition-colors"
      onMouseEnter={handlePowerHover}
    >
      {/* Row 1: Level · Icon · Name | X button */}
      <div className="flex items-center gap-2 mb-1.5">
        {showLevel && (
          <span className="text-xs text-gray-500 w-6 text-right flex-shrink-0">{power.level}</span>
        )}
        <img
          src={getPowerIconPath(powersetName, power.icon)}
          alt=""
          className="w-6 h-6 rounded flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
          }}
        />
        <h4 className="text-sm font-medium text-white truncate flex-1 min-w-0">{power.name}</h4>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-gray-600 hover:text-red-500 transition-colors flex-shrink-0 -mr-1"
            title="Remove power"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Row 2: Enhancement slots (left) | Toggle (right) */}
      <div className="flex items-center gap-1">
        <div className="flex gap-1 flex-wrap flex-1">
          {power.slots.map((slot, index) => (
            <PowerSlot
              key={index}
              enhancement={slot}
              slotIndex={index}
              onClick={() => handleSlotClick(index)}
              onRightClick={() => handleSlotRightClick(index)}
            />
          ))}
          {canAddSlot && (
            <PowerSlot
              enhancement={null}
              slotIndex={power.slots.length}
              onClick={handleAddSlot}
              isAddButton
            />
          )}
        </div>
        {showToggle && (
          <Tooltip
            content={
              isActive
                ? 'Power active - stats included in calculations'
                : 'Power inactive - click to include in stat calculations'
            }
          >
            <button
              onClick={() => togglePowerActive(power.name)}
              className={`
                flex-shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium transition-all
                ${
                  isActive
                    ? 'bg-green-900/50 text-green-400 border border-green-700'
                    : 'bg-gray-700/50 text-gray-500 border border-gray-600 hover:text-gray-300'
                }
              `}
            >
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  isActive ? 'bg-green-400' : 'bg-gray-600'
                }`}
              />
              {isActive ? 'ON' : 'OFF'}
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

