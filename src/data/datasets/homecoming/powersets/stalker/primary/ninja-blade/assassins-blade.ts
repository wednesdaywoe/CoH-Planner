/**
 * Assassin's Blade — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee ninja_sword
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AssassinsBlade as base } from '@/data/datasets/homecoming/generated/powersets/stalker/primary/ninja-blade/assassins-blade';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/stalker/primary/ninja-blade/assassins-blade';

export const AssassinsBlade: Power = withOverrides(base, overrides);
