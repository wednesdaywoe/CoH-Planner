/**
 * Seismic Smash — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support earth_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SeismicSmash as base } from '@/data/generated/powersets/blaster/secondary/earth-manipulation/seismic-smash';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/earth-manipulation/seismic-smash';

export const SeismicSmash: Power = withOverrides(base, overrides);
