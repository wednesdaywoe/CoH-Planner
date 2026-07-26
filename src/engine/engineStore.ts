/**
 * SPIKE5 — engine readiness signal.
 *
 * The wasm engine loads asynchronously (fetch + instantiate + load_dataset), but the
 * totals hook computes synchronously. This store carries which datasets have finished
 * loading so the hook's memo re-fires when a dataset becomes available, swapping the
 * boot-time empty totals for real engine numbers. Local-only spike scaffolding.
 */

import { create } from 'zustand';

interface EngineState {
  /** serverId → loaded. A change re-fires the totals memo. */
  loaded: Record<string, boolean>;
  /** Last engine/adapter error, surfaced for the spike (fail-loud, not silent). */
  error: string | null;
  markLoaded: (server: string) => void;
  setError: (error: string | null) => void;
}

export const useEngineStore = create<EngineState>((set) => ({
  loaded: {},
  error: null,
  markLoaded: (server) => set((s) => (s.loaded[server] ? s : { loaded: { ...s.loaded, [server]: true } })),
  setError: (error) => set({ error }),
}));
