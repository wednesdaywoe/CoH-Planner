/**
 * Water Jet — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged water_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { WaterJet as base } from '@/data/datasets/homecoming/generated/powersets/defender/secondary/water-blast/water-jet';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/defender/secondary/water-blast/water-jet';

export const WaterJet: Power = withOverrides(base, overrides);
