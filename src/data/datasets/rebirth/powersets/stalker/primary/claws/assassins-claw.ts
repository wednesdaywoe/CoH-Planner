/**
 * Assassin's Claw — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee claws
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AssassinsClaw as base } from '@/data/datasets/rebirth/generated/powersets/stalker/primary/claws/assassins-claw';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/primary/claws/assassins-claw';

export const AssassinsClaw: Power = withOverrides(base, overrides);
