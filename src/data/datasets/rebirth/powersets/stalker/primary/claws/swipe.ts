/**
 * Swipe — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee claws
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Swipe as base } from '@/data/datasets/rebirth/generated/powersets/stalker/primary/claws/swipe';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/primary/claws/swipe';

export const Swipe: Power = withOverrides(base, overrides);
