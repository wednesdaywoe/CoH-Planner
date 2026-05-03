/**
 * Entomb — COMPOSED EXPORT
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
import { Entomb as base } from '@/data/generated/powersets/defender/secondary/seismic-blast/entomb';
import { overrides } from '@/data/overrides/powersets/defender/secondary/seismic-blast/entomb';

export const Entomb: Power = withOverrides(base, overrides);
