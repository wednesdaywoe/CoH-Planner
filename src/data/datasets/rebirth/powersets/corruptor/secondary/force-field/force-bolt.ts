/**
 * Force Bolt — COMPOSED EXPORT
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
import { ForceBolt as base } from '@/data/datasets/rebirth/generated/powersets/corruptor/secondary/force-field/force-bolt';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/corruptor/secondary/force-field/force-bolt';

export const ForceBolt: Power = withOverrides(base, overrides);
