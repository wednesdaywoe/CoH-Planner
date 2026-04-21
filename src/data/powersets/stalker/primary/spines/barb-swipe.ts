/**
 * Barb Swipe — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee spines
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BarbSwipe as base } from '@/data/generated/powersets/stalker/primary/spines/barb-swipe';
import { overrides } from '@/data/overrides/powersets/stalker/primary/spines/barb-swipe';

export const BarbSwipe: Power = withOverrides(base, overrides);
