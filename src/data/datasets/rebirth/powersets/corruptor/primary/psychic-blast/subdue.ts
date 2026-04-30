/**
 * Subdue — COMPOSED EXPORT
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
import { Subdue as base } from '@/data/datasets/rebirth/generated/powersets/corruptor/primary/psychic-blast/subdue';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/corruptor/primary/psychic-blast/subdue';

export const Subdue: Power = withOverrides(base, overrides);
