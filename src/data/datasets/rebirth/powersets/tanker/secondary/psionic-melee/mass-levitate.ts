/**
 * Mass Levitate — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee psionic_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { MassLevitate as base } from '@/data/datasets/rebirth/generated/powersets/tanker/secondary/psionic-melee/mass-levitate';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/secondary/psionic-melee/mass-levitate';

export const MassLevitate: Power = withOverrides(base, overrides);
