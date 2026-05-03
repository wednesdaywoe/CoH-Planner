/**
 * Cryo Ammunition — COMPOSED EXPORT
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
import { CryoAmmunition as base } from '@/data/datasets/homecoming/generated/powersets/corruptor/primary/dual-pistols/cryo-ammunition';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/corruptor/primary/dual-pistols/cryo-ammunition';

export const CryoAmmunition: Power = withOverrides(base, overrides);
