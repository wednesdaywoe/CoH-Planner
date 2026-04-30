/**
 * Touch of Fear — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee dark_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TouchofFear as base } from '@/data/datasets/rebirth/generated/powersets/scrapper/primary/dark-melee/touch-of-fear';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/scrapper/primary/dark-melee/touch-of-fear';

export const TouchofFear: Power = withOverrides(base, overrides);
