/**
 * useIsTouchDevice - Detects if the primary input device is touch (coarse pointer).
 *
 * Uses `(pointer: coarse)` media query which is more reliable than screen width
 * for detecting touch vs mouse input — works correctly for tablets in landscape.
 */

import { useState, useEffect } from 'react';

/** Non-hook version for use outside React components */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

/** React hook that reactively tracks touch device status */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(() => isTouchDevice());

  useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)');
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isTouch;
}
