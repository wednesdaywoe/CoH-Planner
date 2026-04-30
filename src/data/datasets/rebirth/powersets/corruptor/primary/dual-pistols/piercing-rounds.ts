/**
 * Piercing Rounds — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged dual_pistols
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PiercingRounds as base } from '@/data/datasets/rebirth/generated/powersets/corruptor/primary/dual-pistols/piercing-rounds';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/corruptor/primary/dual-pistols/piercing-rounds';

export const PiercingRounds: Power = withOverrides(base, overrides);
