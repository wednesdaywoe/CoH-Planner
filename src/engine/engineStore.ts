/**
 * SPIKE5 — engine readiness signal.
 *
 * The wasm engine loads asynchronously (fetch + instantiate + load_dataset), but the
 * totals hook computes synchronously. This store carries which datasets have finished
 * loading so the hook's memo re-fires when a dataset becomes available, swapping the
 * boot-time empty totals for real engine numbers. Local-only spike scaffolding.
 */

import { create } from 'zustand';

/**
 * What the engine could not calculate on the last run. The engine keeps computing around
 * an unresolvable item, so the totals still render — they are just missing (or, for a
 * missing cap, unclamped by) whatever is listed here.
 */
export interface CalcErrorReport {
  /** `context: detail` lines, verbatim from the engine, for the details list and bug reports. */
  lines: string[];
  /** Display names of PICKED powers this dataset could not resolve. */
  missingPowers: string[];
  /** Every error is a missing picked power, so the banner can name them instead of counting. */
  allMissingPowers: boolean;
}

export const EMPTY_CALC_ERRORS: CalcErrorReport = { lines: [], missingPowers: [], allMissingPowers: false };

interface EngineState {
  /** serverId → loaded. A change re-fires the totals memo. */
  loaded: Record<string, boolean>;
  /** Last engine/adapter error, surfaced for the spike (fail-loud, not silent). */
  error: string | null;
  /** Per-item calc failures from the last run — partial where `error` is total. */
  calcErrors: CalcErrorReport;
  markLoaded: (server: string) => void;
  setError: (error: string | null) => void;
  setCalcErrors: (report: CalcErrorReport) => void;
}

export const useEngineStore = create<EngineState>((set) => ({
  loaded: {},
  error: null,
  calcErrors: EMPTY_CALC_ERRORS,
  markLoaded: (server) => set((s) => (s.loaded[server] ? s : { loaded: { ...s.loaded, [server]: true } })),
  setError: (error) => set({ error }),
  // Every recalculation reports, and most report nothing — so identical content must not
  // produce a new object, or the banner's subscription re-renders on every keystroke.
  setCalcErrors: (report) =>
    set((s) =>
      s.calcErrors.lines.length === report.lines.length &&
      s.calcErrors.lines.every((l, i) => l === report.lines[i])
        ? s
        : { calcErrors: report }
    ),
}));
