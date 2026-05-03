/**
 * Empty Clips — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon thugs
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EmptyClips as base } from '@/data/generated/powersets/mastermind/primary/thugs/empty-clips';
import { overrides } from '@/data/overrides/powersets/mastermind/primary/thugs/empty-clips';

export const EmptyClips: Power = withOverrides(base, overrides);
