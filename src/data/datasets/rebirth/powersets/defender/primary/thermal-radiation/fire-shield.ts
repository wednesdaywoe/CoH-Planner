/**
 * Thermal Shield — COMPOSED EXPORT
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
import { ThermalShield as base } from '@/data/datasets/rebirth/generated/powersets/defender/primary/thermal-radiation/fire-shield';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/defender/primary/thermal-radiation/fire-shield';

export const ThermalShield: Power = withOverrides(base, overrides);
