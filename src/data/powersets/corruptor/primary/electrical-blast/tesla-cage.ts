/**
 * Tesla Cage — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged electrical_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TeslaCage as base } from '@/data/generated/powersets/corruptor/primary/electrical-blast/tesla-cage';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/electrical-blast/tesla-cage';

export const TeslaCage: Power = withOverrides(base, overrides);
