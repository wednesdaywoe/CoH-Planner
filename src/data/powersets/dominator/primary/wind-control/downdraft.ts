/**
 * Downdraft — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control wind_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Downdraft as base } from '@/data/generated/powersets/dominator/primary/wind-control/downdraft';
import { overrides } from '@/data/overrides/powersets/dominator/primary/wind-control/downdraft';

export const Downdraft: Power = withOverrides(base, overrides);
