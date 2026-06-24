/**
 * Kinetic Dampening — COMPOSED EXPORT
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
import { EnergyProtection as base } from '@/data/datasets/veracity/generated/powersets/stalker/secondary/energy-aura/energy-protection';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/stalker/secondary/energy-aura/energy-protection';

export const EnergyProtection: Power = withOverrides(base, overrides);
