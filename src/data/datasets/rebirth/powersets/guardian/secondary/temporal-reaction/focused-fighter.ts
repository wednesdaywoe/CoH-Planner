/**
 * Focused Fighter — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_comp temporal_reaction
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FocusedFighter as base } from '@/data/datasets/rebirth/generated/powersets/guardian/secondary/temporal-reaction/focused-fighter';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/secondary/temporal-reaction/focused-fighter';

export const FocusedFighter: Power = withOverrides(base, overrides);
