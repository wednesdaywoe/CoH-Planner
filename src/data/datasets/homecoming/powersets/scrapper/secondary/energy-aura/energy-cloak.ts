/**
 * Energy Cloak — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense energy_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EnergyCloak as base } from '@/data/datasets/homecoming/generated/powersets/scrapper/secondary/energy-aura/energy-cloak';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/scrapper/secondary/energy-aura/energy-cloak';

export const EnergyCloak: Power = withOverrides(base, overrides);
