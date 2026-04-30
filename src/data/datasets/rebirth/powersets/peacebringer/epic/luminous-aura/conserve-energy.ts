/**
 * Renew Energy — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs peacebringer_defensive luminous_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RenewEnergy as base } from '@/data/generated/powersets/peacebringer/epic/luminous-aura/conserve-energy';
import { overrides } from '@/data/overrides/powersets/peacebringer/epic/luminous-aura/conserve-energy';

export const RenewEnergy: Power = withOverrides(base, overrides);
