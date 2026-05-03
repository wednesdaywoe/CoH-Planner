/**
 * Epic/Patron Pool data — COMPOSED FACADE
 *
 * Merges the auto-generated extraction (src/data/generated/epic-pools.ts)
 * with hand-written per-power overrides (src/data/overrides/epic-pools.ts).
 * The planner imports `EPIC_POOLS_RAW` from here. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base data:
 *   node scripts/convert-epic-pools.cjs --apply
 */
import { applyAggregateOverrides } from '@/data/_layer';
import { EPIC_POOLS_RAW as base } from './generated/epic-pools';
import { EPIC_POOL_OVERRIDES } from './overrides/epic-pools';

export const EPIC_POOLS_RAW = applyAggregateOverrides(base, EPIC_POOL_OVERRIDES);
