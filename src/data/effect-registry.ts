/**
 * Re-export of the engine-level effect-registry module.
 *
 * Lives in `src/data/core/` because effect display logic is server-agnostic
 * (the formatting rules describe how to render an effect, not what
 * effects exist for a given server). This facade preserves the original
 * import path.
 */
export * from './core/effect-registry';
