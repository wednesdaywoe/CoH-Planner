/**
 * Psi-Blade Slash — COMPOSED EXPORT
 *
 * The planner imports from here. No hand-written overrides exist for this
 * power, so it re-exports the auto-generated base directly. To add an
 * override: create the parallel overrides/<power>.ts with a non-empty
 * `overrides` object and re-run the converter. See src/data/README.md.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault telekinetic_assault
 */
import type { Power } from '@/types';
import { PsiBladeSlash as base } from '@/data/datasets/thunderspy/generated/powersets/dominator/secondary/psychokinetic-assault/psiblade-slash';

export const PsiBladeSlash: Power = base;
