/**
 * Power Burst — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged energy_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PowerBurst as base } from '@/data/generated/powersets/defender/secondary/energy-blast/power-burst';
import { overrides } from '@/data/overrides/powersets/defender/secondary/energy-blast/power-burst';

export const PowerBurst: Power = withOverrides(base, overrides);
