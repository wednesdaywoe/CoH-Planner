/**
 * Lightning Clap — COMPOSED EXPORT
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
import { LightningClap as base } from '@/data/datasets/homecoming/generated/powersets/scrapper/primary/electrical-melee/lightning-clap';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/scrapper/primary/electrical-melee/lightning-clap';

export const LightningClap: Power = withOverrides(base, overrides);
