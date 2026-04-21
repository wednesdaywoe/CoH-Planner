/**
 * Call Swarm — COMPOSED EXPORT
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
import { CallSwarm as base } from '@/data/generated/powersets/mastermind/primary/beast-mastery/call-swarm';
import { overrides } from '@/data/overrides/powersets/mastermind/primary/beast-mastery/call-swarm';

export const CallSwarm: Power = withOverrides(base, overrides);
