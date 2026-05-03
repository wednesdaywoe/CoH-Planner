/**
 * Slug — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon mercenaries
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Slug as base } from '@/data/datasets/homecoming/generated/powersets/mastermind/primary/mercenaries/slug';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/mastermind/primary/mercenaries/slug';

export const Slug: Power = withOverrides(base, overrides);
