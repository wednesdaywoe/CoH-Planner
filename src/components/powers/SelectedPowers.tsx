/**
 * SelectedPowers component - shows powers that have been selected
 * Renders inline within a column (column headers are in PlannerPage)
 */

import { useBuildStore, useUIStore } from '@/stores';
import type { PowerCategory } from '@/stores';
import type { SelectedPower } from '@/types';
import { DraggableSlotGhost } from './DraggableSlotGhost';

interface SelectedPowersProps {
  category: 'primary' | 'secondary';
}

export function SelectedPowers({ category }: SelectedPowersProps) {
  const build = useBuildStore((s) => s.build);
  const removePower = useBuildStore((s) => s.removePower);
  const addSlot = useBuildStore((s) => s.addSlot);
  const removeSlot = useBuildStore((s) => s.removeSlot);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);
  const lockInfoPanel = useUIStore((s) => s.lockInfoPanel);
  const infoPanelLocked = useUIStore((s) => s.infoPanel.locked);
  const openEnhancementPicker = useUIStore((s) => s.openEnhancementPicker);

  const selection = category === 'primary' ? build.primary : build.secondary;
  const powers = selection.powers;
  const powersetId = selection.id || '';

  const handleRemove = (powerName: string) => {
    removePower(category as PowerCategory, powerName);
  };

  const handleAddSlots = (powerName: string, count: number) => {
    // Add multiple slots
    for (let i = 0; i < count; i++) {
      addSlot(powerName);
    }
  };

  const handleRemoveSlot = (powerName: string, slotIndex: number) => {
    removeSlot(powerName, slotIndex);
  };

  const handleRemoveAllSlots = (powerName: string, totalSlots: number) => {
    // Remove all slots except the first one (which is free)
    // Remove from the end to avoid index shifting issues
    for (let i = totalSlots - 1; i > 0; i--) {
      removeSlot(powerName, i);
    }
  };

  const handlePowerHover = (power: SelectedPower) => {
    if (powersetId && !infoPanelLocked) {
      setInfoPanelContent({
        type: 'power',
        powerName: power.name,
        powerSet: powersetId,
      });
    }
  };

  const handlePowerRightClick = (e: React.MouseEvent, power: SelectedPower) => {
    e.preventDefault();
    if (powersetId) {
      lockInfoPanel({
        type: 'power',
        powerName: power.name,
        powerSet: powersetId,
      });
    }
  };

  if (powers.length === 0) {
    return (
      <div className="text-xs text-slate-500 italic py-4 text-center">
        {selection.name ? 'Select powers from the available list' : 'Select a powerset first'}
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {powers.map((power) => (
        <SelectedPowerRow
          key={power.name}
          power={power}
          powersetId={powersetId}
          onRemove={() => handleRemove(power.name)}
          onAddSlots={(count) => handleAddSlots(power.name, count)}
          onRemoveSlot={(index) => handleRemoveSlot(power.name, index)}
          onRemoveAllSlots={() => handleRemoveAllSlots(power.name, power.slots.length)}
          onOpenPicker={(slotIndex) => openEnhancementPicker(power.name, powersetId, slotIndex)}
          onHover={() => handlePowerHover(power)}
          onRightClick={(e) => handlePowerRightClick(e, power)}
        />
      ))}
    </div>
  );
}

interface SelectedPowerRowProps {
  power: SelectedPower;
  powersetId: string;
  onRemove: () => void;
  onAddSlots: (count: number) => void;
  onRemoveSlot: (slotIndex: number) => void;
  onRemoveAllSlots: () => void;
  onOpenPicker: (slotIndex: number) => void;
  onHover: () => void;
  onRightClick: (e: React.MouseEvent) => void;
}

/**
 * Compact power row with enhancement slots inline
 */
function SelectedPowerRow({
  power,
  onRemove,
  onAddSlots,
  onRemoveSlot,
  onRemoveAllSlots,
  onOpenPicker,
  onHover,
  onRightClick,
}: SelectedPowerRowProps) {
  const handleSlotClick = (index: number) => {
    // Open enhancement picker for any slot (empty or filled)
    onOpenPicker(index);
  };

  const handleSlotRightClick = (e: React.MouseEvent, index: number, hasEnhancement: boolean) => {
    e.preventDefault();

    // Shift+right-click on empty slot removes all slots (except first)
    if (e.shiftKey && !hasEnhancement && power.slots.length > 1) {
      onRemoveAllSlots();
      return;
    }

    // Regular right-click to remove slot (if not first slot)
    if (index > 0) {
      onRemoveSlot(index);
    }
  };

  return (
    <div
      className="flex items-center gap-1 px-1 py-0.5 bg-slate-800 border border-slate-700 rounded-sm hover:border-slate-600 group"
      onMouseEnter={onHover}
    >
      {/* Power icon and name - right-click to lock info panel */}
      <div
        className="flex items-center gap-1 flex-1 min-w-0 cursor-default"
        onContextMenu={onRightClick}
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

      {/* Enhancement slots - fixed width container to prevent layout shift */}
      <div className="flex gap-px justify-start items-center flex-shrink-0" style={{ width: '154px' }}>
        {power.slots.map((slot, index) => (
          <div
            key={index}
            onClick={() => handleSlotClick(index)}
            onContextMenu={(e) => handleSlotRightClick(e, index, !!slot)}
            className={`
              w-5 h-5 rounded-full border flex items-center justify-center
              text-[8px] font-semibold cursor-pointer transition-transform hover:scale-110
              ${
                slot
                  ? 'border-transparent bg-transparent'
                  : 'border-slate-600 bg-slate-700/50 text-slate-500 hover:border-blue-500 hover:bg-slate-600'
              }
            `}
            title={
              slot
                ? `Slot ${index + 1}: ${slot.name || 'Enhancement'}${index > 0 ? ' (right-click to remove slot)' : ''}`
                : `Empty slot ${index + 1} - click to add enhancement${index > 0 ? ', right-click to remove, shift+right-click to remove all' : ''}`
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
              <span className="text-slate-400">+</span>
            )}
          </div>
        ))}

        {/* Draggable ghost slot for adding more */}
        <DraggableSlotGhost
          powerName={power.name}
          currentSlots={power.slots.length}
          maxSlots={power.maxSlots}
          onAddSlots={onAddSlots}
        />
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="text-slate-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 px-1"
        title="Remove power"
      >
        ✕
      </button>
    </div>
  );
}
