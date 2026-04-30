/**
 * Energy Absorption — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense ice_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EnergyAbsorption as base } from '@/data/datasets/rebirth/generated/powersets/tanker/primary/ice-armor/energy-absorption';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/primary/ice-armor/energy-absorption';

export const EnergyAbsorption: Power = withOverrides(base, overrides);
