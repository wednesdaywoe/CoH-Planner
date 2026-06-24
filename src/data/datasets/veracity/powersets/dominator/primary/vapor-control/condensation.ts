/**
 * Condensation — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control quovapor_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Condensation as base } from '@/data/datasets/veracity/generated/powersets/dominator/primary/vapor-control/condensation';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/dominator/primary/vapor-control/condensation';

export const Condensation: Power = withOverrides(base, overrides);
