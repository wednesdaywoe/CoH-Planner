/**
 * Grounding Shield — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_comp atmospheric_composition
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { GroundingShield as base } from '@/data/datasets/rebirth/generated/powersets/guardian/secondary/atmospheric-composition/grounding-shield';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/secondary/atmospheric-composition/grounding-shield';

export const GroundingShield: Power = withOverrides(base, overrides);
