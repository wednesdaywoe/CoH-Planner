/**
 * Tooltip component
 *
 * Can be used in two ways:
 * 1. Wrap content and provide tooltip text
 * 2. Portal-based positioning for complex tooltips
 */

import { useState, useRef, type ReactNode, type CSSProperties } from 'react';
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
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    timeoutRef.current = window.setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = position === 'bottom' ? rect.bottom : rect.top;
        setCoords({ x, y });
      }
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

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
