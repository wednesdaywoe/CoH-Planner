/**
 * Primal Howl — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs primal_gifts primal_gift
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PrimalHowl as base } from '@/data/datasets/veracity/generated/powersets/primalist/secondary/primal-gifts/primal-howl';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/primalist/secondary/primal-gifts/primal-howl';

export const PrimalHowl: Power = withOverrides(base, overrides);
