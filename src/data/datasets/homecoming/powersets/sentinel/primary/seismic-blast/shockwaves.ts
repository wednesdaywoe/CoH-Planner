/**
 * Seismic Shockwaves — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_ranged seismic_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Shockwaves as base } from '@/data/datasets/homecoming/generated/powersets/sentinel/primary/seismic-blast/shockwaves';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/sentinel/primary/seismic-blast/shockwaves';

export const Shockwaves: Power = withOverrides(base, overrides);
