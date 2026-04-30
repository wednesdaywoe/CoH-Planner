/**
 * Energy Punch — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee energy_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EnergyPunch as base } from '@/data/generated/powersets/brute/primary/energy-melee/energy-punch';
import { overrides } from '@/data/overrides/powersets/brute/primary/energy-melee/energy-punch';

export const EnergyPunch: Power = withOverrides(base, overrides);
