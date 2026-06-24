/**
 * Balor’s Whip — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control fire_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BalorsWhip as base } from '@/data/datasets/veracity/generated/powersets/dominator/primary/fire-control/balor-s-whip';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/dominator/primary/fire-control/balor-s-whip';

export const BalorsWhip: Power = withOverrides(base, overrides);
