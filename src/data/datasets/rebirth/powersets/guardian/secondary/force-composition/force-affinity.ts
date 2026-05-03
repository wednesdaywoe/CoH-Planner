/**
 * Force Affinity — COMPOSED EXPORT
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
import { ForceAffinity as base } from '@/data/datasets/rebirth/generated/powersets/guardian/secondary/force-composition/force-affinity';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/secondary/force-composition/force-affinity';

export const ForceAffinity: Power = withOverrides(base, overrides);
