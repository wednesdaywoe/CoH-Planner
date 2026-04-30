/**
 * Build Up — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee ice_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BuildUp as base } from '@/data/generated/powersets/scrapper/primary/ice-melee/build-up';
import { overrides } from '@/data/overrides/powersets/scrapper/primary/ice-melee/build-up';

export const BuildUp: Power = withOverrides(base, overrides);
