import { useEffect, useState } from 'react';

// Public status endpoint served from a separate GitHub Pages repo so it
// stays reachable even when Sidekick's own deploy is broken.
const STATUS_URL = 'https://wednesdaywoe.github.io/coh-sidekick-status/status.json';

type StatusValue = 'ok' | 'degraded' | 'down';

interface StatusResponse {
  status: StatusValue;
  message: string | null;
}

export interface ActiveStatus {
  status: 'degraded' | 'down';
  message: string;
}

export function useStatusCheck(): ActiveStatus | null {
  const [active, setActive] = useState<ActiveStatus | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(STATUS_URL, { cache: 'no-store' })
      .then((r) => (r.ok ? (r.json() as Promise<StatusResponse>) : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (data.status !== 'ok' && data.message) {
          setActive({ status: data.status, message: data.message });
        }
      })
      .catch(() => {
        // Fire-and-forget — any failure (network, CORS, malformed JSON) is
        // intentionally silent so a broken status endpoint never breaks Sidekick.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return active;
}
