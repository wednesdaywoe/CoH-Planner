/**
 * SelectedPowers component - shows powers that have been selected
 * Renders inline within a column (column headers are in PlannerPage)
 */

import { useRef, useState } from 'react';
import { useBuildStore, useUIStore } from '@/stores';
import type { PowerCategory } from '@/stores';
import type { SelectedPower, Power, Enhancement } from '@/types';
import { getPowerIconPath, getPowerset, hasGrantedPowers, getGrantedPowerGroup } from '@/data';
import { resolvePath } from '@/utils/paths';
import { DraggableSlotGhost } from './DraggableSlotGhost';
import { SlottedEnhancementIcon } from './SlottedEnhancementIcon';
import { SlotContextMenu } from './SlotContextMenu';
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
  const setActiveSubPower = useBuildStore((s) => s.setActiveSubPower);
  const setInfoPanelContent = useUIStore((s) => s.setInfoPanelContent);
  const clearInfoPanel = useUIStore((s) => s.clearInfoPanel);
  const lockInfoPanel = useUIStore((s) => s.lockInfoPanel);
  const unlockInfoPanel = useUIStore((s) => s.unlockInfoPanel);
  const infoPanelLocked = useUIStore((s) => s.infoPanel.locked);
  const lockedContent = useUIStore((s) => s.infoPanel.lockedContent);
  const openEnhancementPicker = useUIStore((s) => s.openEnhancementPicker);

  const selection = category === 'primary' ? build.primary : build.secondary;
  const powersetId = selection.id || '';

  // Sort powers by their position in the powerset (available level)
  // This ensures powers are displayed in the natural powerset order,
  // regardless of the order they were selected
  const powers = [...selection.powers].sort((a, b) => a.available - b.available);

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

  const handleClearAllEnhancements = (powerName: string, totalSlots: number) => {
    // Clear all enhancements from this power's slots
    for (let i = 0; i < totalSlots; i++) {
      clearEnhancement(powerName, i);
    }
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

  // Get powerset to look up sub-powers
  const powerset = getPowerset(powersetId);

  // Get sub-powers for a parent power
  const getSubPowers = (parentPowerName: string): Power[] => {
    if (!powerset || !hasGrantedPowers(parentPowerName)) return [];
    const group = getGrantedPowerGroup(parentPowerName);
    if (!group) return [];

    // Find sub-powers in the powerset
    return powerset.powers.filter(p =>
      group.grantedPowers.includes(p.name)
    );
  };

  return (
    <div className="space-y-0.5">
      {powers.map((power) => {
        // Check if this power is the one locked in the info panel
        const isLocked = infoPanelLocked &&
          lockedContent?.type === 'power' &&
          lockedContent.powerName === power.name;

        // Check if this power grants sub-powers
        const subPowers = getSubPowers(power.name);
        const grantedGroup = getGrantedPowerGroup(power.name);

        return (
          <div key={power.name}>
            <SelectedPowerRow
              power={power}
              powersetId={powersetId}
              powersetName={selection.name}
              isLocked={isLocked}
              onRemove={() => handleRemove(power.name)}
              onAddSlots={(count) => handleAddSlots(power.name, count)}
              onRemoveSlot={(index) => handleRemoveSlot(power.name, index)}
              onRemoveAllSlots={() => handleRemoveAllSlots(power.name, power.slots.length)}
              onClearEnhancement={(index) => handleClearEnhancement(power.name, index)}
              onClearAllEnhancements={() => handleClearAllEnhancements(power.name, power.slots.length)}
              onOpenPicker={(slotIndex) => openEnhancementPicker(power.name, powersetId, slotIndex)}
              onHover={() => handlePowerHover(power)}
              onLeave={handlePowerLeave}
              onEnhancementHover={(index) => handleEnhancementHover(power.name, index)}
              onRightClick={(e) => handlePowerRightClick(e, power)}
              onToggle={() => togglePowerActive(power.name)}
            />

            {/* Granted sub-powers display */}
            {subPowers.length > 0 && (
              <GrantedSubPowers
                subPowers={subPowers}
                parentPower={power}
                powersetName={selection.name}
                isMutuallyExclusive={grantedGroup?.mutuallyExclusive ?? false}
                activeSubPower={power.activeSubPower}
                onSetActive={(subPowerName) => setActiveSubPower(power.name, subPowerName)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// TOUCHABLE SLOT COMPONENT
// ============================================

interface TouchableSlotProps {
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
 * Slot component with touch support:
 * - Long-press opens context menu with actions
 * - Tap opens enhancement picker
 * - Right-click (desktop) also shows context menu
 */
function TouchableSlot({
  slot,
  index,
  canRemoveSlot,
  onClick,
  onMouseEnter,
  onClearEnhancement,
  onRemoveSlot,
  onClearAllEnhancements,
  onRemoveAllSlots,
}: TouchableSlotProps) {
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
          w-6 h-6 rounded-full border flex items-center justify-center
          text-[9px] font-semibold cursor-pointer transition-transform hover:scale-110
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
            : `Empty slot ${index + 1} - tap to add, hold for options`
        }
      >
        {slot ? (
          <SlottedEnhancementIcon enhancement={slot} size={24} />
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
  onClearAllEnhancements: () => void;
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
  onClearAllEnhancements,
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
      {/* Level indicator */}
      <div className="flex-shrink-0 w-6 text-center">
        <span className="text-[10px] font-semibold text-slate-500">L{power.level}</span>
      </div>

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
          <TouchableSlot
            key={index}
            slot={slot}
            index={index}
            canRemoveSlot={index > 0}
            onClick={() => handleSlotClick(index)}
            onMouseEnter={() => handleSlotMouseEnter(index, !!slot)}
            onClearEnhancement={() => onClearEnhancement(index)}
            onRemoveSlot={() => onRemoveSlot(index)}
            onClearAllEnhancements={onClearAllEnhancements}
            onRemoveAllSlots={onRemoveAllSlots}
          />
        ))}

        {/* Draggable ghost slot for adding more */}
        <DraggableSlotGhost
          powerName={power.name}
          currentSlots={power.slots.length}
          maxSlots={power.maxSlots}
          onAddSlots={onAddSlots}
        />
      </div>

      {/* Toggle switch container - always reserve space to prevent layout shift */}
      <div className="w-8 flex-shrink-0">
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
                relative w-8 h-4 rounded-full transition-colors duration-200
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

// ============================================
// GRANTED SUB-POWERS COMPONENT
// ============================================

interface GrantedSubPowersProps {
  subPowers: Power[];
  parentPower: SelectedPower;
  powersetName: string;
  isMutuallyExclusive: boolean;
  activeSubPower?: string;
  onSetActive: (subPowerName: string | null) => void;
}

/**
 * Displays granted sub-powers below a parent power
 * For mutually exclusive powers (like Adaptation stances), shows radio-style selection
 */
function GrantedSubPowers({
  subPowers,
  powersetName,
  isMutuallyExclusive,
  activeSubPower,
  onSetActive,
}: GrantedSubPowersProps) {
  return (
    <div className="ml-6 mt-0.5 space-y-0.5">
      {subPowers.map((subPower) => {
        const isActive = activeSubPower === subPower.name;

        return (
          <div
            key={subPower.name}
            className={`
              flex items-center gap-1.5 px-1.5 py-0.5 rounded-sm
              border transition-colors
              ${isActive
                ? 'bg-slate-700/50 border-green-600/50'
                : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
              }
            `}
          >
            {/* Sub-power icon and name */}
            <img
              src={getPowerIconPath(powersetName, subPower.icon)}
              alt=""
              className="w-4 h-4 rounded-sm flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
              }}
            />
            <span className={`text-xs truncate flex-1 ${isActive ? 'text-green-300' : 'text-slate-400'}`}>
              {subPower.name}
            </span>

            {/* Toggle/Radio button for sub-power */}
            {isMutuallyExclusive ? (
              <Tooltip
                content={
                  isActive
                    ? `${subPower.name} is active`
                    : `Activate ${subPower.name}`
                }
              >
                <button
                  onClick={() => onSetActive(isActive ? null : subPower.name)}
                  className={`
                    w-4 h-4 rounded-full border-2 flex items-center justify-center
                    transition-colors
                    ${isActive
                      ? 'border-green-500 bg-green-500'
                      : 'border-slate-500 hover:border-green-400'
                    }
                  `}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              </Tooltip>
            ) : (
              <Tooltip
                content={
                  isActive
                    ? `${subPower.name} ON`
                    : `${subPower.name} OFF`
                }
              >
                <button
                  onClick={() => onSetActive(isActive ? null : subPower.name)}
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
        );
      })}
    </div>
  );
}
