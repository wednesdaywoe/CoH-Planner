/**
 * Summon Demons — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon demon_summoning
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SummonDemons as base } from '@/data/generated/powersets/mastermind/primary/demon-summoning/summon-demons';
import { overrides } from '@/data/overrides/powersets/mastermind/primary/demon-summoning/summon-demons';

export const SummonDemons: Power = withOverrides(base, overrides);
