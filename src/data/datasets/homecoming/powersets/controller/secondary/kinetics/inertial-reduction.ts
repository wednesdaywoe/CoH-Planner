/**
 * Inertial Reduction — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff kinetics
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { InertialReduction as base } from '@/data/generated/powersets/controller/secondary/kinetics/inertial-reduction';
import { overrides } from '@/data/overrides/powersets/controller/secondary/kinetics/inertial-reduction';

export const InertialReduction: Power = withOverrides(base, overrides);
