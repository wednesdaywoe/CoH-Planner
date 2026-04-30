/**
 * Piercing Beam — COMPOSED EXPORT
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
import { PiercingBeam as base } from '@/data/generated/powersets/corruptor/primary/beam-rifle/piercing-beam';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/beam-rifle/piercing-beam';

export const PiercingBeam: Power = withOverrides(base, overrides);
