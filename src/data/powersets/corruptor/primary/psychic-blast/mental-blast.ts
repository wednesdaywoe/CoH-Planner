/**
 * Mental Blast — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged psychic_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { MentalBlast as base } from '@/data/generated/powersets/corruptor/primary/psychic-blast/mental-blast';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/psychic-blast/mental-blast';

export const MentalBlast: Power = withOverrides(base, overrides);
