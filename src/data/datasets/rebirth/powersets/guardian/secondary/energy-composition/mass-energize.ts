/**
 * Mass Energize — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_comp energy_composition
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { MassEnergize as base } from '@/data/datasets/rebirth/generated/powersets/guardian/secondary/energy-composition/mass-energize';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/secondary/energy-composition/mass-energize';

export const MassEnergize: Power = withOverrides(base, overrides);
