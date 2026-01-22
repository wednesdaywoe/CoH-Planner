/**
 * SelectedPowers component - shows powers that have been selected
 * Renders inline within a column (column headers are in PlannerPage)
 */

import { useBuildStore, useUIStore } from '@/stores';
import type { PowerCategory } from '@/stores';
import type { SelectedPower } from '@/types';
import { getPowerIconPath } from '@/data';
import { resolvePath } from '@/utils/paths';
import { DraggableSlotGhost } from './DraggableSlotGhost';
import { SlottedEnhancementIcon } from './SlottedEnhancementIcon';
import { Tooltip } from '@/components/ui';

/**
 * Determine if a power should show a toggle switch for stat calculations.
 * - Toggle powers (always)
 * - Click powers that target self (Build Up, Aim, Hasten, etc.)
 */
function shouldShowToggle(power: SelectedPower): boolean {
  const powerType = power.powerType?.toLowerCase();
  const targetType = power.targetType?.toLowerCase();
  const shortHelp = power.shortHelp?.toLowerCase() || '';

  // Toggle powers always show toggle
  if (powerType === 'toggle') {
    return true;
  }

  // Click powers that target self (self-buffs)
  // Check both targetType field and shortHelp text (pool powers often lack targetType)
  if (powerType === 'click') {
    if (targetType === 'self') return true;
    if (shortHelp.startsWith('self ') || shortHelp.includes('self +')) return true;
  }

  return false;
}

interface SelectedPowersProps {
  category: 'primary' | 'secondary';
}

