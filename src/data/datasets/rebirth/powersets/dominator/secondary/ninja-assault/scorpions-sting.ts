/**
 * Scorpion's Sting — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault ninja_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ScorpionsSting as base } from '@/data/generated/powersets/dominator/secondary/ninja-assault/scorpions-sting';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/ninja-assault/scorpions-sting';

export const ScorpionsSting: Power = withOverrides(base, overrides);
