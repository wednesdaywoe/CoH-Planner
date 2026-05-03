/**
 * Category Five — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged storm_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { CategoryFive as base } from '@/data/generated/powersets/corruptor/primary/storm-blast/category-five';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/storm-blast/category-five';

export const CategoryFive: Power = withOverrides(base, overrides);
