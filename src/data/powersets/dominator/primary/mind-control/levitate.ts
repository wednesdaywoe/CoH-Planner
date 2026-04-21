/**
 * Levitate — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control mind_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Levitate as base } from '@/data/generated/powersets/dominator/primary/mind-control/levitate';
import { overrides } from '@/data/overrides/powersets/dominator/primary/mind-control/levitate';

export const Levitate: Power = withOverrides(base, overrides);
