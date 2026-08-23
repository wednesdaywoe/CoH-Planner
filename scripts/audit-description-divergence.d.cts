/**
 * Types for the divergence sweep, which is a .cjs script so the converters and the tests can
 * both run it. `description-notes.test.ts` consumes these; the script itself is the source of
 * truth for the shapes.
 */
export interface DivergenceCandidate {
  /** Namespaced subject, `power:<internalName>` or `incarnate:<id>`. */
  key: string;
  name: string;
  /** The claim family the description makes and the data does not answer. */
  family: string;
}
export interface SweepResult {
  found: DivergenceCandidate[];
  scanned: number;
  declined: number;
  /** No corpus in this repo — the beta ships gzipped bundles, not a built contract tree. */
  missing: boolean;
}
export declare function sweepPowersets(dataset: string): SweepResult;
export declare function sweepHybrids(dataset: string): SweepResult;
export declare const DATASETS: string[];
