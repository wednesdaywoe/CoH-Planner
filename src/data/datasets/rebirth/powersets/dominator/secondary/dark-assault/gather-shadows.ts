/**
 * Gather Shadows — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault dark_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { GatherShadows as base } from '@/data/datasets/rebirth/generated/powersets/dominator/secondary/dark-assault/gather-shadows';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/dominator/secondary/dark-assault/gather-shadows';

export const GatherShadows: Power = withOverrides(base, overrides);
