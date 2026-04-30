/**
 * Telekinetic Thrust — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault psionic_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TelekineticThrust as base } from '@/data/generated/powersets/dominator/secondary/psionic-assault/telekinetic-thrust';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/psionic-assault/telekinetic-thrust';

export const TelekineticThrust: Power = withOverrides(base, overrides);
