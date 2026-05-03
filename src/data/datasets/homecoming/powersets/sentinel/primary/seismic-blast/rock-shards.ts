/**
 * Rock Shards — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_ranged seismic_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RockShards as base } from '@/data/generated/powersets/sentinel/primary/seismic-blast/rock-shards';
import { overrides } from '@/data/overrides/powersets/sentinel/primary/seismic-blast/rock-shards';

export const RockShards: Power = withOverrides(base, overrides);
