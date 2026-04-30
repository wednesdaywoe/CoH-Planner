/**
 * Confront — COMPOSED EXPORT
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
import { Confront as base } from '@/data/generated/powersets/scrapper/primary/electrical-melee/confront';
import { overrides } from '@/data/overrides/powersets/scrapper/primary/electrical-melee/confront';

export const Confront: Power = withOverrides(base, overrides);
