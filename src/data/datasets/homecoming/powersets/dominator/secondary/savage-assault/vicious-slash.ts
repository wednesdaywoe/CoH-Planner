/**
 * Vicious Slash — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault savage_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ViciousSlash as base } from '@/data/datasets/homecoming/generated/powersets/dominator/secondary/savage-assault/vicious-slash';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/dominator/secondary/savage-assault/vicious-slash';

export const ViciousSlash: Power = withOverrides(base, overrides);
