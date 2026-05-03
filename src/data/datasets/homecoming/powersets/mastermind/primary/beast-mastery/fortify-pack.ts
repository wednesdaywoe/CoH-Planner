/**
 * Fortify Pack — COMPOSED EXPORT
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
import { FortifyPack as base } from '@/data/datasets/homecoming/generated/powersets/mastermind/primary/beast-mastery/fortify-pack';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/mastermind/primary/beast-mastery/fortify-pack';

export const FortifyPack: Power = withOverrides(base, overrides);
