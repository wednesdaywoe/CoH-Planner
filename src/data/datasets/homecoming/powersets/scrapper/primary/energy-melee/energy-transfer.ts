/**
 * Energy Transfer — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee energy_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EnergyTransfer as base } from '@/data/generated/powersets/scrapper/primary/energy-melee/energy-transfer';
import { overrides } from '@/data/overrides/powersets/scrapper/primary/energy-melee/energy-transfer';

export const EnergyTransfer: Power = withOverrides(base, overrides);
