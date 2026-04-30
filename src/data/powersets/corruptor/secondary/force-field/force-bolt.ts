/**
 * Repulsion Bolt — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff force_field
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RepulsionBolt as base } from '@/data/generated/powersets/corruptor/secondary/force-field/force-bolt';
import { overrides } from '@/data/overrides/powersets/corruptor/secondary/force-field/force-bolt';

export const RepulsionBolt: Power = withOverrides(base, overrides);
