/**
 * Shadow Maul — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee dark_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ShadowMaul as base } from '@/data/datasets/homecoming/generated/powersets/tanker/secondary/dark-melee/shadow-maul';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/secondary/dark-melee/shadow-maul';

export const ShadowMaul: Power = withOverrides(base, overrides);
