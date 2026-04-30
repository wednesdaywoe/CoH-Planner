/**
 * Lightning Rod — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee electrical_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { LightningRod as base } from '@/data/datasets/rebirth/generated/powersets/scrapper/primary/electrical-melee/lightning-rod';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/scrapper/primary/electrical-melee/lightning-rod';

export const LightningRod: Power = withOverrides(base, overrides);
