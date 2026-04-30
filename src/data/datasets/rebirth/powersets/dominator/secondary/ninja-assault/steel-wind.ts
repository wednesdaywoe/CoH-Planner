/**
 * Steel Wind — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault ninja_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SteelWind as base } from '@/data/datasets/rebirth/generated/powersets/dominator/secondary/ninja-assault/steel-wind';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/dominator/secondary/ninja-assault/steel-wind';

export const SteelWind: Power = withOverrides(base, overrides);
