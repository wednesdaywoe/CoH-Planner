/**
 * Kinetic Shockwave — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault kinetic_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { KineticShockwave as base } from '@/data/generated/powersets/dominator/secondary/kinetic-assault/kinetic-shockwave';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/kinetic-assault/kinetic-shockwave';

export const KineticShockwave: Power = withOverrides(base, overrides);
