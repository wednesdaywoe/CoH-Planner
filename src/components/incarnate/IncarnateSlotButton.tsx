/**
 * IncarnateSlotButton component - displays a single incarnate slot
 */

import type { IncarnateSlotId, SelectedIncarnatePower } from '@/types';
import { INCARNATE_SLOT_COLORS, INCARNATE_TIER_COLORS } from '@/types';
import { getIncarnateSlotIconPath, getIncarnateIconPath } from '@/data';

interface IncarnateSlotButtonProps {
  slotId: IncarnateSlotId;
  slotName: string;
  selectedPower: SelectedIncarnatePower | null;
  disabled?: boolean;
  onClick: () => void;
}

export function IncarnateSlotButton({
  slotId,
  slotName,
  selectedPower,
  disabled = false,
  onClick,
}: IncarnateSlotButtonProps) {
  const slotColor = INCARNATE_SLOT_COLORS[slotId];
  const tierColor = selectedPower ? INCARNATE_TIER_COLORS[selectedPower.tier] : slotColor;

  // Get icon path
  const iconPath = selectedPower
    ? getIncarnateIconPath(slotId, selectedPower.icon)
    : getIncarnateSlotIconPath(slotId);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
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
    </button>
  );
}
