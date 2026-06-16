/**
 * Wild Roar — COMPOSED EXPORT
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
import { WildRoar as base } from '@/data/datasets/thunderspy/generated/powersets/primalist/secondary/primal-gifts/wild-roar';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/primalist/secondary/primal-gifts/wild-roar';

export const WildRoar: Power = withOverrides(base, overrides);
