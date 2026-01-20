/**
 * DraggableSlotGhost - A ghost slot that can be clicked or dragged to add multiple slots
 *
 * Click: Add 1 slot
 * Drag: Add multiple slots based on drag distance
 * Shows ghost circle previews for each slot that will be added
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DraggableSlotGhostProps {
  powerName: string; // Kept for potential future use (accessibility, debugging)
  currentSlots: number;
  maxSlots: number;
  onAddSlots: (count: number) => void;
}

const DRAG_THRESHOLD = 5; // Pixels before considering it a drag
const PIXELS_PER_SLOT = 30; // Distance for each additional slot
const GHOST_SLOT_SIZE = 24; // Size of ghost slot circles in pixels
const GHOST_SLOT_GAP = 2; // Gap between ghost slots

export function DraggableSlotGhost({
  powerName: _powerName,
  currentSlots,
  maxSlots,
  onAddSlots,
}: DraggableSlotGhostProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [slotsToAdd, setSlotsToAdd] = useState(1);
  const [ghostPosition, setGhostPosition] = useState({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const hasMoved = useRef(false);
  const maxCanAdd = maxSlots - currentSlots;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only left mouse button
      e.preventDefault();

      startPosRef.current = { x: e.clientX, y: e.clientY };
      hasMoved.current = false;
      setIsDragging(true);
      setSlotsToAdd(1);

      // Set initial ghost position based on button position (for additional ghosts beyond the first)
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        // Position starts after the button (which becomes the first ghost)
        setGhostPosition({ x: rect.right + GHOST_SLOT_GAP, y: rect.top });
      }
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Check if we've moved enough to consider it a drag
      if (distance > DRAG_THRESHOLD) {
        hasMoved.current = true;
      }

      // Calculate how many slots to add based on distance
      const additionalSlots = Math.floor(distance / PIXELS_PER_SLOT);
      const newSlotsToAdd = Math.min(1 + additionalSlots, maxCanAdd);
      setSlotsToAdd(newSlotsToAdd);
    },
    [isDragging, maxCanAdd]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      // Add the calculated number of slots
      if (slotsToAdd > 0) {
        onAddSlots(slotsToAdd);
      }

      setIsDragging(false);
      setSlotsToAdd(1);
      hasMoved.current = false;
    },
    [isDragging, slotsToAdd, onAddSlots]
  );

  // Attach document-level handlers when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (maxCanAdd <= 0) {
    return null;
  }

  // Generate ghost slot circles for preview (starting from slot 2, since slot 1 is the button itself)
  const ghostSlots = [];
  if (isDragging && slotsToAdd > 1) {
    // Start from index 1 since index 0 (first slot) is represented by the button itself
    for (let i = 1; i < slotsToAdd; i++) {
      ghostSlots.push(
        <div
          key={i}
          className="w-6 h-6 rounded-full border-2 border-dashed border-blue-400 bg-blue-500/20 flex items-center justify-center animate-pulse"
          style={{
            position: 'absolute',
            // Position relative to button: (i-1) because first additional ghost is at position 0
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

  return (
    <>
      <div
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        className={`
          w-6 h-6 rounded-full border flex items-center justify-center
          cursor-pointer transition-all select-none
          ${
            isDragging
              ? 'border-2 border-dashed border-blue-400 bg-blue-500/20 animate-pulse'
              : 'border border-dashed border-slate-600/50 opacity-40 hover:opacity-100 hover:border-blue-500 hover:bg-slate-700/50'
          }
        `}
        title={
          isDragging
            ? `Release to add ${slotsToAdd} slot${slotsToAdd > 1 ? 's' : ''}`
            : `Add slot (${currentSlots}/${maxSlots}) - drag for more`
        }
      >
        <span
          className={`text-[9px] font-semibold ${isDragging ? 'text-blue-300' : 'text-slate-400'}`}
        >
          {isDragging ? '1' : '+'}
        </span>
      </div>

      {/* Ghost slot previews rendered as portal to body (for slots 2+) */}
      {isDragging &&
        slotsToAdd > 1 &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-50">
            {ghostSlots}
          </div>,
          document.body
        )}
    </>
  );
}
