/**
 * Shuriken Throw — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault martial_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ShurikenThrow as base } from '@/data/datasets/homecoming/generated/powersets/dominator/secondary/martial-assault/shuriken-throw';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/dominator/secondary/martial-assault/shuriken-throw';

export const ShurikenThrow: Power = withOverrides(base, overrides);
