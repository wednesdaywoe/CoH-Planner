/**
 * TouchableSlot - Unified enhancement slot component with touch support
 *
 * Supports three sizes (xs, sm, md) and provides consistent interaction:
 * - Desktop: Click opens picker, right-click removes, Shift+right-click opens context menu
 * - Mobile: Tap opens picker, touch-and-hold opens context menu
 */

import { useState, useRef } from 'react';
import type { Enhancement } from '@/types';
import { SlottedEnhancementIcon } from './SlottedEnhancementIcon';
import { SlotContextMenu } from './SlotContextMenu';

export type SlotSize = 'xs' | 'sm' | 'md';

const SIZE_CONFIG: Record<SlotSize, { className: string; iconSize: number; fontSize: string }> = {
  xs: { className: 'w-4 h-4', iconSize: 16, fontSize: 'text-[7px]' },
  sm: { className: 'w-5 h-5', iconSize: 20, fontSize: 'text-[8px]' },
  md: { className: 'w-6 h-6', iconSize: 24, fontSize: 'text-[9px]' },
};

interface TouchableSlotProps {
  slot: Enhancement | null;
  index: number;
  canRemoveSlot: boolean;
  size?: SlotSize;
  onClick: () => void;
  onMouseEnter: () => void;
  onClearEnhancement: () => void;
  onRemoveSlot: () => void;
  onClearAllEnhancements: () => void;
  onRemoveAllSlots: () => void;
}

export function TouchableSlot({
  slot,
  index,
  canRemoveSlot,
  size = 'md',
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

  const config = SIZE_CONFIG[size];

  const openMenu = (x: number, y: number) => {
    longPressTriggeredRef.current = true;
    setMenuPosition({ x, y });
    setMenuOpen(true);
  };

  const handleClick = () => {
    if (longPressTriggeredRef.current || menuOpen) return;
    onClick();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.shiftKey) {
      openMenu(e.clientX, e.clientY);
      return;
    }
    if (slot) {
      onClearEnhancement();
    } else if (canRemoveSlot) {
      onRemoveSlot();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const posRef = { x: touch.clientX, y: touch.clientY + 10 };
    timerRef.current = setTimeout(() => {
      openMenu(posRef.x - 90, posRef.y);
    }, 400);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!longPressTriggeredRef.current && !menuOpen) {
      onClick();
    }
    longPressTriggeredRef.current = false;
  };

  const handleTouchMove = () => {
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
          ${config.className} rounded-full border flex items-center justify-center
          ${config.fontSize} font-semibold cursor-pointer transition-transform hover:scale-110
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
            ? `${slot.name || 'Enhancement'} - right-click to remove, Shift+right-click for menu`
            : `Empty slot ${index + 1} - tap to add${canRemoveSlot ? ', right-click to remove' : ''}`
        }
      >
        {slot ? (
          <SlottedEnhancementIcon enhancement={slot} size={config.iconSize} />
        ) : (
          <span className="text-slate-400">+</span>
        )}
      </div>

      <SlotContextMenu
        isOpen={menuOpen}
        onClose={() => {
          setMenuOpen(false);
          longPressTriggeredRef.current = false;
        }}
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
