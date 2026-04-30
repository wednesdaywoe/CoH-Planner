/**
 * One Thousand Cuts — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee dual_blades
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { OneThousandCuts as base } from '@/data/datasets/rebirth/generated/powersets/scrapper/primary/dual-blades/high-low';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/scrapper/primary/dual-blades/high-low';

export const OneThousandCuts: Power = withOverrides(base, overrides);
