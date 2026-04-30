/**
 * Blizzard — COMPOSED EXPORT
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
import { Blizzard as base } from '@/data/datasets/rebirth/generated/powersets/corruptor/primary/ice-blast/blizzard';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/corruptor/primary/ice-blast/blizzard';

export const Blizzard: Power = withOverrides(base, overrides);
