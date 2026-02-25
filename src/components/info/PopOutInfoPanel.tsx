/**
 * PopOutInfoPanel - Floating draggable/resizable overlay for the InfoPanel.
 *
 * Rendered via createPortal to document.body so it floats above all content.
 * Draggable by its header bar, resizable via a corner handle.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { InfoPanel } from './InfoPanel';
import { useUIStore } from '@/stores';

// Default dimensions and position (right side of viewport)
const DEFAULT_WIDTH = 380;
const DEFAULT_HEIGHT = 500;
const MIN_WIDTH = 280;
const MIN_HEIGHT = 200;

export function PopOutInfoPanel() {
  const dockInfoPanel = useUIStore((s) => s.dockInfoPanel);

  // Position & size state
  const [pos, setPos] = useState(() => ({
    x: window.innerWidth - DEFAULT_WIDTH - 16,
    y: 80,
  }));
  const [size, setSize] = useState({ w: DEFAULT_WIDTH, h: DEFAULT_HEIGHT });

  // Drag state
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Resize state
  const resizing = useRef(false);
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // ---- Drag handlers ----
  const onDragStart = useCallback((e: React.MouseEvent) => {
    // Only drag from the header area (not buttons inside it)
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    dragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  }, [pos.x, pos.y]);

  // ---- Resize handlers ----
  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = true;
    resizeStart.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
  }, [size.w, size.h]);

  // Global mousemove/mouseup for drag and resize
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (dragging.current) {
        const newX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffset.current.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 40, e.clientY - dragOffset.current.y));
        setPos({ x: newX, y: newY });
      }
      if (resizing.current) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        setSize({
          w: Math.max(MIN_WIDTH, resizeStart.current.w + dx),
          h: Math.max(MIN_HEIGHT, resizeStart.current.h + dy),
        });
      }
    };

    const onMouseUp = () => {
      dragging.current = false;
      resizing.current = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return createPortal(
    <div
      className="fixed z-50 flex flex-col bg-slate-900 border border-slate-600 rounded-lg shadow-2xl overflow-hidden"
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
      }}
    >
      {/* Draggable header */}
      <div
        className="flex items-center justify-between px-3 py-1.5 bg-slate-800 border-b border-slate-700 shrink-0 cursor-move select-none"
        onMouseDown={onDragStart}
      >
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Power Info
        </h2>
        <button
          onClick={dockInfoPanel}
          className="flex items-center gap-1 px-2 py-0.5 text-xs text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 rounded transition-colors"
          title="Dock panel back into main layout"
        >
          {/* Dock icon */}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
          </svg>
          Dock
        </button>
      </div>

      {/* Scrollable InfoPanel content */}
      <div className="flex-1 overflow-y-auto p-2">
        <InfoPanel />
      </div>

      {/* Resize handle (bottom-right corner) */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={onResizeStart}
      >
        <svg className="w-4 h-4 text-slate-600" viewBox="0 0 16 16" fill="currentColor">
          <path d="M14 14H12V12H14V14ZM14 10H12V8H14V10ZM10 14H8V12H10V14Z" />
        </svg>
      </div>
    </div>,
    document.body
  );
}
