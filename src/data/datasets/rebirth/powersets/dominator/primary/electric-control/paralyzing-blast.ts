/**
 * Paralyzing Blast — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control electric_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ParalyzingBlast as base } from '@/data/generated/powersets/dominator/primary/electric-control/paralyzing-blast';
import { overrides } from '@/data/overrides/powersets/dominator/primary/electric-control/paralyzing-blast';

export const ParalyzingBlast: Power = withOverrides(base, overrides);
