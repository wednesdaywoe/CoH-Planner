/**
 * Thunder Strike — COMPOSED EXPORT
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
import { PowerSink as base } from '@/data/datasets/thunderspy/generated/powersets/dominator/secondary/electricity-assault/power-sink';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/dominator/secondary/electricity-assault/power-sink';

export const PowerSink: Power = withOverrides(base, overrides);
