/**
 * PowerCard component - displays a selected power with its enhancement slots
 */

import { useBuildStore, useUIStore } from '@/stores';
import type { SelectedPower } from '@/types';
import type { PowerCategory } from '@/stores';
import { getPowerIconPath } from '@/data';
import { PowerSlot } from './PowerSlot';
import { Badge } from '@/components/ui';

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
  const openEnhancementPicker = useUIStore((s) => s.openEnhancementPicker);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);

  const canAddSlot = power.slots.length < power.maxSlots;

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
      className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors"
      onMouseEnter={handlePowerHover}
    >
      {/* Power header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={getPowerIconPath(powersetName, power.icon)}
            alt=""
            className="w-8 h-8 rounded flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/img/Unknown.png';
            }}
          />
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-white truncate">{power.name}</h4>
            <div className="flex items-center gap-1.5">
              {showLevel && (
                <span className="text-xs text-gray-400">Lvl {power.level}</span>
              )}
              <PowerTypeBadge powerType={power.powerType} />
            </div>
          </div>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-gray-500 hover:text-red-500 transition-colors p-1"
            title="Remove power"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Enhancement slots */}
      <div className="flex gap-1 flex-wrap">
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

      {/* Slot count indicator */}
      <div className="mt-2 text-xs text-gray-500">
        {power.slots.length}/{power.maxSlots} slots
      </div>
    </div>
  );
}

interface PowerTypeBadgeProps {
  powerType: string;
}

function PowerTypeBadge({ powerType }: PowerTypeBadgeProps) {
  const variant = getTypeVariant(powerType);
  const label = getTypeLabel(powerType);

  return (
    <Badge variant={variant} size="sm">
      {label}
    </Badge>
  );
}

function getTypeVariant(powerType: string): 'default' | 'primary' | 'success' | 'warning' | 'purple' {
  switch (powerType.toLowerCase()) {
    case 'click':
      return 'primary';
    case 'toggle':
      return 'warning';
    case 'auto':
      return 'success';
    case 'passive':
      return 'purple';
    default:
      return 'default';
  }
}

function getTypeLabel(powerType: string): string {
  switch (powerType.toLowerCase()) {
    case 'click':
      return 'Click';
    case 'toggle':
      return 'Toggle';
    case 'auto':
      return 'Auto';
    case 'passive':
      return 'Passive';
    default:
      return powerType;
  }
}
