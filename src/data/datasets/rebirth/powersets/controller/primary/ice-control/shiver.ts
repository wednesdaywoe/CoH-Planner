/**
 * Shiver — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control ice_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Shiver as base } from '@/data/datasets/rebirth/generated/powersets/controller/primary/ice-control/shiver';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/controller/primary/ice-control/shiver';

export const Shiver: Power = withOverrides(base, overrides);
