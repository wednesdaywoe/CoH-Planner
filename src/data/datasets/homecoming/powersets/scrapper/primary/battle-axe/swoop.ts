/**
 * Swoop — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee battle_axe
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Swoop as base } from '@/data/datasets/homecoming/generated/powersets/scrapper/primary/battle-axe/swoop';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/scrapper/primary/battle-axe/swoop';

export const Swoop: Power = withOverrides(base, overrides);
