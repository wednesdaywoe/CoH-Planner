/**
 * Re-export of the engine-level stat-definitions module.
 *
 * The implementation moved into `src/data/core/` because stat metadata is
 * server-agnostic (it describes the planner's display structure, not any
 * specific server's data values). This facade preserves the original
 * import path so consumers don't need to update.
 */
export * from './core/stat-definitions';
