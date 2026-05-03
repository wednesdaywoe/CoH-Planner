/**
 * Stalagmite — COMPOSED EXPORT
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
import { Stalagmite as base } from '@/data/datasets/homecoming/generated/powersets/defender/secondary/seismic-blast/stalagmite';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/defender/secondary/seismic-blast/stalagmite';

export const Stalagmite: Power = withOverrides(base, overrides);
