/**
 * Catherine Wheel — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control pyrotechnic_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { CatherineWheel as base } from '@/data/generated/powersets/dominator/primary/pyrotechnic-control/catherine-wheel';
import { overrides } from '@/data/overrides/powersets/dominator/primary/pyrotechnic-control/catherine-wheel';

export const CatherineWheel: Power = withOverrides(base, overrides);
