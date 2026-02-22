/**
 * Tooltip component
 *
 * Can be used in two ways:
 * 1. Wrap content and provide tooltip text
 * 2. Portal-based positioning for complex tooltips
 */

import { useState, useRef, useCallback, useEffect, type ReactNode, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, triggerTop: 0, triggerBottom: 0 });
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
        const rect = triggerRef.current.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = position === 'bottom' ? rect.bottom : rect.top;
        setCoords({ x, y, triggerTop: rect.top, triggerBottom: rect.bottom });
      }
      setIsVisible(true);
    }, delay);
  }, [position, delay]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Clamp tooltip to viewport after it renders
  const clampToViewport = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    (tooltipRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    const rect = node.getBoundingClientRect();
    const padding = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Horizontal clamping
    if (rect.left < padding) {
      node.style.left = `${padding}px`;
      node.style.transform = node.style.transform.replace('translateX(-50%)', 'translateX(0)');
      node.style.transform = node.style.transform.replace('translate(-50%,', 'translate(0,');
    } else if (rect.right > vw - padding) {
      node.style.left = `${vw - padding}px`;
      node.style.transform = node.style.transform.replace('translateX(-50%)', 'translateX(-100%)');
      node.style.transform = node.style.transform.replace('translate(-50%,', 'translate(-100%,');
    }

    // Vertical clamping — flip tooltip if it overflows top or bottom
    if (position === 'top' && rect.top < padding) {
      // Flip to below the trigger
      node.style.top = `${coords.triggerBottom + 8}px`;
      node.style.transform = node.style.transform
        .replace('translateY(-100%)', 'translateY(0)')
        .replace('translate(-50%, -100%)', 'translate(-50%, 0)');
    } else if (position === 'bottom' && rect.bottom > vh - padding) {
      // Flip to above the trigger
      node.style.top = `${coords.triggerTop - 8}px`;
      node.style.transform = node.style.transform
        .replace('translateY(0)', 'translateY(-100%)')
        .replace('translate(-50%, 0)', 'translate(-50%, -100%)');
    }
  }, [position, coords.triggerTop, coords.triggerBottom]);

  const getTooltipStyle = (): CSSProperties => {
    const baseStyle: CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyle,
          left: coords.x,
          top: coords.y,
          transform: 'translate(-50%, -100%) translateY(-8px)',
        };
      case 'bottom':
        return {
          ...baseStyle,
          left: coords.x,
          top: coords.y,
          transform: 'translate(-50%, 0) translateY(8px)',
        };
      case 'left':
        return {
          ...baseStyle,
          left: coords.x,
          top: coords.y,
          transform: 'translate(-100%, -50%) translateX(-8px)',
        };
      case 'right':
        return {
          ...baseStyle,
          left: coords.x,
          top: coords.y,
          transform: 'translate(0, -50%) translateX(8px)',
        };
      default:
        return baseStyle;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible &&
        createPortal(
          <div
            ref={clampToViewport}
            role="tooltip"
            style={getTooltipStyle()}
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
