/**
 * Call Hawk — COMPOSED EXPORT
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
import { CallHawk as base } from '@/data/datasets/homecoming/generated/powersets/mastermind/primary/beast-mastery/call-hawk';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/mastermind/primary/beast-mastery/call-hawk';

export const CallHawk: Power = withOverrides(base, overrides);
