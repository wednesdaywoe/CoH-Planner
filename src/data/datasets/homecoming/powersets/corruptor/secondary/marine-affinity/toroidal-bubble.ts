/**
 * Toroidal Bubble — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff marine_affinity
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ToroidalBubble as base } from '@/data/generated/powersets/corruptor/secondary/marine-affinity/toroidal-bubble';
import { overrides } from '@/data/overrides/powersets/corruptor/secondary/marine-affinity/toroidal-bubble';

export const ToroidalBubble: Power = withOverrides(base, overrides);
