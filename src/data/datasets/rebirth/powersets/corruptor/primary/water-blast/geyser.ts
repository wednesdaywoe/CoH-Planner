/**
 * Geyser — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged water_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Geyser as base } from '@/data/datasets/rebirth/generated/powersets/corruptor/primary/water-blast/geyser';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/corruptor/primary/water-blast/geyser';

export const Geyser: Power = withOverrides(base, overrides);
