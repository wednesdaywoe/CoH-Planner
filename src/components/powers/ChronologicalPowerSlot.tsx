/**
 * ChronologicalPowerSlot - Individual slot in the chronological power view
 *
 * Shows either a power with enhancements or an empty slot placeholder.
 * Includes category color coding and all standard interactions.
 */

import { useRef, useState } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import type { PowerCategory as StorePowerCategory } from '@/stores';
import type { Enhancement } from '@/types';
import { getPowerIconPath, getPowerset } from '@/data';
import { resolvePath } from '@/utils/paths';
import { DraggableSlotGhost } from './DraggableSlotGhost';
import { SlottedEnhancementIcon } from './SlottedEnhancementIcon';
import { SlotContextMenu } from './SlotContextMenu';
import { Tooltip } from '@/components/ui';
import type { CategorizedPower, PowerCategory } from './ChronologicalPowerView';

// Category colors for left border
const CATEGORY_COLORS: Record<PowerCategory, string> = {
  primary: 'border-l-yellow-500',
  secondary: 'border-l-blue-500',
  pool: 'border-l-green-500',
  epic: 'border-l-purple-500',
};

const CATEGORY_LABELS: Record<PowerCategory, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  pool: 'Pool',
  epic: 'Epic',
};

// ============================================
// TOUCHABLE SLOT COMPONENT (compact version)
// ============================================

interface TouchableSlotCompactProps {
  slot: Enhancement | null;
  index: number;
  canRemoveSlot: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onClearEnhancement: () => void;
  onRemoveSlot: () => void;
  onClearAllEnhancements: () => void;
  onRemoveAllSlots: () => void;
}

/**
 * Compact slot component with touch support for chronological view
 * - Long-press opens context menu with actions
 * - Tap opens enhancement picker
 * - Right-click (desktop) also shows context menu
 */
function TouchableSlotCompact({
  slot,
  index,
  canRemoveSlot,
  onClick,
  onMouseEnter,
  onClearEnhancement,
  onRemoveSlot,
  onClearAllEnhancements,
  onRemoveAllSlots,
}: TouchableSlotCompactProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const longPressTriggeredRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const openMenu = (x: number, y: number) => {
    longPressTriggeredRef.current = true;
    setMenuPosition({ x, y });
    setMenuOpen(true);
  };

  const handleClick = () => {
    // Skip if we just opened the menu
    if (longPressTriggeredRef.current || menuOpen) {
      return;
    }
    onClick();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openMenu(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent iOS context menu and text selection
    const touch = e.touches[0];
    const posRef = { x: touch.clientX, y: touch.clientY + 10 };

    // Start timer for long-press
    timerRef.current = setTimeout(() => {
      openMenu(posRef.x - 90, posRef.y);
    }, 400);
  };

  const handleTouchEnd = () => {
    // Clear timer if touch ends before long-press
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // If it wasn't a long-press, treat as tap
    if (!longPressTriggeredRef.current && !menuOpen) {
      onClick();
    }
    longPressTriggeredRef.current = false;
  };

  const handleTouchMove = () => {
    // Cancel long-press if user moves finger
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchCancel={handleTouchMove}
        className={`
          w-5 h-5 rounded-full border flex items-center justify-center
          text-[8px] font-semibold cursor-pointer transition-transform hover:scale-110
          select-none
          ${
            slot
              ? 'border-transparent bg-transparent'
              : 'border-slate-600 bg-slate-700/50 text-slate-500 hover:border-blue-500 hover:bg-slate-600'
          }
        `}
        style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
        title={
          slot
            ? `${slot.name || 'Enhancement'} - hold or right-click for options`
            : `Slot ${index + 1} - tap to add, hold for options`
        }
      >
        {slot ? (
          <SlottedEnhancementIcon enhancement={slot} size={20} />
        ) : (
          <span className="text-slate-400">+</span>
        )}
      </div>

      <SlotContextMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        position={menuPosition}
        hasFill={!!slot}
        canRemoveSlot={canRemoveSlot}
        onOpenPicker={onClick}
        onClearEnhancement={onClearEnhancement}
        onRemoveSlot={onRemoveSlot}
        onClearAllEnhancements={onClearAllEnhancements}
        onRemoveAllSlots={onRemoveAllSlots}
      />
    </>
  );
}

/**
 * Determine if a power should show a toggle switch for stat calculations.
 */
function shouldShowToggle(power: CategorizedPower): boolean {
  const powerType = power.powerType?.toLowerCase();
  const targetType = power.targetType?.toLowerCase();
  const shortHelp = power.shortHelp?.toLowerCase() || '';

  if (powerType === 'toggle') return true;
  if (powerType === 'click') {
    if (targetType === 'self') return true;
    if (shortHelp.startsWith('self ') || shortHelp.includes('self +')) return true;
  }
  return false;
}

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
  isPrimarySlot?: boolean;
  isSecondarySlot?: boolean;
}

