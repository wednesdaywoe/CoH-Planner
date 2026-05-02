/**
 * Assault Bot — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon robotics
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AssaultBot as base } from '@/data/generated/powersets/mastermind/primary/robotics/assault-bot';
import { overrides } from '@/data/overrides/powersets/mastermind/primary/robotics/assault-bot';

export const AssaultBot: Power = withOverrides(base, overrides);
