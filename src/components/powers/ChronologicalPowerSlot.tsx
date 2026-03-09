/**
 * ChronologicalPowerSlot - Individual slot in the chronological power view
 *
 * Shows either a power with enhancements or an empty slot placeholder.
 * Includes category color coding, all standard interactions, and
 * drag-and-drop support for reordering powers.
 */

import { useBuildStore, useUIStore } from '@/stores';
import { useShowSlotLevels } from '@/stores/uiStore';
import type { PowerCategory as StorePowerCategory } from '@/stores';
import { getPowerIconPath } from '@/data';
import { useSlotLevels } from '@/hooks';
import { PowerRow } from './PowerRow';
import { shouldShowToggle } from './power-row-utils';
import type { CategorizedPower, PowerCategory, DragState } from './ChronologicalPowerView';

// Category colors for left border
const CATEGORY_COLORS: Record<PowerCategory, string> = {
  primary: 'border-l-4 border-l-yellow-500',
  secondary: 'border-l-4 border-l-blue-500',
  pool: 'border-l-4 border-l-green-500',
  epic: 'border-l-4 border-l-purple-500',
};

/**
 * Map chronological category to store category for removal
 */
function mapCategoryToStoreCategory(category: PowerCategory): StorePowerCategory {
  switch (category) {
    case 'primary':
      return 'primary';
    case 'secondary':
      return 'secondary';
    case 'pool':
      return 'pool';
    case 'epic':
      return 'epic';
    default:
      return 'pool';
  }
}

interface ChronologicalPowerSlotProps {
  level: number;
  power: CategorizedPower | null;
  slotKey: string;
  isPrimarySlot?: boolean;
  isSecondarySlot?: boolean;
  dragState: DragState | null;
  onPowerDragStart?: (power: CategorizedPower) => void;
  onPowerDragEnd?: () => void;
}

