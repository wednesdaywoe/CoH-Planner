/**
 * Storm Cell — COMPOSED EXPORT
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
import { StormCell as base } from '@/data/datasets/homecoming/generated/powersets/corruptor/primary/storm-blast/storm-cell';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/corruptor/primary/storm-blast/storm-cell';

export const StormCell: Power = withOverrides(base, overrides);
