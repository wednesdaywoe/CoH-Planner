/**
 * Psi-Whip Crack — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault telekinetic_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PsiWhipCrack as base } from '@/data/datasets/thunderspy/generated/powersets/dominator/secondary/psychokinetic-assault/psiwhip-crack';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/dominator/secondary/psychokinetic-assault/psiwhip-crack';

export const PsiWhipCrack: Power = withOverrides(base, overrides);
