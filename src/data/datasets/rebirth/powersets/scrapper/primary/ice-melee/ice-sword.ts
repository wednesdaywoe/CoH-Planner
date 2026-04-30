/**
 * Ice Sword — COMPOSED EXPORT
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
import { IceSword as base } from '@/data/datasets/rebirth/generated/powersets/scrapper/primary/ice-melee/ice-sword';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/scrapper/primary/ice-melee/ice-sword';

export const IceSword: Power = withOverrides(base, overrides);
