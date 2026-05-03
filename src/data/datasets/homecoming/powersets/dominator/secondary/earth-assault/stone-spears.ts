/**
 * Stone Spears — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault earth_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { StoneSpears as base } from '@/data/datasets/homecoming/generated/powersets/dominator/secondary/earth-assault/stone-spears';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/dominator/secondary/earth-assault/stone-spears';

export const StoneSpears: Power = withOverrides(base, overrides);
