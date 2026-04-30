/**
 * Darkest Night — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff dark_miasma
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DarkestNight as base } from '@/data/datasets/rebirth/generated/powersets/mastermind/secondary/dark-miasma/darkest-night';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/mastermind/secondary/dark-miasma/darkest-night';

export const DarkestNight: Power = withOverrides(base, overrides);
