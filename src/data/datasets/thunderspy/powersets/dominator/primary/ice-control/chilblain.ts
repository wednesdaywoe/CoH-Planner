/**
 * Snow Storm — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control ice_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Chilblain as base } from '@/data/datasets/thunderspy/generated/powersets/dominator/primary/ice-control/chilblain';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/dominator/primary/ice-control/chilblain';

export const Chilblain: Power = withOverrides(base, overrides);
