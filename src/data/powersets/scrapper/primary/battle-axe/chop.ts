/**
 * Chop — COMPOSED EXPORT
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
import { Chop as base } from '@/data/generated/powersets/scrapper/primary/battle-axe/chop';
import { overrides } from '@/data/overrides/powersets/scrapper/primary/battle-axe/chop';

export const Chop: Power = withOverrides(base, overrides);
