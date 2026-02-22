/**
 * IncarnateSlotGrid component - 2x3 grid of incarnate slots for embedding in StatsDashboard
 */

import type { IncarnateSlotId, SelectedIncarnatePower, IncarnateActiveState, ToggleableIncarnateSlot } from '@/types';
import { INCARNATE_SLOT_ORDER } from '@/types';
import { getIncarnateIconPath, getAllIncarnateSlots, getSlotColor, getTierColor, isSlotToggleable } from '@/data';
import { Tooltip } from '@/components/ui';

interface IncarnateSlotGridProps {
  incarnates: Record<IncarnateSlotId, SelectedIncarnatePower | null>;
  disabled: boolean;
  onSlotClick: (slotId: IncarnateSlotId) => void;
  incarnateActive: IncarnateActiveState;
  onToggleActive: (slotId: ToggleableIncarnateSlot) => void;
}

export function IncarnateSlotGrid({ incarnates, disabled, onSlotClick, incarnateActive, onToggleActive }: IncarnateSlotGridProps) {
  const slots = getAllIncarnateSlots();

  return (
    <div className="grid grid-cols-3 gap-2">
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

  const iconPath = selectedPower ? getIncarnateIconPath(slotId, selectedPower.icon) : null;

  const tooltipContent = selectedPower ? (
    <div>
      <div className="font-semibold text-white">{selectedPower.displayName}</div>
      <div className="text-xs text-gray-400">{selectedPower.treeName}</div>
      <div className="text-xs mt-1" style={{ color: tierColor }}>
        {selectedPower.tier.charAt(0).toUpperCase() + selectedPower.tier.slice(1)}
      </div>
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
        disabled={disabled}
        className={`
          relative flex items-center gap-1.5 p-1.5 rounded-md
          transition-all duration-200 w-full
          ${
            disabled
              ? 'opacity-40 cursor-not-allowed bg-gray-800/30'
              : selectedPower
                ? 'bg-gray-800/60 hover:bg-gray-700/60 cursor-pointer'
                : 'bg-gray-800/30 hover:bg-gray-700/40 cursor-pointer border-dashed'
          }
        `}
        style={{
          borderWidth: '1px',
          borderStyle: selectedPower ? 'solid' : 'dashed',
          borderColor: disabled ? '#374151' : selectedPower ? tierColor : slotColor + '60',
        }}
      >
        {/* Icon or empty circle */}
        {selectedPower && iconPath ? (
          <div className="w-7 h-7 rounded overflow-hidden flex-shrink-0">
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
            className="w-7 h-7 rounded-full flex-shrink-0"
            style={{
              backgroundColor: '#1f2937',
              border: `2px solid ${slotColor}`,
              opacity: disabled ? 0.4 : 0.7,
            }}
          />
        )}

        {/* Label */}
        <div className="flex-1 min-w-0 text-left">
          <div
            className="text-[9px] font-medium uppercase tracking-wide truncate"
            style={{ color: selectedPower ? '#d1d5db' : slotColor }}
          >
            {slotName}
          </div>
          {selectedPower ? (
            <div className="text-[8px] text-gray-500 truncate">
              {selectedPower.treeName}
            </div>
          ) : (
            <div className="text-[8px] text-gray-600 italic">
              Empty
            </div>
          )}
        </div>

        {/* Tier indicator for selected powers */}
        {selectedPower && (
          <div
            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: tierColor }}
          />
        )}

        {/* Active toggle for toggleable slots */}
        {canToggle && onToggleActive && (
          <div
            role="switch"
            aria-checked={isActive}
            onClick={(e) => {
              e.stopPropagation();
              onToggleActive(slotId as ToggleableIncarnateSlot);
            }}
            className={`
              absolute bottom-[3px] right-[3px]
              w-5 h-2.5 rounded-full cursor-pointer relative
              transition-colors duration-200
              ${isActive ? 'bg-green-500' : 'bg-gray-600'}
            `}
            title={isActive ? 'Active - click to disable' : 'Inactive - click to enable'}
          >
            <span
              className={`
                absolute top-[2px] left-[2px] w-1.5 h-1.5 rounded-full bg-white shadow-sm
                transition-transform duration-200
                ${isActive ? 'translate-x-[10px]' : 'translate-x-0'}
              `}
            />
          </div>
        )}
      </button>
    </Tooltip>
  );
}
