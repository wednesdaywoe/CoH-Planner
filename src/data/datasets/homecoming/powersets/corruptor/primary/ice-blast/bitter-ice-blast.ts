/**
 * Bitter Ice Blast — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged ice_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BitterIceBlast as base } from '@/data/datasets/homecoming/generated/powersets/corruptor/primary/ice-blast/bitter-ice-blast';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/corruptor/primary/ice-blast/bitter-ice-blast';

export const BitterIceBlast: Power = withOverrides(base, overrides);
