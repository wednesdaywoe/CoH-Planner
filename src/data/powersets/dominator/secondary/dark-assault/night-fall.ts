/**
 * Night Fall — COMPOSED EXPORT
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
import { NightFall as base } from '@/data/generated/powersets/dominator/secondary/dark-assault/night-fall';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/dark-assault/night-fall';

export const NightFall: Power = withOverrides(base, overrides);
