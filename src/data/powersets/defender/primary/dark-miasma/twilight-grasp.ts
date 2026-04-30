/**
 * Twilight Grasp — COMPOSED EXPORT
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
import { TwilightGrasp as base } from '@/data/generated/powersets/defender/primary/dark-miasma/twilight-grasp';
import { overrides } from '@/data/overrides/powersets/defender/primary/dark-miasma/twilight-grasp';

export const TwilightGrasp: Power = withOverrides(base, overrides);
