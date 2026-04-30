/**
 * Epic/Patron Pool data — COMPOSED FACADE
 *
 * Merges the auto-generated extraction with hand-written per-power
 * overrides. The planner imports from here; see src/data/README.md.
 *
 * To re-generate the base data:
 *   node scripts/convert-epic-pools.cjs --apply
 */
import { applyAggregateOverrides } from './_layer';
import { EPIC_POOLS_RAW as base } from './generated/epic-pools';
import { EPIC_POOL_OVERRIDES } from './overrides/epic-pools';

export const EPIC_POOLS_RAW = applyAggregateOverrides(base, EPIC_POOL_OVERRIDES);
