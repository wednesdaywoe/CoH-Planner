/**
 * Heat Exhaustion — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff thermal_radiation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HeatExhaustion as base } from '@/data/generated/powersets/defender/primary/thermal-radiation/heat-exhaustion';
import { overrides } from '@/data/overrides/powersets/defender/primary/thermal-radiation/heat-exhaustion';

export const HeatExhaustion: Power = withOverrides(base, overrides);
