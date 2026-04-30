/**
 * Stalagmites — COMPOSED EXPORT
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
import { Stalagmites as base } from '@/data/datasets/rebirth/generated/powersets/dominator/primary/earth-control/stalagmites';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/dominator/primary/earth-control/stalagmites';

export const Stalagmites: Power = withOverrides(base, overrides);
