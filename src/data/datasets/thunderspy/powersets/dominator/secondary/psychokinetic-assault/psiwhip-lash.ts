/**
 * Psi-Whip Lash — COMPOSED EXPORT
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
import { PsiWhipLash as base } from '@/data/datasets/thunderspy/generated/powersets/dominator/secondary/psychokinetic-assault/psiwhip-lash';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/dominator/secondary/psychokinetic-assault/psiwhip-lash';

export const PsiWhipLash: Power = withOverrides(base, overrides);
