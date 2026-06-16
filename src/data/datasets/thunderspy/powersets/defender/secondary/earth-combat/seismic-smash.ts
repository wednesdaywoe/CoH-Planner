/**
 * Seismic Smash — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged earth_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SeismicSmash as base } from '@/data/datasets/thunderspy/generated/powersets/defender/secondary/earth-combat/seismic-smash';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/secondary/earth-combat/seismic-smash';

export const SeismicSmash: Power = withOverrides(base, overrides);
