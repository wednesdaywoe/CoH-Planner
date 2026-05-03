/**
 * Solar Flare — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_assault luminous_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SolarFlare as base } from '@/data/datasets/rebirth/generated/powersets/guardian/primary/luminous-assault/solar-flare';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/primary/luminous-assault/solar-flare';

export const SolarFlare: Power = withOverrides(base, overrides);
