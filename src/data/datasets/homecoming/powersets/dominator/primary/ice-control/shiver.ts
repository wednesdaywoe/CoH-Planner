/**
 * Cold Snap — COMPOSED EXPORT
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
import { ColdSnap as base } from '@/data/generated/powersets/dominator/primary/ice-control/shiver';
import { overrides } from '@/data/overrides/powersets/dominator/primary/ice-control/shiver';

export const ColdSnap: Power = withOverrides(base, overrides);
