/**
 * Artemesian Axis — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged archery
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ArtemesianAxis as base } from '@/data/datasets/veracity/generated/powersets/defender/secondary/archery/artemesian-axis';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/defender/secondary/archery/artemesian-axis';

export const ArtemesianAxis: Power = withOverrides(base, overrides);
