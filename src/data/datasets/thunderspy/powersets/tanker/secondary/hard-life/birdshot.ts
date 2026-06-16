/**
 * Cryoshot — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee hobo_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Birdshot as base } from '@/data/datasets/thunderspy/generated/powersets/tanker/secondary/hard-life/birdshot';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/tanker/secondary/hard-life/birdshot';

export const Birdshot: Power = withOverrides(base, overrides);
