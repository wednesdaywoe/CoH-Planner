/**
 * IncarnateSlotGrid component - 2x3 grid of incarnate slots for embedding in StatsDashboard
 */

import type { IncarnateSlotId, SelectedIncarnatePower, IncarnateActiveState, ToggleableIncarnateSlot } from '@/types';
import { INCARNATE_SLOT_ORDER } from '@/types';
import { getPowerIconPath, getAllIncarnateSlots, getSlotColor, getTierColor, isSlotToggleable } from '@/data';
import { Tooltip } from '@/components/ui';
import { useLongPress } from '@/hooks';
import { IncarnateEffectsTooltip } from './IncarnateEffectsTooltip';

interface IncarnateSlotGridProps {
  incarnates: Record<IncarnateSlotId, SelectedIncarnatePower | null>;
  disabled: boolean;
  onSlotClick: (slotId: IncarnateSlotId) => void;
  incarnateActive: IncarnateActiveState;
  onToggleActive: (slotId: ToggleableIncarnateSlot) => void;
  horizontal?: boolean;
}

export function IncarnateSlotGrid({ incarnates, disabled, onSlotClick, incarnateActive, onToggleActive, horizontal }: IncarnateSlotGridProps) {
  const slots = getAllIncarnateSlots();

  return (
    <div className={horizontal ? "grid grid-cols-6 gap-1" : "grid grid-cols-3 gap-1"}>
      {INCARNATE_SLOT_ORDER.map((slotId) => {
        const slot = slots.find((s) => s.id === slotId);
        if (!slot) return null;

        const selectedPower = incarnates?.[slotId] || null;

        return (
          <IncarnateSlotMini
            key={slotId}
            slotId={slotId}
            slotName={slot.displayName}
            selectedPower={selectedPower}
            disabled={disabled}
            onClick={() => onSlotClick(slotId)}
            isActive={slotId in incarnateActive ? incarnateActive[slotId as keyof IncarnateActiveState] : true}
            onToggleActive={onToggleActive}
          />
        );
      })}
    </div>
  );
}

interface IncarnateSlotMiniProps {
  slotId: IncarnateSlotId;
  slotName: string;
  selectedPower: SelectedIncarnatePower | null;
  disabled: boolean;
  onClick: () => void;
  isActive?: boolean;
  onToggleActive?: (slotId: ToggleableIncarnateSlot) => void;
}

function IncarnateSlotMini({
  slotId,
  slotName,
  selectedPower,
  disabled,
  onClick,
  isActive = true,
  onToggleActive,
}: IncarnateSlotMiniProps) {
  const slotColor = getSlotColor(slotId);
  const tierColor = selectedPower ? getTierColor(selectedPower.tier) : slotColor;
  const canToggle = isSlotToggleable(slotId) && selectedPower !== null;
  const dimmed = canToggle && !isActive;

  const iconPath = selectedPower ? getPowerIconPath(selectedPower.icon) : null;

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

  const tooltipContent = selectedPower ? (
    <div className="max-w-[300px]">
      <div className="font-semibold text-white">{selectedPower.displayName}</div>
      <div className="text-xs text-gray-400">{selectedPower.treeName}</div>
      <div className="text-xs mt-1" style={{ color: tierColor }}>
        {selectedPower.tier.charAt(0).toUpperCase() + selectedPower.tier.slice(1)}
      </div>
      {canToggle && (
        <div className="text-[10px] text-gray-500 mt-1">Right-click or long-press to toggle</div>
      )}
      <IncarnateEffectsTooltip slotId={slotId} powerId={selectedPower.powerId} />
    </div>
  ) : (
    <div>
      <div className="font-semibold" style={{ color: slotColor }}>{slotName}</div>
      <div className="text-xs text-gray-400">{disabled ? 'Requires Level 50' : 'Click to select'}</div>
    </div>
  );

  return (
    <Tooltip content={tooltipContent}>
      <button
        onClick={onClick}
        onContextMenu={handleContextMenu}
        {...longPressHandlers}
        disabled={disabled}
        className={`
          relative flex items-center justify-center p-1 rounded-md
          transition-all duration-200
          ${
            disabled
              ? 'opacity-40 cursor-not-allowed bg-gray-800/30'
              : selectedPower
                ? 'bg-gray-800/60 hover:bg-gray-700/60 cursor-pointer'
                : 'bg-gray-800/30 hover:bg-gray-700/40 cursor-pointer border-dashed'
          }
          ${dimmed ? 'opacity-50' : ''}
        `}
        style={{
          borderWidth: '1px',
          borderStyle: selectedPower ? 'solid' : 'dashed',
          borderColor: disabled ? '#374151' : dimmed ? '#374151' : selectedPower ? tierColor : slotColor + '60',
        }}
      >
        {/* Icon or letter circle */}
        {selectedPower && iconPath ? (
          <div
            className="w-7 h-7 rounded overflow-hidden flex-shrink-0"
            style={{ filter: dimmed ? 'grayscale(100%)' : 'none' }}
          >
            <img
              src={iconPath}
              alt={selectedPower.displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/img/Unknown.png';
              }}
            />
          </div>
        ) : (
          <div
            className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: '#1f2937',
              border: `2px solid ${slotColor}`,
              color: slotColor,
              opacity: disabled ? 0.4 : 0.7,
            }}
          >
            {slotName.charAt(0)}
          </div>
        )}

        {/* Tier indicator for selected powers */}
        {selectedPower && (
          <div
            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: dimmed ? '#4B5563' : tierColor }}
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
    </Tooltip>
  );
}