export function ChronologicalPowerSlot({
  level,
  power,
  isPrimarySlot,
  isSecondarySlot,
}: ChronologicalPowerSlotProps) {
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

  // Get the powerset for icon lookup
  const powerset = power?.powerSet ? getPowerset(power.powerSet) : null;
  const powersetName = powerset?.name || '';

  if (!power) {
    // Render empty slot placeholder
    return (
      <div className="h-[52px] flex items-center gap-2 px-2 py-1 bg-slate-800/50 border border-dashed border-slate-700 rounded">
        <div className="flex-shrink-0 w-8 text-center">
          <span className="text-xs font-semibold text-slate-500">L{level}</span>
        </div>
        <div className="flex-1 text-xs text-slate-600 italic">
          {isPrimarySlot
            ? 'Primary power'
            : isSecondarySlot
            ? 'Secondary power'
            : 'Empty slot'}
        </div>
      </div>
    );
  }

  const isLocked =
    infoPanelLocked &&
    lockedContent?.type === 'power' &&
    lockedContent.powerName === power.name;

  const showToggle = shouldShowToggle(power);
  const isActive = power.isActive ?? false;

  const handleRemove = () => {
    const storeCategory = mapCategoryToStoreCategory(power.category);
    removePower(storeCategory, power.name);
  };

  const handleAddSlots = (count: number) => {
    for (let i = 0; i < count; i++) {
      addSlot(power.name);
    }
  };

  const handleSlotClick = (index: number) => {
    openEnhancementPicker(power.name, power.powerSet, index);
  };

  const handleClearAllEnhancements = () => {
    // Clear all enhancements from this power's slots
    for (let i = 0; i < power.slots.length; i++) {
      clearEnhancement(power.name, i);
    }
  };

  const handleRemoveAllSlots = () => {
    // Remove all slots except first
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

  return (
    <div
      className={`
        h-[52px] flex items-center gap-1.5 px-1.5 py-1 bg-slate-800 border rounded group transition-colors
        border-l-4 ${CATEGORY_COLORS[power.category]}
        ${
          isLocked
            ? 'border-amber-500 border-l-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.4)] bg-gradient-to-r from-amber-500/10 to-slate-800'
            : 'border-slate-700 hover:border-slate-600'
        }
      `}
      onMouseLeave={handlePowerLeave}
    >
      {/* Level indicator */}
      <div className="flex-shrink-0 w-6 text-center">
        <span className="text-[10px] font-semibold text-slate-500">L{level}</span>
      </div>

      {/* Power icon and name */}
      <div
        className="flex items-center gap-1 flex-1 min-w-0 cursor-default"
        onMouseEnter={handlePowerHover}
        onContextMenu={handleRightClick}
        title={`${CATEGORY_LABELS[power.category]}: ${power.name}`}
      >
        <img
          src={getPowerIconPath(powersetName, power.icon)}
          alt=""
          className="w-5 h-5 rounded-sm flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
          }}
        />
        <span className="text-xs text-slate-200 truncate">{power.name}</span>
      </div>

      {/* Enhancement slots - compact display, aligned left */}
      <div
        className="flex gap-0.5 justify-start items-center flex-shrink-0"
        style={{ width: '140px' }}
      >
        {power.slots.slice(0, 6).map((slot, index) => (
          <TouchableSlotCompact
            key={index}
            slot={slot}
            index={index}
            canRemoveSlot={index > 0}
            onClick={() => handleSlotClick(index)}
            onMouseEnter={() =>
              slot ? handleEnhancementHover(index) : handlePowerHover()
            }
            onClearEnhancement={() => clearEnhancement(power.name, index)}
            onRemoveSlot={() => removeSlot(power.name, index)}
            onClearAllEnhancements={handleClearAllEnhancements}
            onRemoveAllSlots={handleRemoveAllSlots}
          />
        ))}

        {/* Draggable ghost for adding slots */}
        <DraggableSlotGhost
          powerName={power.name}
          currentSlots={power.slots.length}
          maxSlots={power.maxSlots}
          onAddSlots={handleAddSlots}
          size="sm"
        />
      </div>

      {/* Toggle switch - compact */}
      <div className="w-6 flex-shrink-0">
        {showToggle && (
          <Tooltip
            content={isActive ? 'Power ON' : 'Power OFF'}
          >
            <button
              onClick={() => togglePowerActive(power.name)}
              className={`
                relative w-6 h-3 rounded-full transition-colors duration-200
                ${isActive ? 'bg-green-600' : 'bg-slate-600'}
              `}
            >
              <span
                className={`
                  absolute top-[2px] left-[2px] w-2 h-2 rounded-full bg-white shadow-sm
                  transition-transform duration-200
                  ${isActive ? 'translate-x-3' : 'translate-x-0'}
                `}
              />
            </button>
          </Tooltip>
        )}
      </div>

      {/* Remove button */}
      <button
        onClick={handleRemove}
        className="text-slate-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        title="Remove power"
      >
        ✕
      </button>
    </div>
  );
}

export default ChronologicalPowerSlot;
