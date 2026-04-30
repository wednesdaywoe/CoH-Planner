/**
 * Snow Storm — COMPOSED EXPORT
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
import { SnowStorm as base } from '@/data/datasets/rebirth/generated/powersets/corruptor/secondary/storm-summoning/snow-storm';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/corruptor/secondary/storm-summoning/snow-storm';

export const SnowStorm: Power = withOverrides(base, overrides);
