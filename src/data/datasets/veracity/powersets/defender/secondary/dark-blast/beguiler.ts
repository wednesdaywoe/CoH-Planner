/**
 * Beguiler — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged dark_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Beguiler as base } from '@/data/datasets/veracity/generated/powersets/defender/secondary/dark-blast/beguiler';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/defender/secondary/dark-blast/beguiler';

export const Beguiler: Power = withOverrides(base, overrides);
