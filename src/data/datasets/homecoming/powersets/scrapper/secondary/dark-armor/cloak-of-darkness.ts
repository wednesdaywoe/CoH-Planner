/**
 * Cloak of Darkness — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense dark_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { CloakofDarkness as base } from '@/data/datasets/homecoming/generated/powersets/scrapper/secondary/dark-armor/cloak-of-darkness';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/scrapper/secondary/dark-armor/cloak-of-darkness';

export const CloakofDarkness: Power = withOverrides(base, overrides);