export function SelectedPowers({ category }: SelectedPowersProps) {
  const build = useBuildStore((s) => s.build);
  const removePower = useBuildStore((s) => s.removePower);
  const addSlot = useBuildStore((s) => s.addSlot);
  const removeSlot = useBuildStore((s) => s.removeSlot);
  const clearEnhancement = useBuildStore((s) => s.clearEnhancement);
  const togglePowerActive = useBuildStore((s) => s.togglePowerActive);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);
  const clearInfoPanel = useUIStore((s) => s.clearInfoPanel);
  const lockInfoPanel = useUIStore((s) => s.lockInfoPanel);
  const unlockInfoPanel = useUIStore((s) => s.unlockInfoPanel);
  const infoPanelLocked = useUIStore((s) => s.infoPanel.locked);
  const lockedContent = useUIStore((s) => s.infoPanel.lockedContent);
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
    // Always update hover content - tooltip uses this even when panel is locked
    // Use power.powerSet to ensure we look up from the correct powerset
    const powerPowerSet = power.powerSet || powersetId;
    if (powerPowerSet) {
      setInfoPanelContent({
        type: 'power',
        powerName: power.name,
        powerSet: powerPowerSet,
      });
    }
  };

  const handlePowerLeave = () => {
    // Clear content when leaving power area - hides the tooltip
    clearInfoPanel();
  };

  const handleEnhancementHover = (powerName: string, slotIndex: number) => {
    // Show enhancement info in tooltip
    setInfoPanelContent({
      type: 'slotted-enhancement',
      powerName,
      slotIndex,
    });
  };

  const handleClearEnhancement = (powerName: string, slotIndex: number) => {
    clearEnhancement(powerName, slotIndex);
  };

  const handlePowerRightClick = (e: React.MouseEvent, power: SelectedPower) => {
    e.preventDefault();
    // Use power.powerSet to ensure we look up from the correct powerset
    const powerPowerSet = power.powerSet || powersetId;
    if (!powerPowerSet) return;

    // If already locked to this power, unlock; otherwise lock to this power
    if (infoPanelLocked && lockedContent?.type === 'power' && lockedContent.powerName === power.name) {
      unlockInfoPanel();
    } else {
      lockInfoPanel({
        type: 'power',
        powerName: power.name,
        powerSet: powerPowerSet,
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
      {powers.map((power) => {
        // Check if this power is the one locked in the info panel
        const isLocked = infoPanelLocked &&
          lockedContent?.type === 'power' &&
          lockedContent.powerName === power.name;

        return (
          <SelectedPowerRow
            key={power.name}
            power={power}
            powersetId={powersetId}
            powersetName={selection.name}
            isLocked={isLocked}
            onRemove={() => handleRemove(power.name)}
            onAddSlots={(count) => handleAddSlots(power.name, count)}
            onRemoveSlot={(index) => handleRemoveSlot(power.name, index)}
            onRemoveAllSlots={() => handleRemoveAllSlots(power.name, power.slots.length)}
            onClearEnhancement={(index) => handleClearEnhancement(power.name, index)}
            onOpenPicker={(slotIndex) => openEnhancementPicker(power.name, powersetId, slotIndex)}
            onHover={() => handlePowerHover(power)}
            onLeave={handlePowerLeave}
            onEnhancementHover={(index) => handleEnhancementHover(power.name, index)}
            onRightClick={(e) => handlePowerRightClick(e, power)}
            onToggle={() => togglePowerActive(power.name)}
          />
        );
      })}
    </div>
  );
}

interface SelectedPowerRowProps {
  power: SelectedPower;
  powersetId: string;
  powersetName: string;
  isLocked: boolean;
  onRemove: () => void;
  onAddSlots: (count: number) => void;
  onRemoveSlot: (slotIndex: number) => void;
  onRemoveAllSlots: () => void;
  onClearEnhancement: (slotIndex: number) => void;
  onOpenPicker: (slotIndex: number) => void;
  onHover: () => void;
  onLeave: () => void;
  onEnhancementHover: (slotIndex: number) => void;
  onRightClick: (e: React.MouseEvent) => void;
  onToggle: () => void;
}

/**
 * Compact power row with enhancement slots inline
 */
function SelectedPowerRow({
  power,
  powersetName,
  isLocked,
  onRemove,
  onAddSlots,
  onRemoveSlot,
  onRemoveAllSlots,
  onClearEnhancement,
  onOpenPicker,
  onHover,
  onLeave,
  onEnhancementHover,
  onRightClick,
  onToggle,
}: SelectedPowerRowProps) {
  const showToggle = shouldShowToggle(power);
  const isActive = power.isActive ?? false;
  const handleSlotClick = (index: number) => {
    // Open enhancement picker for any slot (empty or filled)
    onOpenPicker(index);
  };

  const handleSlotRightClick = (e: React.MouseEvent, index: number, hasEnhancement: boolean) => {
    e.preventDefault();

    // If slot has an enhancement, right-click removes the enhancement (not the slot)
    if (hasEnhancement) {
      onClearEnhancement(index);
      return;
    }

    // Shift+right-click on empty slot removes all slots (except first)
    if (e.shiftKey && power.slots.length > 1) {
      onRemoveAllSlots();
      return;
    }

    // Regular right-click on empty slot removes the slot (if not first slot)
    if (index > 0) {
      onRemoveSlot(index);
    }
  };

  const handleSlotMouseEnter = (index: number, hasEnhancement: boolean) => {
    if (hasEnhancement) {
      onEnhancementHover(index);
    } else {
      // When hovering empty slot, show power info
      onHover();
    }
  };

  return (
    <div
      className={`flex items-center gap-1.5 px-1.5 py-1 bg-slate-800 border rounded-sm group transition-colors ${
        isLocked
          ? 'border-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.4)] bg-gradient-to-r from-amber-500/10 to-slate-800'
          : 'border-slate-700 hover:border-slate-600'
      }`}
      onMouseLeave={onLeave}
    >
      {/* Power icon and name - right-click to lock info panel */}
      <div
        className="flex items-center gap-1.5 flex-1 min-w-0 cursor-default"
        onMouseEnter={onHover}
        onContextMenu={onRightClick}
        title={isLocked ? 'Right-click to unlock power info' : 'Right-click to lock power info'}
      >
        <img
          src={getPowerIconPath(powersetName, power.icon)}
          alt=""
          className="w-5 h-5 rounded-sm flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
          }}
        />
        <span className="text-sm text-slate-200 truncate">
          {power.name}
        </span>
      </div>

      {/* Enhancement slots - fixed width container to prevent layout shift */}
      <div className="flex gap-0.5 justify-start items-center flex-shrink-0" style={{ width: '180px' }}>
        {power.slots.map((slot, index) => (
          <div
            key={index}
            onClick={() => handleSlotClick(index)}
            onMouseEnter={() => handleSlotMouseEnter(index, !!slot)}
            onContextMenu={(e) => handleSlotRightClick(e, index, !!slot)}
            className={`
              w-6 h-6 rounded-full border flex items-center justify-center
              text-[9px] font-semibold cursor-pointer transition-transform hover:scale-110
              ${
                slot
                  ? 'border-transparent bg-transparent'
                  : 'border-slate-600 bg-slate-700/50 text-slate-500 hover:border-blue-500 hover:bg-slate-600'
              }
            `}
            title={
              slot
                ? `${slot.name || 'Enhancement'} (right-click to remove enhancement)`
                : `Empty slot ${index + 1} - click to add enhancement${index > 0 ? ', right-click to remove slot' : ''}`
            }
          >
            {slot ? (
              <SlottedEnhancementIcon enhancement={slot} size={24} />
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

      {/* Toggle switch for buff/toggle powers */}
      {showToggle && (
        <Tooltip
          content={
            isActive
              ? 'Power ON - stats included in calculations'
              : 'Power OFF - click to include in stats'
          }
        >
          <button
            onClick={onToggle}
            className={`
              relative w-8 h-4 rounded-full transition-colors duration-200 flex-shrink-0
              ${isActive ? 'bg-green-600' : 'bg-slate-600'}
            `}
          >
            <span
              className={`
                absolute top-[2px] left-[2px] w-3 h-3 rounded-full bg-white shadow-sm
                transition-transform duration-200
                ${isActive ? 'translate-x-4' : 'translate-x-0'}
              `}
            />
          </button>
        </Tooltip>
      )}

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
