/**
 * Lightning Storm — COMPOSED EXPORT
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
import { LightningStorm as base } from '@/data/generated/powersets/mastermind/secondary/storm-summoning/lightning-storm';
import { overrides } from '@/data/overrides/powersets/mastermind/secondary/storm-summoning/lightning-storm';

export const LightningStorm: Power = withOverrides(base, overrides);