export function ChronologicalPowerSlot({
  level,
  power,
  slotKey,
  isPrimarySlot,
  isSecondarySlot,
  dragState,
  onPowerDragStart,
  onPowerDragEnd,
}: ChronologicalPowerSlotProps) {
  const removePower = useBuildStore((s) => s.removePower);
  const addSlot = useBuildStore((s) => s.addSlot);
  const removeSlot = useBuildStore((s) => s.removeSlot);
  const clearEnhancement = useBuildStore((s) => s.clearEnhancement);
  const togglePowerActive = useBuildStore((s) => s.togglePowerActive);
  const movePowerLevel = useBuildStore((s) => s.movePowerLevel);
  const swapPowerLevels = useBuildStore((s) => s.swapPowerLevels);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);
  const clearInfoPanel = useUIStore((s) => s.clearInfoPanel);
  const lockInfoPanel = useUIStore((s) => s.lockInfoPanel);
  const unlockInfoPanel = useUIStore((s) => s.unlockInfoPanel);
  const infoPanelLocked = useUIStore((s) => s.infoPanel.locked);
  const lockedContent = useUIStore((s) => s.infoPanel.lockedContent);
  const openEnhancementPicker = useUIStore((s) => s.openEnhancementPicker);
  const openCompareSlotting = useUIStore((s) => s.openCompareSlotting);
  const showSlotLevels = useShowSlotLevels();
  const slotLevelsMap = useSlotLevels();

  const iconSrc = power ? getPowerIconPath(power.icon) : '';

  // Drag state for this slot
  const isDragging = dragState && power && dragState.draggedPower.name === power.name;
  const isValidTarget = dragState && !isDragging && dragState.validTargets.has(slotKey);
  const isInvalidTarget = dragState && !isDragging && !dragState.validTargets.has(slotKey);

  const handleDragOver = (e: React.DragEvent) => {
    if (isValidTarget) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isValidTarget || !dragState) return;

    if (power) {
      // Swap with occupied slot
      swapPowerLevels(dragState.draggedPower.name, power.name);
    } else {
      // Move to empty slot
      movePowerLevel(
        mapCategoryToStoreCategory(dragState.draggedPower.category),
        dragState.draggedPower.name,
        level,
      );
    }
    onPowerDragEnd?.();
  };

  if (!power) {
    // Render empty slot placeholder - structured like PowerRow stacked layout for matching height
    return (
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex flex-col px-1.5 py-1 bg-slate-800/50 border rounded-sm transition-colors ${
          isValidTarget
            ? 'border-blue-500 border-dashed bg-blue-500/10'
            : 'border-dashed border-slate-700'
        }`}
      >
        <div className="flex min-w-0">
          {/* Left column: Level + empty icon space (matches PowerRow stacked layout) */}
          <div className="flex flex-col items-center flex-shrink-0 mr-1 justify-between">
            <span className="text-[10px] font-semibold text-slate-500 leading-tight">L{level}</span>
            <div className="w-6 h-6 mt-0.5" />
          </div>
          {/* Right column: Label + spacer (matches name row + slots row) */}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs text-slate-600 italic">
              {isPrimarySlot
                ? 'Primary power'
                : isSecondarySlot
                ? 'Secondary power'
                : 'Empty slot'}
            </span>
            <div className="h-6 mt-0.5" />
          </div>
        </div>
      </div>
    );
  }

  const isInfoLocked =
    infoPanelLocked &&
    lockedContent?.type === 'power' &&
    lockedContent.powerName === power.name;

  const handleRemove = () => {
    const storeCategory = mapCategoryToStoreCategory(power.category);
    removePower(storeCategory, power.name);
  };

  const handleAddSlots = (count: number) => {
    for (let i = 0; i < count; i++) {
      addSlot(power.name);
    }
  };

  const handleClearAllEnhancements = () => {
    for (let i = 0; i < power.slots.length; i++) {
      clearEnhancement(power.name, i);
    }
  };

  const handleRemoveAllSlots = () => {
    for (let i = power.slots.length - 1; i > 0; i--) {
      removeSlot(power.name, i);
    }
  };

  const handlePowerHover = () => {
    if (power.powerSet) {
      setInfoPanelContent({
        type: 'power',
        powerName: power.name,
        powerSet: power.powerSet,
      });
    }
  };

  const handlePowerLeave = () => {
    clearInfoPanel();
  };

  const handleEnhancementHover = (index: number) => {
    setInfoPanelContent({
      type: 'slotted-enhancement',
      powerName: power.name,
      slotIndex: index,
    });
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!power.powerSet) return;

    if (
      infoPanelLocked &&
      lockedContent?.type === 'power' &&
      lockedContent.powerName === power.name
    ) {
      unlockInfoPanel();
    } else {
      lockInfoPanel({
        type: 'power',
        powerName: power.name,
        powerSet: power.powerSet,
      });
    }
  };

  const canDrag = !power.isLocked && !power.isAutoGranted;

  return (
    <div
      draggable={canDrag}
      onDragStart={(e) => {
        if (!canDrag) return;
        e.dataTransfer.setData('text/plain', power.name);
        e.dataTransfer.effectAllowed = 'move';
        // Use setTimeout so the drag image captures the element before we apply opacity
        setTimeout(() => onPowerDragStart?.(power), 0);
      }}
      onDragEnd={() => onPowerDragEnd?.()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`transition-opacity ${
        isDragging ? 'opacity-40' : ''
      } ${
        isValidTarget ? 'ring-2 ring-blue-500 ring-inset rounded-sm' : ''
      } ${
        isInvalidTarget ? 'opacity-30' : ''
      }`}
    >
      <PowerRow
        name={power.name}
        iconSrc={iconSrc}
        size="lg"
        stackedLayout
        level={level}
        isLocked={isInfoLocked}
        categoryBorder={CATEGORY_COLORS[power.category]}
        toggleSize={shouldShowToggle(power) ? 'md' : undefined}
        isActive={power.isActive ?? false}
        onToggle={() => togglePowerActive(power.name)}
        slots={power.slots}
        maxSlots={power.maxSlots}
        onRemove={handleRemove}
        onAddSlots={handleAddSlots}
        onRemoveSlot={(index) => removeSlot(power.name, index)}
        onRemoveAllSlots={handleRemoveAllSlots}
        onClearEnhancement={(index) => clearEnhancement(power.name, index)}
        onClearAllEnhancements={handleClearAllEnhancements}
        onOpenPicker={(slotIndex) => openEnhancementPicker(power.name, power.powerSet, slotIndex)}
        onHover={handlePowerHover}
        onLeave={handlePowerLeave}
        onEnhancementHover={handleEnhancementHover}
        onRightClick={handleRightClick}
        onCompareSlotting={() => openCompareSlotting(power.name, power.powerSet)}
        slotLevels={showSlotLevels ? slotLevelsMap.get(power.name) : undefined}
        onInfoClick={() => {
          if (power.powerSet) {
            if (isInfoLocked) {
              unlockInfoPanel();
            } else {
              lockInfoPanel({
                type: 'power',
                powerName: power.name,
                powerSet: power.powerSet,
              });
            }
          }
        }}
      />
    </div>
  );
}

export default ChronologicalPowerSlot;
