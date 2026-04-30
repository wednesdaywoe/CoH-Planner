/**
 * Disintegrate — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged beam_rifle
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Disintegrate as base } from '@/data/datasets/rebirth/generated/powersets/blaster/primary/beam-rifle/disintegrate';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/blaster/primary/beam-rifle/disintegrate';

export const Disintegrate: Power = withOverrides(base, overrides);
