/**
 * Confront — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee dark_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Confront as base } from '@/data/datasets/homecoming/generated/powersets/scrapper/primary/dark-melee/taunt';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/scrapper/primary/dark-melee/taunt';

export const Confront: Power = withOverrides(base, overrides);
