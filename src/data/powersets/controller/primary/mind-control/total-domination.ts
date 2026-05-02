/**
 * Total Domination — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control mind_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TotalDomination as base } from '@/data/generated/powersets/controller/primary/mind-control/total-domination';
import { overrides } from '@/data/overrides/powersets/controller/primary/mind-control/total-domination';

export const TotalDomination: Power = withOverrides(base, overrides);
