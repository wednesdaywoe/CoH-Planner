/**
 * Sleet — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_comp ice_composition
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Sleet as base } from '@/data/datasets/rebirth/generated/powersets/guardian/secondary/ice-composition/sleet';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/secondary/ice-composition/sleet';

export const Sleet: Power = withOverrides(base, overrides);
