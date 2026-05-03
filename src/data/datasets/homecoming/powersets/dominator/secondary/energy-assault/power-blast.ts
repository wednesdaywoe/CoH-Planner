/**
 * Power Blast — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault energy_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PowerBlast as base } from '@/data/datasets/homecoming/generated/powersets/dominator/secondary/energy-assault/power-blast';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/dominator/secondary/energy-assault/power-blast';

export const PowerBlast: Power = withOverrides(base, overrides);
