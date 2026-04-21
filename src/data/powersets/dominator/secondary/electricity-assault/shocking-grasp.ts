/**
 * Voltaic Sentinel — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault electricity_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { VoltaicSentinel as base } from '@/data/generated/powersets/dominator/secondary/electricity-assault/shocking-grasp';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/electricity-assault/shocking-grasp';

export const VoltaicSentinel: Power = withOverrides(base, overrides);
