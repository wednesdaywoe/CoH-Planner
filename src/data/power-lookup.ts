/**
 * Power lookup facade.
 *
 * The implementation lives in the active dataset folder
 * (`src/data/datasets/homecoming/power-lookup.ts`). It's pure
 * composition over the powerset / pool / epic-pool / inherent
 * accessors — those each go through their own facades, so the
 * lookup automatically resolves against whichever dataset is
 * currently active.
 *
 * `export *` is sufficient here because nothing this module
 * exports is a primitive that needs runtime rebinding.
 */
export * from './datasets/homecoming/power-lookup';
