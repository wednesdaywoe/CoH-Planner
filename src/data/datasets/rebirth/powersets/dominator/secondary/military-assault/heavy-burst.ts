/**
 * Heavy Burst — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault military_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HeavyBurst as base } from '@/data/datasets/rebirth/generated/powersets/dominator/secondary/military-assault/heavy-burst';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/dominator/secondary/military-assault/heavy-burst';

export const HeavyBurst: Power = withOverrides(base, overrides);
