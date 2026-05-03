/**
 * Frostbite — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control ice_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Frostbite as base } from '@/data/datasets/homecoming/generated/powersets/dominator/primary/ice-control/frostbite';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/dominator/primary/ice-control/frostbite';

export const Frostbite: Power = withOverrides(base, overrides);
