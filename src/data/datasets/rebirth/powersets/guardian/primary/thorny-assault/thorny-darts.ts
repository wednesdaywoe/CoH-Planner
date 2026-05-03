/**
 * Thorny Darts — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_assault thorny_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ThornyDarts as base } from '@/data/datasets/rebirth/generated/powersets/guardian/primary/thorny-assault/thorny-darts';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/primary/thorny-assault/thorny-darts';

export const ThornyDarts: Power = withOverrides(base, overrides);
