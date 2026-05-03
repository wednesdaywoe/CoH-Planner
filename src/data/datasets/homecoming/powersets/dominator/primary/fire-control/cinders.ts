/**
 * Cinders — COMPOSED EXPORT
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
import { Cinders as base } from '@/data/datasets/homecoming/generated/powersets/dominator/primary/fire-control/cinders';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/dominator/primary/fire-control/cinders';

export const Cinders: Power = withOverrides(base, overrides);
