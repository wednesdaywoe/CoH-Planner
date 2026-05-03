/**
 * Quicksand — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control earth_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Quicksand as base } from '@/data/generated/powersets/dominator/primary/earth-control/quicksand';
import { overrides } from '@/data/overrides/powersets/dominator/primary/earth-control/quicksand';

export const Quicksand: Power = withOverrides(base, overrides);
