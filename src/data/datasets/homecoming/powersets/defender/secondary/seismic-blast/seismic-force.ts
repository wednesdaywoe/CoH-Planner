/**
 * Seismic Force — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged seismic_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SeismicForce as base } from '@/data/generated/powersets/defender/secondary/seismic-blast/seismic-force';
import { overrides } from '@/data/overrides/powersets/defender/secondary/seismic-blast/seismic-force';

export const SeismicForce: Power = withOverrides(base, overrides);
