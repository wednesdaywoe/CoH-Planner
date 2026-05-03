/**
 * Radiant Aura — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_comp radiation_composition
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RadiantAura as base } from '@/data/datasets/rebirth/generated/powersets/guardian/secondary/radiation-composition/radiant-aura';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/secondary/radiation-composition/radiant-aura';

export const RadiantAura: Power = withOverrides(base, overrides);
