/**
 * Greater Psi Blade — COMPOSED EXPORT
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
import { GreaterPsiBlade as base } from '@/data/generated/powersets/tanker/secondary/psionic-melee/greater-psi-blade';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/psionic-melee/greater-psi-blade';

export const GreaterPsiBlade: Power = withOverrides(base, overrides);
