/**
 * Summon Lions — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon beast_mastery
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SummonLions as base } from '@/data/generated/powersets/mastermind/primary/beast-mastery/summon-lions';
import { overrides } from '@/data/overrides/powersets/mastermind/primary/beast-mastery/summon-lions';

export const SummonLions: Power = withOverrides(base, overrides);
