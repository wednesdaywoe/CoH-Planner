/**
 * Heat Loss — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff cold_domination
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HeatLoss as base } from '@/data/generated/powersets/controller/secondary/cold-domination/heat-loss';
import { overrides } from '@/data/overrides/powersets/controller/secondary/cold-domination/heat-loss';

export const HeatLoss: Power = withOverrides(base, overrides);
