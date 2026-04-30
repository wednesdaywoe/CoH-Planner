/**
 * Gremlins — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control electric_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Gremlins as base } from '@/data/datasets/rebirth/generated/powersets/dominator/primary/electric-control/gremlins';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/dominator/primary/electric-control/gremlins';

export const Gremlins: Power = withOverrides(base, overrides);
