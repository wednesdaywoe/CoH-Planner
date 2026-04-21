/**
 * Assassin's Psi Blade — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee psionic_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AssassinsPsiBlade as base } from '@/data/generated/powersets/stalker/primary/psionic-melee/assassins-psi-blade';
import { overrides } from '@/data/overrides/powersets/stalker/primary/psionic-melee/assassins-psi-blade';

export const AssassinsPsiBlade: Power = withOverrides(base, overrides);
