/**
 * Frozen Armor — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense ice_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { IceArmor as base } from '@/data/datasets/veracity/generated/powersets/scrapper/secondary/ice-armor/ice-armor';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/scrapper/secondary/ice-armor/ice-armor';

export const IceArmor: Power = withOverrides(base, overrides);
