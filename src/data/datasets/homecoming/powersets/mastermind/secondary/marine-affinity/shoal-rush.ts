/**
 * Shoal Rush — COMPOSED EXPORT
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
import { ShoalRush as base } from '@/data/generated/powersets/mastermind/secondary/marine-affinity/shoal-rush';
import { overrides } from '@/data/overrides/powersets/mastermind/secondary/marine-affinity/shoal-rush';

export const ShoalRush: Power = withOverrides(base, overrides);
