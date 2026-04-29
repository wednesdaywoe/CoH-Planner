/**
 * Re-export of the engine-level help-topics module.
 *
 * Lives in `src/data/core/` because the planner's help content describes
 * the UI itself, not server data. This facade preserves the original
 * import path.
 */
export * from './core/help-topics';
