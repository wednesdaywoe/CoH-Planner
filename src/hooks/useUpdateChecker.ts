import { useState, useEffect, useRef } from 'react';
import { BUILD_TIME } from '@/buildTime';

const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useUpdateChecker() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    // Don't poll in dev mode — version.json is a static placeholder
    if (import.meta.env.DEV) return;

    async function checkForUpdate() {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data.buildTime && data.buildTime !== BUILD_TIME) {
          setUpdateAvailable(true);
          // Stop polling once we know there's an update
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch {
        // Network error — ignore, we'll try again next interval
      }
    }

    // Initial check after a short delay
    const timeout = setTimeout(checkForUpdate, 30_000);
    // Then check every 5 minutes
    intervalRef.current = setInterval(checkForUpdate, CHECK_INTERVAL);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { updateAvailable };
}
