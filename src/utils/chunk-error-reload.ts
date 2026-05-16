/**
 * Detect "stale tab, new deploy" failures and recover.
 *
 * When we deploy a new build, Vite emits chunk files with new hashed
 * filenames. A browser tab still running the previous `index.html` only
 * knows about the old hashes — any lazy `import()` (or `<script>` it
 * tries to load) 404s and the browser reports one of these errors:
 *
 *   - Safari:  "Importing a module script failed"
 *   - Chrome:  "Failed to fetch dynamically imported module"
 *   - Firefox: "error loading dynamically imported module"
 *
 * We listen for those, show a brief toast, and reload. A sessionStorage
 * flag prevents an infinite reload loop in the unusual case where the
 * fresh page also fails (e.g. real bug, not just stale assets) — the
 * second hit shows a manual-reload toast instead of auto-reloading.
 */

import { useUIStore } from '@/stores/uiStore';

const CHUNK_ERROR_PATTERNS: RegExp[] = [
  /Failed to fetch dynamically imported module/i,
  /Importing a module script failed/i,
  /error loading dynamically imported module/i,
  /Unable to preload CSS/i,
  /ChunkLoadError/i,
];

const RELOAD_FLAG = 'sidekick-chunk-reload-attempted';

function isChunkLoadError(message: string | undefined | null): boolean {
  if (!message) return false;
  return CHUNK_ERROR_PATTERNS.some((p) => p.test(message));
}

let handled = false;

function tryShowToast(toast: Parameters<ReturnType<typeof useUIStore.getState>['showToast']>[0]) {
  try {
    useUIStore.getState().showToast(toast);
    return true;
  } catch {
    return false;
  }
}

function handleChunkError(message: string) {
  if (handled) return;
  handled = true;

  const alreadyReloaded = sessionStorage.getItem(RELOAD_FLAG) === '1';

  if (alreadyReloaded) {
    // Second hit in the same session — the reload didn't fix it. Don't
    // loop; ask the user to reload manually (hard-refresh hint covers the
    // edge case where the SW cache is serving the stale shell).
    const shown = tryShowToast({
      message: 'Sidekick failed to load part of the app. Try a hard refresh (Ctrl+Shift+R) or clear your cache.',
      tone: 'warning',
      durationMs: 0,
      action: { label: 'Reload', onClick: () => window.location.reload() },
    });
    if (!shown && typeof window.confirm === 'function') {
      if (window.confirm('Sidekick failed to load part of the app. Reload?')) {
        window.location.reload();
      }
    }
    return;
  }

  sessionStorage.setItem(RELOAD_FLAG, '1');
  tryShowToast({
    message: 'A new version of Sidekick is available — reloading…',
    tone: 'info',
    durationMs: 3000,
  });
  // Short delay so the toast actually paints before reload.
  window.setTimeout(() => window.location.reload(), 1200);
  console.warn('[sidekick] chunk load failed — auto-reloading:', message);
}

export function installChunkErrorReload() {
  // After the app has been alive for a while, clear the reload-attempted
  // flag so a future deploy can use the auto-reload path again. 30 s is
  // long enough that any boot-time chunk failure has already fired.
  window.setTimeout(() => sessionStorage.removeItem(RELOAD_FLAG), 30_000);

  window.addEventListener('error', (event) => {
    if (isChunkLoadError(event.message)) handleChunkError(event.message);
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason as unknown;
    const message =
      typeof reason === 'string'
        ? reason
        : reason && typeof reason === 'object' && 'message' in reason
          ? String((reason as { message: unknown }).message)
          : undefined;
    if (isChunkLoadError(message)) handleChunkError(message ?? 'chunk load error');
  });
}
