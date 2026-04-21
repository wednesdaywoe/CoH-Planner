/**
 * Incendiary Aura — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control pyrotechnic_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { IncendiaryAura as base } from '@/data/generated/powersets/dominator/primary/pyrotechnic-control/incendiary-aura';
import { overrides } from '@/data/overrides/powersets/dominator/primary/pyrotechnic-control/incendiary-aura';

export const IncendiaryAura: Power = withOverrides(base, overrides);
