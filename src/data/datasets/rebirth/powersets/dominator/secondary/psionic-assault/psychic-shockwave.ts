/**
 * Psychic Shockwave — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault psionic_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PsychicShockwave as base } from '@/data/datasets/rebirth/generated/powersets/dominator/secondary/psionic-assault/psychic-shockwave';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/dominator/secondary/psionic-assault/psychic-shockwave';

export const PsychicShockwave: Power = withOverrides(base, overrides);
