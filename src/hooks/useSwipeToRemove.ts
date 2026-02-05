/**
 * useSwipeToRemove hook - detects horizontal swipe gesture to trigger removal
 * Returns touch handlers to spread onto elements
 */

import { useRef, useCallback } from 'react';

interface UseSwipeToRemoveOptions {
  /** Minimum horizontal distance to trigger swipe (default: 50px) */
  threshold?: number;
  /** Maximum vertical movement allowed (default: 30px) */
  maxVertical?: number;
  /** Callback when swipe is detected */
  onSwipe: () => void;
  /** Whether swipe is enabled */
  enabled?: boolean;
}

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export function useSwipeToRemove({
  threshold = 50,
  maxVertical = 30,
  onSwipe,
  enabled = true,
}: UseSwipeToRemoveOptions): SwipeHandlers {
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const currentPosRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;
      const touch = e.touches[0];
      startPosRef.current = { x: touch.clientX, y: touch.clientY };
      currentPosRef.current = { x: touch.clientX, y: touch.clientY };
    },
    [enabled]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !startPosRef.current) return;
      const touch = e.touches[0];
      currentPosRef.current = { x: touch.clientX, y: touch.clientY };
    },
    [enabled]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !startPosRef.current || !currentPosRef.current) {
        startPosRef.current = null;
        currentPosRef.current = null;
        return;
      }

      const deltaX = currentPosRef.current.x - startPosRef.current.x;
      const deltaY = Math.abs(currentPosRef.current.y - startPosRef.current.y);

      // Check if horizontal swipe exceeds threshold and vertical movement is minimal
      if (Math.abs(deltaX) >= threshold && deltaY <= maxVertical) {
        e.preventDefault();
        onSwipe();
      }

      startPosRef.current = null;
      currentPosRef.current = null;
    },
    [enabled, threshold, maxVertical, onSwipe]
  );

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}
