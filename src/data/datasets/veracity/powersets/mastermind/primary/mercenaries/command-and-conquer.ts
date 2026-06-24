/**
 * Command and Conquer — COMPOSED EXPORT
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
import { CommandandConquer as base } from '@/data/datasets/veracity/generated/powersets/mastermind/primary/mercenaries/command-and-conquer';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/mastermind/primary/mercenaries/command-and-conquer';

export const CommandandConquer: Power = withOverrides(base, overrides);
