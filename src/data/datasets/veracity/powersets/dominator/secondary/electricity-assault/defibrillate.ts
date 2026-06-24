/**
 * Defibrillate — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault electricity_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Defibrillate as base } from '@/data/datasets/veracity/generated/powersets/dominator/secondary/electricity-assault/defibrillate';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/dominator/secondary/electricity-assault/defibrillate';

export const Defibrillate: Power = withOverrides(base, overrides);
