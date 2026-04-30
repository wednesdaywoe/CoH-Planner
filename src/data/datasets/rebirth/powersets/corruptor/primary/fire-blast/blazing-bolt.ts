/**
 * Blazing Bolt — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged fire_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BlazingBolt as base } from '@/data/generated/powersets/corruptor/primary/fire-blast/blazing-bolt';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/fire-blast/blazing-bolt';

export const BlazingBolt: Power = withOverrides(base, overrides);
