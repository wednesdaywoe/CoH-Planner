/**
 * Sonic Clap — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee sonic_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SonicClap as base } from '@/data/datasets/homecoming/generated/powersets/scrapper/primary/sonic-melee/sonic-clap';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/scrapper/primary/sonic-melee/sonic-clap';

export const SonicClap: Power = withOverrides(base, overrides);
