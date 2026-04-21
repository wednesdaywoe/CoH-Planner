/**
 * Incendiary Ammunition — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged dual_pistols
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { IncendiaryAmmunition as base } from '@/data/generated/powersets/corruptor/primary/dual-pistols/incendiary-ammunition';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/dual-pistols/incendiary-ammunition';

export const IncendiaryAmmunition: Power = withOverrides(base, overrides);
