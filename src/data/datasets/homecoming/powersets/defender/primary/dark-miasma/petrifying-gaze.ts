/**
 * Petrifying Gaze — COMPOSED EXPORT
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
import { PetrifyingGaze as base } from '@/data/datasets/homecoming/generated/powersets/defender/primary/dark-miasma/petrifying-gaze';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/defender/primary/dark-miasma/petrifying-gaze';

export const PetrifyingGaze: Power = withOverrides(base, overrides);
