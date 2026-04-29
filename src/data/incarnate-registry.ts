/**
 * Re-export of the engine-level incarnate-registry module.
 *
 * Lives in `src/data/core/` because the slot/tier UI config and
 * abbreviation rules are server-agnostic. The actual incarnate powers,
 * effects, recipes, and salvage stay in the dataset folder. This facade
 * preserves the original import path.
 */
export * from './core/incarnate-registry';
