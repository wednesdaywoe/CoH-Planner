/**
 * Snow Storm — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff storm_summoning
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SnowStorm as base } from '@/data/datasets/homecoming/generated/powersets/mastermind/secondary/storm-summoning/snow-storm';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/mastermind/secondary/storm-summoning/snow-storm';

export const SnowStorm: Power = withOverrides(base, overrides);
