/**
 * Whitecap — COMPOSED EXPORT
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
import { Whitecap as base } from '@/data/datasets/homecoming/generated/powersets/mastermind/secondary/marine-affinity/whitecap';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/mastermind/secondary/marine-affinity/whitecap';

export const Whitecap: Power = withOverrides(base, overrides);
