/**
 * Tooltip component
 *
 * Can be used in two ways:
 * 1. Wrap content and provide tooltip text
 * 2. Portal-based positioning for complex tooltips
 */

import { useState, useRef, useCallback, useEffect, useLayoutEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

// Gap between the trigger and the tooltip, and the minimum margin the tooltip
// keeps from any window edge.
const GAP = 8;
const EDGE_PADDING = 8;

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
  triggerClassName?: string;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className = '',
  triggerClassName,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  // Captured at show time; drives positioning.
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  // Final, viewport-clamped pixel coordinates. Null until measured so the
  // tooltip stays hidden (avoids a one-frame flash at 0,0).
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = useCallback(() => {
    // Clear any pending timeout to prevent stale callbacks
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      if (triggerRef.current) {
        setTriggerRect(triggerRef.current.getBoundingClientRect());
      }
      setCoords(null); // force a fresh measure for the new placement
      setIsVisible(true);
    }, delay);
  }, [delay]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
    setCoords(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Measure the rendered tooltip, then compute a deterministic placement:
  // start from the preferred side, flip to the opposite side only if the
  // preferred one overflows (and the opposite fits), then clamp both axes so
  // the tooltip can never run off any window edge. Computing numeric left/top
  // here — rather than mutating CSS transforms — keeps horizontal and vertical
  // adjustments independent, which is what the old string-surgery approach got
  // wrong (a horizontal clamp would break the vertical flip, leaving wide
  // tooltips stranded off the top of the screen).
  useLayoutEffect(() => {
    if (!isVisible || !triggerRect || !tooltipRef.current) return;
    const tip = tooltipRef.current.getBoundingClientRect();
    const w = tip.width;
    const h = tip.height;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const cx = triggerRect.left + triggerRect.width / 2;
    const cy = triggerRect.top + triggerRect.height / 2;

    // Auto-flip the preferred side if it would overflow and the opposite fits.
    let side = position;
    if (side === 'top' && triggerRect.top - GAP - h < EDGE_PADDING && triggerRect.bottom + GAP + h <= vh - EDGE_PADDING) {
      side = 'bottom';
    } else if (side === 'bottom' && triggerRect.bottom + GAP + h > vh - EDGE_PADDING && triggerRect.top - GAP - h >= EDGE_PADDING) {
      side = 'top';
    } else if (side === 'left' && triggerRect.left - GAP - w < EDGE_PADDING && triggerRect.right + GAP + w <= vw - EDGE_PADDING) {
      side = 'right';
    } else if (side === 'right' && triggerRect.right + GAP + w > vw - EDGE_PADDING && triggerRect.left - GAP - w >= EDGE_PADDING) {
      side = 'left';
    }

    let left: number;
    let top: number;
    switch (side) {
      case 'bottom':
        left = cx - w / 2;
        top = triggerRect.bottom + GAP;
        break;
      case 'left':
        left = triggerRect.left - GAP - w;
        top = cy - h / 2;
        break;
      case 'right':
        left = triggerRect.right + GAP;
        top = cy - h / 2;
        break;
      case 'top':
      default:
        left = cx - w / 2;
        top = triggerRect.top - GAP - h;
        break;
    }

    // Clamp to the viewport on both axes so the tooltip is always fully visible.
    left = Math.max(EDGE_PADDING, Math.min(left, vw - w - EDGE_PADDING));
    top = Math.max(EDGE_PADDING, Math.min(top, vh - h - EDGE_PADDING));

    setCoords({ left, top });
  }, [isVisible, triggerRect, position, content]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className={triggerClassName || "inline-block"}
      >
        {children}
      </div>
      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            style={{
              position: 'fixed',
              left: coords ? coords.left : 0,
              top: coords ? coords.top : 0,
              zIndex: 9999,
              // Stay hidden until measured to avoid a flash at (0,0).
              visibility: coords ? 'visible' : 'hidden',
            }}
            className={`
              px-2 py-1
              bg-gray-900 text-gray-200
              text-sm rounded shadow-lg
              border border-gray-700
              max-w-xs
              pointer-events-none
              ${className}
            `}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}

/**
 * Positioned tooltip component that renders at specific coordinates
 * Used by the tooltip store for more complex tooltips
 */
interface PositionedTooltipProps {
  content: ReactNode;
  x: number;
  y: number;
  visible: boolean;
  className?: string;
}

export function PositionedTooltip({
  content,
  x,
  y,
  visible,
  className = '',
}: PositionedTooltipProps) {
  if (!visible) return null;

  return createPortal(
    <div
      role="tooltip"
      style={{
        position: 'fixed',
        left: x,
        top: y,
        transform: 'translate(-50%, -100%) translateY(-8px)',
        zIndex: 9999,
      }}
      className={`
        px-3 py-2
        bg-gray-900 text-gray-200
        text-sm rounded-lg shadow-xl
        border border-gray-700
        max-w-sm
        pointer-events-none
        ${className}
      `}
    >
      {content}
    </div>,
    document.body
  );
}
