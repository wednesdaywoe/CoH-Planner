/**
 * Free Radicals — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee radiation_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FreeRadicals as base } from '@/data/datasets/veracity/generated/powersets/stalker/primary/radiation-melee/free-radicals';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/stalker/primary/radiation-melee/free-radicals';

export const FreeRadicals: Power = withOverrides(base, overrides);
