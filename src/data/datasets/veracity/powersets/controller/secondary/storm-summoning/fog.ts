/**
 * Freezing Rain — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff storm_summoning
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Fog as base } from '@/data/datasets/veracity/generated/powersets/controller/secondary/storm-summoning/fog';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/controller/secondary/storm-summoning/fog';

export const Fog: Power = withOverrides(base, overrides);
