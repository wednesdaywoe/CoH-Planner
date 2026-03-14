/**
 * DraggableSlotGhost - A ghost slot that can be clicked or dragged to add/remove multiple slots
 *
 * Left-click: Add 1 slot
 * Left-drag: Add multiple slots based on drag distance
 * Right-click: Remove 1 slot
 * Right-drag: Remove multiple slots based on drag distance
 * Shows ghost circle previews for each slot that will be added
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

type SlotSize = 'xs' | 'sm' | 'md';
type DragMode = 'add' | 'remove';

interface DraggableSlotGhostProps {
  powerName: string; // Kept for potential future use (accessibility, debugging)
  currentSlots: number;
  maxSlots: number;
  onAddSlots: (count: number) => void;
  onRemoveSlots?: (count: number) => void;
  size?: SlotSize;
}

const SIZE_CLASSES: Record<SlotSize, string> = {
  xs: 'w-4 h-4 text-[6px]',
  sm: 'w-5 h-5 text-[8px]',
  md: 'w-6 h-6 text-[9px]',
};

const DRAG_THRESHOLD = 5; // Pixels before considering it a drag
const PIXELS_PER_SLOT = 30; // Distance for each additional slot
const GHOST_SLOT_SIZE = 24; // Size of ghost slot circles in pixels
const GHOST_SLOT_GAP = 2; // Gap between ghost slots

export function DraggableSlotGhost({
  powerName: _powerName,
  currentSlots,
  maxSlots,
  onAddSlots,
  onRemoveSlots,
  size = 'md',
}: DraggableSlotGhostProps) {
  const sizeClass = SIZE_CLASSES[size];
  const [dragMode, setDragMode] = useState<DragMode | null>(null);
  const [slotsCount, setSlotsCount] = useState(1);
  const [ghostPosition, setGhostPosition] = useState({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const hasMoved = useRef(false);
  const maxCanAdd = maxSlots - currentSlots;
  const maxCanRemove = currentSlots - 1; // Can't remove slot 0
  const canRemove = maxCanRemove > 0 && !!onRemoveSlots;

  const startDrag = useCallback(
    (clientX: number, clientY: number, mode: DragMode) => {
      startPosRef.current = { x: clientX, y: clientY };
      hasMoved.current = false;
      setDragMode(mode);
      setSlotsCount(1);

      // Set initial ghost position for add mode
      if (mode === 'add' && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setGhostPosition({ x: rect.right + GHOST_SLOT_GAP, y: rect.top });
      }
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0 && maxCanAdd > 0) {
        e.preventDefault();
        startDrag(e.clientX, e.clientY, 'add');
      } else if (e.button === 2 && canRemove) {
        startDrag(e.clientX, e.clientY, 'remove');
      }
    },
    [startDrag, maxCanAdd, canRemove]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (maxCanAdd <= 0) return;
      e.preventDefault();
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY, 'add');
    },
    [startDrag, maxCanAdd]
  );

  const updateDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!dragMode) return;

      const deltaX = clientX - startPosRef.current.x;
      const deltaY = clientY - startPosRef.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > DRAG_THRESHOLD) {
        hasMoved.current = true;
      }

      const max = dragMode === 'add' ? maxCanAdd : maxCanRemove;
      const additionalSlots = Math.floor(distance / PIXELS_PER_SLOT);
      const newCount = Math.min(1 + additionalSlots, max);
      setSlotsCount(newCount);
    },
    [dragMode, maxCanAdd, maxCanRemove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      updateDrag(e.clientX, e.clientY);
    },
    [updateDrag]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      updateDrag(touch.clientX, touch.clientY);
    },
    [updateDrag]
  );

  const endDrag = useCallback(
    () => {
      if (!dragMode) return;

      if (slotsCount > 0) {
        if (dragMode === 'add') {
          onAddSlots(slotsCount);
        } else {
          onRemoveSlots?.(slotsCount);
        }
      }

      setDragMode(null);
      setSlotsCount(1);
      hasMoved.current = false;
    },
    [dragMode, slotsCount, onAddSlots, onRemoveSlots]
  );

  const handleMouseUp = useCallback(
    () => {
      endDrag();
    },
    [endDrag]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      endDrag();
    },
    [endDrag]
  );

  // Suppress browser context menu on the button and during drags
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
    },
    []
  );

  // Attach document-level handlers when dragging (both mouse and touch)
  useEffect(() => {
    if (dragMode) {
      const preventContext = (e: Event) => e.preventDefault();
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('contextmenu', preventContext);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('touchcancel', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('contextmenu', preventContext);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('touchcancel', handleTouchEnd);
      };
    }
  }, [dragMode, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const isAdding = dragMode === 'add';
  const isRemoving = dragMode === 'remove';

  if (maxCanAdd <= 0 && !canRemove) {
    return null;
  }

  // Generate ghost slot circles for add preview (starting from slot 2, since slot 1 is the button itself)
  const ghostSlots = [];
  if (isAdding && slotsCount > 1) {
    for (let i = 1; i < slotsCount; i++) {
      ghostSlots.push(
        <div
          key={i}
          className="w-6 h-6 rounded-full border-2 border-dashed border-blue-400 bg-blue-500/20 flex items-center justify-center animate-pulse"
          style={{
            position: 'absolute',
            left: ghostPosition.x + (i - 1) * (GHOST_SLOT_SIZE + GHOST_SLOT_GAP),
            top: ghostPosition.y,
            width: GHOST_SLOT_SIZE,
            height: GHOST_SLOT_SIZE,
          }}
        >
          <span className="text-[9px] font-semibold text-blue-300">{i + 1}</span>
        </div>
      );
    }
  }

  // Button label and colors based on drag mode
  const buttonLabel = isAdding ? String(slotsCount) : isRemoving ? `-${slotsCount}` : maxCanAdd > 0 ? '+' : '\u2212';
  const dragBorderClass = isAdding
    ? 'border-2 border-dashed border-blue-400 bg-blue-500/20 animate-pulse'
    : isRemoving
      ? 'border-2 border-dashed border-red-400 bg-red-500/20 animate-pulse'
      : '';
  const idleClass = maxCanAdd > 0
    ? 'border border-dashed border-slate-600/50 opacity-40 hover:opacity-100 hover:border-blue-500 hover:bg-slate-700/50'
    : 'border border-dashed border-slate-600/50 opacity-40 hover:opacity-100 hover:border-red-400 hover:bg-slate-700/50';
  const textColor = isAdding ? 'text-blue-300' : isRemoving ? 'text-red-300' : 'text-slate-400';

  const title = dragMode
    ? `Release to ${dragMode === 'add' ? 'add' : 'remove'} ${slotsCount} slot${slotsCount > 1 ? 's' : ''}`
    : maxCanAdd > 0 && canRemove
      ? `Left-click: add slot (${currentSlots}/${maxSlots}) \u2022 Right-click: remove \u2022 Drag for more`
      : maxCanAdd > 0
        ? `Add slot (${currentSlots}/${maxSlots}) - drag for more`
        : `Right-click to remove slot - drag for more`;

  return (
    <>
      <div
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onContextMenu={handleContextMenu}
        className={`
          ${sizeClass} rounded-full border flex items-center justify-center
          cursor-pointer transition-all select-none
          ${dragMode ? dragBorderClass : idleClass}
        `}
        title={title}
      >
        <span className={`font-semibold ${textColor}`}>
          {buttonLabel}
        </span>
      </div>

      {/* Ghost slot previews rendered as portal to body (for add mode, slots 2+) */}
      {isAdding &&
        slotsCount > 1 &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-50">
            {ghostSlots}
          </div>,
          document.body
        )}
    </>
  );
}
