/**
 * Conductive Aura — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control electric_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { StunningAura as base } from '@/data/datasets/thunderspy/generated/powersets/controller/primary/electric-control/stunning-aura';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/controller/primary/electric-control/stunning-aura';

export const StunningAura: Power = withOverrides(base, overrides);
