/**
 * Greater Fire Sword — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee fiery_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { GreaterFireSword as base } from '@/data/datasets/homecoming/generated/powersets/scrapper/primary/fiery-melee/greater-fire-sword';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/scrapper/primary/fiery-melee/greater-fire-sword';

export const GreaterFireSword: Power = withOverrides(base, overrides);
