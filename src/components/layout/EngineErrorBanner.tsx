/**
 * Engine failure banner — the visible half of the engine's fail-loud path.
 *
 * Every total on screen comes from the wasm engine. When it can't load (bundle 404, wasm
 * fault) or a recalculation throws, `calculateCharacterTotals` returns an all-zero result:
 * the planner keeps rendering, reading 0% across the board, with nothing to say it is
 * wrong. Numbers that are silently wrong are worse than numbers that are missing, so the
 * error `useEngineStore` already records is surfaced here.
 *
 * Deliberately not dismissible: the condition doesn't resolve on its own, and dismissing it
 * leaves the user reading fabricated zeros.
 */

import { useEngineStore } from '@/engine/engineStore';

export function EngineErrorBanner() {
  const error = useEngineStore((s) => s.error);
  if (!error) return null;

  return (
    <div
      role="alert"
      className="bg-red-700/90 text-white text-sm flex items-center justify-center gap-2 px-4 py-1.5 flex-wrap text-center"
    >
      <span className="font-semibold">Calculation engine failed to load — the totals shown are not real.</span>
      <span className="text-white/80">Reload the page; if it persists, report it.</span>
      <code className="text-white/60 text-xs">{error}</code>
    </div>
  );
}
