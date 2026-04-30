/**
 * Shatter — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee war_mace
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Shatter as base } from '@/data/datasets/rebirth/generated/powersets/scrapper/primary/war-mace/shatter';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/scrapper/primary/war-mace/shatter';

export const Shatter: Power = withOverrides(base, overrides);
