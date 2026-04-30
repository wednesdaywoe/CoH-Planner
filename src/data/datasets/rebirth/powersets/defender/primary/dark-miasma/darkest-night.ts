/**
 * Darkest Night — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff dark_miasma
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DarkestNight as base } from '@/data/generated/powersets/defender/primary/dark-miasma/darkest-night';
import { overrides } from '@/data/overrides/powersets/defender/primary/dark-miasma/darkest-night';

export const DarkestNight: Power = withOverrides(base, overrides);
