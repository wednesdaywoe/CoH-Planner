/**
 * Crystal Armor — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense stone_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { CrystalArmor as base } from '@/data/generated/powersets/scrapper/secondary/stone-armor/crystal-armor';
import { overrides } from '@/data/overrides/powersets/scrapper/secondary/stone-armor/crystal-armor';

export const CrystalArmor: Power = withOverrides(base, overrides);
