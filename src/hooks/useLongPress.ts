/**
 * useLongPress hook - handles long-press gesture for touch devices
 *
 * Returns touch event handlers that can be spread onto an element.
 * Triggers callback after holding for the specified duration.
 * Cancels if the touch moves too far or ends early.
 */

import { useCallback, useRef } from 'react';

interface UseLongPressOptions {
  /** Duration in ms before triggering (default: 500) */
  duration?: number;
  /** Maximum movement allowed before canceling (default: 10px) */
  threshold?: number;
  /** Called when long press is triggered */
  onLongPress: () => void;
  /** Called when a regular tap occurs (touch ended before duration) */
  onTap?: () => void;
}

interface LongPressHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchCancel: (e: React.TouchEvent) => void;
}

export function useLongPress({
  duration = 500,
  threshold = 10,
  onLongPress,
  onTap,
}: UseLongPressOptions): LongPressHandlers {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    // Prevent iOS context menu (copy, share, etc.) from appearing
    e.preventDefault();

    isLongPressRef.current = false;
    const touch = e.touches[0];
    startPosRef.current = { x: touch.clientX, y: touch.clientY };

    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress();
      // Prevent the tap from firing after long press
      timerRef.current = null;
    }, duration);
  }, [duration, onLongPress]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const wasLongPress = isLongPressRef.current;
    clear();

    // If it wasn't a long press and we have a tap handler, call it
    if (!wasLongPress && onTap) {
      onTap();
    }

    // Prevent click event if it was a long press
    if (wasLongPress) {
      e.preventDefault();
    }

    isLongPressRef.current = false;
    startPosRef.current = null;
  }, [clear, onTap]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!startPosRef.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - startPosRef.current.x);
    const deltaY = Math.abs(touch.clientY - startPosRef.current.y);

    // Cancel if moved too far
    if (deltaX > threshold || deltaY > threshold) {
      clear();
      startPosRef.current = null;
    }
  }, [threshold, clear]);

  const onTouchCancel = useCallback(() => {
    clear();
    isLongPressRef.current = false;
    startPosRef.current = null;
  }, [clear]);

  return {
    onTouchStart,
    onTouchEnd,
    onTouchMove,
    onTouchCancel,
  };
}
