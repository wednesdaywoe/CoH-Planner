/**
 * Force Shielding — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_comp force_composition
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ForceShielding as base } from '@/data/datasets/rebirth/generated/powersets/guardian/secondary/force-composition/force-skin';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/secondary/force-composition/force-skin';

export const ForceShielding: Power = withOverrides(base, overrides);
