/**
 * Confuse — COMPOSED EXPORT
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
import { Confuse as base } from '@/data/datasets/homecoming/generated/powersets/dominator/primary/mind-control/confuse';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/dominator/primary/mind-control/confuse';

export const Confuse: Power = withOverrides(base, overrides);
