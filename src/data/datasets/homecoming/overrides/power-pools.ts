/**
 * Power Pool overrides — hand-written deltas keyed by a power's
 * `fullName` (e.g. `Pool.Fighting.Boxing`). The composed facade
 * (src/data/power-pools-raw.ts) merges each entry into its matching
 * generated power via `withOverrides`.
 *
 * Empty record means no overrides. Add entries here when the stale
 * CoD2 raw extraction disagrees with current HC game values. See
 * src/data/README.md for the layering convention.
 */
import type { Power } from '@/types';

export const POWER_POOL_OVERRIDES: Record<string, Partial<Power>> = {};
