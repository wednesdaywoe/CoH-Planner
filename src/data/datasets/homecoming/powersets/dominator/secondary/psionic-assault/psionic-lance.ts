/**
 * Psionic Lance — COMPOSED EXPORT
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
import { PsionicLance as base } from '@/data/datasets/homecoming/generated/powersets/dominator/secondary/psionic-assault/psionic-lance';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/dominator/secondary/psionic-assault/psionic-lance';

export const PsionicLance: Power = withOverrides(base, overrides);
