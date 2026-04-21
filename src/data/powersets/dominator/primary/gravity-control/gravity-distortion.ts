/**
 * Gravity Distortion — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control gravity_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { GravityDistortion as base } from '@/data/generated/powersets/dominator/primary/gravity-control/gravity-distortion';
import { overrides } from '@/data/overrides/powersets/dominator/primary/gravity-control/gravity-distortion';

export const GravityDistortion: Power = withOverrides(base, overrides);
