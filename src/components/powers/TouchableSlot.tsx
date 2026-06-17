/**
 * TouchableSlot - Unified enhancement slot component with touch support
 *
 * Supports three sizes (xs, sm, md) and provides consistent interaction:
 * - Desktop: Click opens picker, right-click removes, Shift+right-click opens context menu
 * - Desktop: Right-click drag removes multiple slots based on drag distance
 * - Mobile: Tap opens picker, touch-and-hold opens context menu
 */

import { useState, useRef, useEffect } from 'react';
import type { Enhancement } from '@/types';
import { SlottedEnhancementIcon } from './SlottedEnhancementIcon';
import { SlotContextMenu } from './SlotContextMenu';
import { getSlotHint } from './PlannerHintBar';
import { useUIStore } from '@/stores';

export type SlotSize = 'xs' | 'sm' | 'md';

const SIZE_CONFIG: Record<SlotSize, { className: string; iconSize: number; fontSize: string; levelFontSize: number }> = {
  xs: { className: 'w-4 h-4', iconSize: 16, fontSize: 'text-[7px]', levelFontSize: 6 },
  sm: { className: 'w-5 h-5', iconSize: 20, fontSize: 'text-[8px]', levelFontSize: 7 },
  md: { className: 'w-6 h-6', iconSize: 24, fontSize: 'text-[9px]', levelFontSize: 8 },
};

const DRAG_THRESHOLD = 5; // Pixels before considering it a drag
const PIXELS_PER_SLOT = 30; // Distance for each additional slot to remove

interface TouchableSlotProps {
  slot: Enhancement | null;
  index: number;
  canRemoveSlot: boolean;
  size?: SlotSize;
  slotLevel?: number;
  onClick: () => void;
  onMouseEnter: () => void;
  onClearEnhancement: () => void;
  onRemoveSlot: () => void;
  onClearAllEnhancements: () => void;
  onRemoveAllSlots: () => void;
  onCompareSlotting?: () => void;
  /** Called when right-click drag removes multiple empty slots */
  onRemoveSlots?: (count: number) => void;
  /** Called when right-click drag clears multiple enhancements */
  onClearEnhancements?: (count: number) => void;
  /** Maximum number of removable empty slots */
  removableSlotCount?: number;
  /** Number of filled enhancement slots */
  filledSlotCount?: number;
  /** Report drag state changes to parent for highlighting */
  onDragStateChange?: (state: { mode: 'slots' | 'enhancements'; count: number } | null) => void;
  /** Whether this slot is highlighted for pending removal */
  highlightRemoval?: 'slot' | 'enhancement' | null;
  /** Begin a slot-level move with this slot as the source. Omitted when the
   *  slot can't be a move source (base slot, auto-granted inherent slot). */
  onMoveSlotLevel?: () => void;
  /** Slot-level-move highlight: this slot is the armed source, or a valid
   *  destination to swap into. Null when not in move mode / not eligible. */
  moveHighlight?: 'source' | 'target' | null;
}

