/**
 * Confront — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee savage_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Confront as base } from '@/data/datasets/rebirth/generated/powersets/scrapper/primary/savage-melee/confront';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/scrapper/primary/savage-melee/confront';

export const Confront: Power = withOverrides(base, overrides);
