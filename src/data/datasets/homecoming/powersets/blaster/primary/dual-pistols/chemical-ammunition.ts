/**
 * Chemical Ammunition — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged dual_pistols
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ChemicalAmmunition as base } from '@/data/datasets/homecoming/generated/powersets/blaster/primary/dual-pistols/chemical-ammunition';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/primary/dual-pistols/chemical-ammunition';

export const ChemicalAmmunition: Power = withOverrides(base, overrides);
