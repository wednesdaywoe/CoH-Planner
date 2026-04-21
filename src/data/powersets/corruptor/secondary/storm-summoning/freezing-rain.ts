/**
 * Freezing Rain — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff storm_summoning
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FreezingRain as base } from '@/data/generated/powersets/corruptor/secondary/storm-summoning/freezing-rain';
import { overrides } from '@/data/overrides/powersets/corruptor/secondary/storm-summoning/freezing-rain';

export const FreezingRain: Power = withOverrides(base, overrides);
