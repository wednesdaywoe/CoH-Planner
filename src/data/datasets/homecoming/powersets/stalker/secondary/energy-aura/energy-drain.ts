/**
 * Energy Drain — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense energy_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EnergyDrain as base } from '@/data/datasets/homecoming/generated/powersets/stalker/secondary/energy-aura/energy-drain';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/stalker/secondary/energy-aura/energy-drain';

export const EnergyDrain: Power = withOverrides(base, overrides);
