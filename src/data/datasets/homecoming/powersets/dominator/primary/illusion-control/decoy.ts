/**
 * Phantom Army — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control illusion_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PhantomArmy as base } from '@/data/generated/powersets/dominator/primary/illusion-control/decoy';
import { overrides } from '@/data/overrides/powersets/dominator/primary/illusion-control/decoy';

export const PhantomArmy: Power = withOverrides(base, overrides);
