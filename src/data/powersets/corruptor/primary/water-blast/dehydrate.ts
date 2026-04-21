/**
 * Dehydrate — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged water_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Dehydrate as base } from '@/data/generated/powersets/corruptor/primary/water-blast/dehydrate';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/water-blast/dehydrate';

export const Dehydrate: Power = withOverrides(base, overrides);
