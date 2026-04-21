/**
 * Greater Ice Sword — COMPOSED EXPORT
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
import { GreaterIceSword as base } from '@/data/generated/powersets/scrapper/primary/ice-melee/greater-ice-sword';
import { overrides } from '@/data/overrides/powersets/scrapper/primary/ice-melee/greater-ice-sword';

export const GreaterIceSword: Power = withOverrides(base, overrides);
