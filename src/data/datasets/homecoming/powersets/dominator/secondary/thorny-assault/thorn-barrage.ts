/**
 * Thorn Barrage — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault thorny_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ThornBarrage as base } from '@/data/generated/powersets/dominator/secondary/thorny-assault/thorn-barrage';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/thorny-assault/thorn-barrage';

export const ThornBarrage: Power = withOverrides(base, overrides);
