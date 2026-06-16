/**
 * Psi-Blade Spin — COMPOSED EXPORT
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
import { PsiBladeSpin as base } from '@/data/datasets/thunderspy/generated/powersets/dominator/secondary/psychokinetic-assault/psiblade-spin';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/dominator/secondary/psychokinetic-assault/psiblade-spin';

export const PsiBladeSpin: Power = withOverrides(base, overrides);
