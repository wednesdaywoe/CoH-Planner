/**
 * The Lotus Drops — COMPOSED EXPORT
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
import { TheLotusDrops as base } from '@/data/generated/powersets/dominator/secondary/ninja-assault/the-lotus-drops';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/ninja-assault/the-lotus-drops';

export const TheLotusDrops: Power = withOverrides(base, overrides);
