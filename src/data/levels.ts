/**
 * Level / progression facade.
 *
 * Per the multi-dataset plan, the actual level rules (max level, power-pick
 * cadence, slot-grant table, inherent power definitions) live in the active
 * dataset (e.g. `src/data/datasets/homecoming/levels.ts`).
 *
 * NOTE: this file uses direct `export * from` rather than the runtime
 * `getActiveDataset()` indirection seen in `archetypes.ts` / `at-tables.ts`.
 * That's intentional: most exports here are primitive constants
 * (`MAX_LEVEL`, `EPIC_POOL_LEVEL`, …) which JS doesn't allow live-binding
 * across module boundaries. In practice these values are identical across
 * every CoH server we'd realistically support — the file is siloed for
 * organizational tidiness and to give a future Rebirth fork a single
 * place to edit, NOT for runtime swap. If a primitive ever needs to
 * actually differ at runtime, convert that single export to a getter
 * function that reads from `getActiveDataset()`.
 */

export * from './datasets/homecoming/levels';
