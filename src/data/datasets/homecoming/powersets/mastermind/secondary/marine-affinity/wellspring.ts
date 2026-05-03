/**
 * Barrier Reef — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff marine_affinity
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BarrierReef as base } from '@/data/datasets/homecoming/generated/powersets/mastermind/secondary/marine-affinity/wellspring';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/mastermind/secondary/marine-affinity/wellspring';

export const BarrierReef: Power = withOverrides(base, overrides);
