/**
 * Psi Blade Sweep — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee psionic_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PsiBladeSweep as base } from '@/data/generated/powersets/scrapper/primary/psionic-melee/psi-blade-sweep';
import { overrides } from '@/data/overrides/powersets/scrapper/primary/psionic-melee/psi-blade-sweep';

export const PsiBladeSweep: Power = withOverrides(base, overrides);
