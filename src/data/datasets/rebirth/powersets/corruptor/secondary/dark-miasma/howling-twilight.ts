/**
 * Howling Twilight — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff dark_miasma
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HowlingTwilight as base } from '@/data/datasets/rebirth/generated/powersets/corruptor/secondary/dark-miasma/howling-twilight';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/corruptor/secondary/dark-miasma/howling-twilight';

export const HowlingTwilight: Power = withOverrides(base, overrides);
