/**
 * Mental Blast — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged psychic_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { MentalBlast as base } from '@/data/datasets/rebirth/generated/powersets/blaster/primary/psychic-blast/mental-blast';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/blaster/primary/psychic-blast/mental-blast';

export const MentalBlast: Power = withOverrides(base, overrides);
