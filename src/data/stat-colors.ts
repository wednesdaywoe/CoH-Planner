/**
 * Re-export of the engine-level stat-colors palette.
 *
 * Lives in `src/data/core/` because the palette is server-agnostic
 * planner UI; this facade preserves the original import path.
 */
export * from './core/stat-colors';
