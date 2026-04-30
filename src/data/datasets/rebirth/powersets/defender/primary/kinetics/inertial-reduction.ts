/**
 * Inertial Reduction — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff kinetics
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { InertialReduction as base } from '@/data/datasets/rebirth/generated/powersets/defender/primary/kinetics/inertial-reduction';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/defender/primary/kinetics/inertial-reduction';

export const InertialReduction: Power = withOverrides(base, overrides);
