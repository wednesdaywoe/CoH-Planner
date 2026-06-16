/**
 * Dual Wield — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault dual_pistols
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DualWield as base } from '@/data/datasets/thunderspy/generated/powersets/dominator/secondary/akimbo-assault/dual-wield';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/dominator/secondary/akimbo-assault/dual-wield';

export const DualWield: Power = withOverrides(base, overrides);
