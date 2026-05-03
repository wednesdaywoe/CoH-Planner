/**
 * Envenomed Blades — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_assault martial_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EnvenomedBlades as base } from '@/data/datasets/rebirth/generated/powersets/guardian/primary/martial-assault/envenomed-blades';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/primary/martial-assault/envenomed-blades';

export const EnvenomedBlades: Power = withOverrides(base, overrides);
