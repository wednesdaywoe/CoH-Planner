/**
 * Quicksand — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_comp stone_composition
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Quicksand as base } from '@/data/datasets/rebirth/generated/powersets/guardian/secondary/stone-composition/quicksand';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/secondary/stone-composition/quicksand';

export const Quicksand: Power = withOverrides(base, overrides);
