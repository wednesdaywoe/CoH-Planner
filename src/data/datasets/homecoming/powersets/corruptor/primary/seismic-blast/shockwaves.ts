/**
 * Seismic Shockwaves — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged seismic_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SeismicShockwaves as base } from '@/data/generated/powersets/corruptor/primary/seismic-blast/shockwaves';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/seismic-blast/shockwaves';

export const SeismicShockwaves: Power = withOverrides(base, overrides);
