/**
 * Glinting Eye — COMPOSED EXPORT
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
import { GlintingEye as base } from '@/data/datasets/rebirth/generated/powersets/guardian/primary/luminous-assault/glinting-eye';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/primary/luminous-assault/glinting-eye';

export const GlintingEye: Power = withOverrides(base, overrides);
