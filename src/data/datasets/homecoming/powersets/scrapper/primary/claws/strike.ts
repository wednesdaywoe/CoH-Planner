/**
 * Strike — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee claws
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Strike as base } from '@/data/generated/powersets/scrapper/primary/claws/strike';
import { overrides } from '@/data/overrides/powersets/scrapper/primary/claws/strike';

export const Strike: Power = withOverrides(base, overrides);