export function TouchableSlot({
  slot,
  index,
  canRemoveSlot,
  size = 'md',
  slotLevel,
  onClick,
  onMouseEnter,
  onClearEnhancement,
  onRemoveSlot,
  onClearAllEnhancements,
  onRemoveAllSlots,
  onCompareSlotting,
  onRemoveSlots,
  onClearEnhancements,
  removableSlotCount = 0,
  filledSlotCount = 0,
  onDragStateChange,
  highlightRemoval,
  onMoveSlotLevel,
  moveHighlight,
}: TouchableSlotProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [dragRemoveCount, setDragRemoveCount] = useState(0);
  const [dragMode, setDragMode] = useState<'slots' | 'enhancements' | null>(null);
  const longPressTriggeredRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const setHoverHint = useUIStore((s) => s.setHoverHint);

  const handleMouseEnter = () => {
    setHoverHint(getSlotHint(!!slot, canRemoveSlot));
    onMouseEnter?.();
  };
  const handleMouseLeave = () => setHoverHint(null);

  // Right-click drag tracking via ref (avoids re-renders during mousemove)
  const rightDragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    hasMoved: false,
    slotsToRemove: 0,
    moveHandler: null as ((e: MouseEvent) => void) | null,
    upHandler: null as ((e: MouseEvent) => void) | null,
    contextHandler: null as ((e: Event) => void) | null,
  });

  // Cleanup document listeners on unmount
  useEffect(() => {
    return () => {
      const drag = rightDragRef.current;
      if (drag.moveHandler) document.removeEventListener('mousemove', drag.moveHandler);
      if (drag.upHandler) document.removeEventListener('mouseup', drag.upHandler, true);
      if (drag.contextHandler) document.removeEventListener('contextmenu', drag.contextHandler, true);
    };
  }, []);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 2) return; // Only right button

    // Determine drag mode based on what's under the cursor
    const mode = slot ? 'enhancements' : 'slots';
    const maxCount = mode === 'enhancements' ? filledSlotCount : removableSlotCount;
    const callback = mode === 'enhancements' ? onClearEnhancements : onRemoveSlots;
    if (!callback || maxCount <= 0) return;

    // Inhibit Firefox's default right-mousedown behavior (selection start, etc.)
    // which can interact poorly with our drag tracking.
    e.preventDefault();

    setDragMode(mode);

    const drag = rightDragRef.current;
    drag.active = true;
    drag.startX = e.clientX;
    drag.startY = e.clientY;
    drag.hasMoved = false;
    drag.slotsToRemove = 0;

    const handleMove = (ev: MouseEvent) => {
      if (!drag.active) return;
      const dx = ev.clientX - drag.startX;
      const dy = ev.clientY - drag.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > DRAG_THRESHOLD) {
        drag.hasMoved = true;
        const count = Math.min(
          1 + Math.floor(distance / PIXELS_PER_SLOT),
          maxCount
        );
        drag.slotsToRemove = count;
        setDragRemoveCount(count);
        onDragStateChange?.({ mode, count });
      }
    };

    // Block the browser context menu during and just after the drag. Capture
    // phase so we beat any bubble-phase listener that forgets to preventDefault.
    // Only preventDefault — don't stopPropagation, because React's bubble-phase
    // handleContextMenu still needs to fire for the no-drag right-click path
    // (it checks drag.hasMoved and bails appropriately).
    const preventContext = (ev: Event) => {
      ev.preventDefault();
    };

    const handleUp = (ev: MouseEvent) => {
      // Only respond to right-button release; ignore stray left/middle mouseups
      if (ev.button !== 2) return;

      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp, true);

      // Execute the callback HERE on mouseup. mouseup fires reliably in every
      // browser; contextmenu can be reordered, suppressed, or skipped (Firefox
      // is especially inconsistent during right-mouse drags). Doing the work
      // in mouseup removes that race entirely.
      const shouldExecute = drag.active && drag.hasMoved && drag.slotsToRemove > 0;
      if (shouldExecute) {
        callback(drag.slotsToRemove);
      }
      drag.active = false;
      drag.slotsToRemove = 0;

      // Keep blocking the contextmenu event for a window after release so the
      // browser menu doesn't pop up. 150ms is enough to cover the slowest
      // contextmenu dispatch we've seen in Firefox without leaking blocker
      // listeners into the next interaction. Capture `preventContext` locally
      // so a second right-click that overwrites `drag.contextHandler` doesn't
      // cause this cleanup to remove the wrong listener.
      window.setTimeout(() => {
        document.removeEventListener('contextmenu', preventContext, true);
        if (drag.contextHandler === preventContext) {
          drag.contextHandler = null;
        }
        // Clear hasMoved after the contextmenu has had a chance to fire so the
        // React-synthetic handleContextMenu also bails on this drag.
        drag.hasMoved = false;
      }, 150);

      setDragRemoveCount(0);
      setDragMode(null);
      onDragStateChange?.(null);
    };

    drag.moveHandler = handleMove;
    drag.upHandler = handleUp;
    drag.contextHandler = preventContext;

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp, true);
    document.addEventListener('contextmenu', preventContext, true);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();

    // If right-click drag was active, the document-level contextmenu handler
    // already processed it — skip the normal right-click action
    if (rightDragRef.current.hasMoved) {
      return;
    }

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
      <div className="relative">
        <div
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
              moveHighlight === 'source'
                ? 'border-sk-magenta bg-sk-magenta/30 ring-2 ring-sk-magenta animate-pulse'
                : moveHighlight === 'target'
                  ? 'border-emerald-400 bg-emerald-500/20 ring-2 ring-emerald-400/70'
                  : highlightRemoval === 'enhancement'
                    ? 'border-amber-500 bg-amber-900/40 ring-1 ring-amber-500/50'
                    : highlightRemoval === 'slot'
                      ? 'border-red-500 bg-red-900/40 ring-1 ring-red-500/50'
                      : slot
                        ? 'border-transparent bg-transparent'
                        : 'border-slate-600 bg-slate-700/50 text-slate-500 hover:border-[var(--color-selected)] hover:bg-slate-600'
            }
          `}
          style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
          {...(!slot ? { 'data-onboarding': 'slot-enhancement' } : {})}
          title={
            slot
              ? undefined
              : `Empty slot ${index + 1} - tap to add${canRemoveSlot ? ', right-click to remove, drag to remove multiple' : ''}`
          }
        >
          {slot ? (
            <SlottedEnhancementIcon enhancement={slot} size={config.iconSize} />
          ) : (
            <span className="text-slate-400">+</span>
          )}
        </div>
        {/* Drag-to-remove count badge */}
        {dragRemoveCount > 0 && (
          <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[9px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center z-30 pointer-events-none animate-pulse px-0.5 ${
            dragMode === 'enhancements' ? 'bg-amber-600' : 'bg-red-600'
          }`}>
            -{dragRemoveCount}
          </div>
        )}
        {slotLevel !== undefined && (
          <div
            className="absolute left-1/2 -translate-x-1/2 bg-gray-900/90 text-slate-300 border border-slate-600 rounded-sm pointer-events-none z-20 leading-none px-px"
            style={{ bottom: -4, fontSize: config.levelFontSize, minWidth: config.levelFontSize * 1.6 }}
          >
            <span className="flex items-center justify-center">{slotLevel}</span>
          </div>
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
        onCompareSlotting={onCompareSlotting}
        onMoveSlotLevel={onMoveSlotLevel}
      />
    </>
  );
}
