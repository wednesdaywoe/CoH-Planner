/**
 * Overcharge — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged beam_rifle
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Overcharge as base } from '@/data/datasets/homecoming/generated/powersets/corruptor/primary/beam-rifle/overcharge';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/corruptor/primary/beam-rifle/overcharge';

export const Overcharge: Power = withOverrides(base, overrides);
