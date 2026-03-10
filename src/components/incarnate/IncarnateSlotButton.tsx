/**
 * IncarnateSlotButton component - displays a single incarnate slot
 *
 * Left-click opens the picker. Right-click toggles active/inactive
 * for stat-granting slots (Alpha, Destiny, Hybrid, Interface).
 * Inactive slots appear dimmed with a gray indicator dot.
 */

import type { IncarnateSlotId, SelectedIncarnatePower, ToggleableIncarnateSlot } from '@/types';
import { getIncarnateSlotIconPath, getPowerIconPath, getSlotColor, getTierColor, isSlotToggleable } from '@/data';
import { useLongPress } from '@/hooks';

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
  const slotColor = getSlotColor(slotId);
  const tierColor = selectedPower ? getTierColor(selectedPower.tier) : slotColor;
  const canToggle = isSlotToggleable(slotId) && selectedPower !== null;
  const dimmed = canToggle && !isActive;

  // Get icon path
  const iconPath = selectedPower
    ? getPowerIconPath(selectedPower.icon)
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

  const handleContextMenu = (e: React.MouseEvent) => {
    if (canToggle && onToggleActive) {
      e.preventDefault();
      onToggleActive(slotId as ToggleableIncarnateSlot);
    }
  };

  const longPressHandlers = useLongPress({
    onLongPress: () => {
      if (canToggle && onToggleActive) {
        onToggleActive(slotId as ToggleableIncarnateSlot);
      }
    },
    onTap: onClick,
  });

  return (
    <button
      onClick={onClick}
      onContextMenu={handleContextMenu}
      {...longPressHandlers}
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
        ${dimmed ? 'opacity-50' : ''}
      `}
      style={{
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: disabled ? '#4B5563' : dimmed ? '#4B5563' : tierColor,
        boxShadow: disabled || dimmed ? 'none' : `0 0 8px ${tierColor}40`,
      }}
      title={
        selectedPower
          ? `${selectedPower.displayName} (${selectedPower.treeName})${canToggle ? '\nRight-click or long-press to toggle on/off' : ''}`
          : `Select ${slotName} power`
      }
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-md overflow-hidden"
        style={{
          boxShadow: dimmed ? 'none' : `0 0 4px ${tierColor}60`,
          filter: dimmed ? 'grayscale(100%)' : 'none',
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
          style={{ color: dimmed ? '#6B7280' : slotColor }}
        >
          {slotName}
        </div>
        {selectedPower && (
          <div className={`text-[9px] truncate max-w-[76px] ${dimmed ? 'text-gray-600' : 'text-gray-400'}`}>
            {selectedPower.treeName}
          </div>
        )}
      </div>

      {/* Tier indicator */}
      {selectedPower && (
        <div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
          style={{ backgroundColor: dimmed ? '#4B5563' : tierColor }}
          title={selectedPower.tier.charAt(0).toUpperCase() + selectedPower.tier.slice(1)}
        />
      )}

      {/* Active state indicator for toggleable slots */}
      {canToggle && (
        <div
          className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
            isActive ? 'bg-green-400' : 'bg-gray-600'
          }`}
        />
      )}
    </button>
  );
}
