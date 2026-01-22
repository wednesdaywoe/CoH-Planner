/**
 * IncarnateSlotButton component - displays a single incarnate slot
 */

import type { IncarnateSlotId, SelectedIncarnatePower, ToggleableIncarnateSlot } from '@/types';
import { INCARNATE_SLOT_COLORS, INCARNATE_TIER_COLORS } from '@/types';
import { getIncarnateSlotIconPath, getIncarnateIconPath, isToggleableIncarnateSlot } from '@/data';

interface IncarnateSlotButtonProps {
  slotId: IncarnateSlotId;
  slotName: string;
  selectedPower: SelectedIncarnatePower | null;
  disabled?: boolean;
  isActive?: boolean;
  onToggleActive?: (slotId: ToggleableIncarnateSlot) => void;
  onHover?: (slotId: IncarnateSlotId, powerId: string | null) => void;
  onClick: () => void;
}

export function IncarnateSlotButton({
  slotId,
  slotName,
  selectedPower,
  disabled = false,
  isActive = true,
  onToggleActive,
  onHover,
  onClick,
}: IncarnateSlotButtonProps) {
  const slotColor = INCARNATE_SLOT_COLORS[slotId];
  const tierColor = selectedPower ? INCARNATE_TIER_COLORS[selectedPower.tier] : slotColor;
  const canToggle = isToggleableIncarnateSlot(slotId) && selectedPower !== null;

  // Get icon path
  const iconPath = selectedPower
    ? getIncarnateIconPath(slotId, selectedPower.icon)
    : getIncarnateSlotIconPath(slotId);

  const handleMouseEnter = () => {
    if (selectedPower && onHover) {
      onHover(slotId, selectedPower.powerId);
    }
  };

  const handleMouseLeave = () => {
    if (onHover) {
      onHover(slotId, null);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative flex flex-col items-center gap-1 p-2 rounded-lg
        transition-all duration-200 min-w-[80px]
        ${
          disabled
            ? 'opacity-40 cursor-not-allowed bg-gray-800/30'
            : 'hover:bg-gray-700/50 cursor-pointer bg-gray-800/50 hover:scale-105'
        }
      `}
      style={{
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: disabled ? '#4B5563' : tierColor,
        boxShadow: disabled ? 'none' : `0 0 8px ${tierColor}40`,
      }}
      title={selectedPower ? `${selectedPower.displayName} (${selectedPower.treeName})` : `Select ${slotName} power`}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-md overflow-hidden"
        style={{
          boxShadow: `0 0 4px ${tierColor}60`,
        }}
      >
        <img
          src={iconPath}
          alt={selectedPower ? selectedPower.displayName : slotName}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/img/Unknown.png';
          }}
        />
      </div>

      {/* Label */}
      <div className="text-center w-full">
        <div
          className="text-[10px] font-semibold uppercase tracking-wide"
          style={{ color: slotColor }}
        >
          {slotName}
        </div>
        {selectedPower && (
          <div className="text-[9px] text-gray-400 truncate max-w-[76px]">
            {selectedPower.treeName}
          </div>
        )}
      </div>

      {/* Tier indicator */}
      {selectedPower && (
        <div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
          style={{ backgroundColor: tierColor }}
          title={selectedPower.tier.charAt(0).toUpperCase() + selectedPower.tier.slice(1)}
        />
      )}

      {/* Active toggle for toggleable slots */}
      {canToggle && onToggleActive && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleActive(slotId as ToggleableIncarnateSlot);
          }}
          className={`
            absolute -bottom-1 left-1/2 -translate-x-1/2
            w-8 h-3 rounded-full transition-colors duration-200
            ${isActive ? 'bg-green-500' : 'bg-gray-600'}
          `}
          title={isActive ? 'Active - click to disable' : 'Inactive - click to enable'}
        >
          <span
            className={`
              absolute top-0.5 w-2 h-2 rounded-full bg-white
              transition-transform duration-200
              ${isActive ? 'translate-x-5' : 'translate-x-0.5'}
            `}
          />
        </button>
      )}
    </button>
  );
}
