/**
 * Blazing Bolt — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault fiery_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BlazingBolt as base } from '@/data/datasets/rebirth/generated/powersets/dominator/secondary/fiery-assault/blazing-bolt';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/dominator/secondary/fiery-assault/blazing-bolt';

export const BlazingBolt: Power = withOverrides(base, overrides);
