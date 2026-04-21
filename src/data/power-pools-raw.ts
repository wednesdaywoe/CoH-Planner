/**
 * Power Pool data — COMPOSED FACADE
 *
 * Merges the auto-generated extraction (src/data/generated/power-pools.ts)
 * with hand-written per-power overrides (src/data/overrides/power-pools.ts).
 * The planner imports `POWER_POOLS_RAW` from here. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base data:
 *   node scripts/convert-pool-powers.cjs --apply
 */
import { applyAggregateOverrides } from './_layer';
import { POWER_POOLS_RAW as base } from './generated/power-pools';
import { POWER_POOL_OVERRIDES } from './overrides/power-pools';

export const POWER_POOLS_RAW = applyAggregateOverrides(base, POWER_POOL_OVERRIDES);
