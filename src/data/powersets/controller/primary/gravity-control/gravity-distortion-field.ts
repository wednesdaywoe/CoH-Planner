/**
 * Gravity Distortion Field — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control gravity_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { GravityDistortionField as base } from '@/data/generated/powersets/controller/primary/gravity-control/gravity-distortion-field';
import { overrides } from '@/data/overrides/powersets/controller/primary/gravity-control/gravity-distortion-field';

export const GravityDistortionField: Power = withOverrides(base, overrides);
