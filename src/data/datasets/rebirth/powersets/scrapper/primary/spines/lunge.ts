/**
 * Lunge — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee quills
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Lunge as base } from '@/data/generated/powersets/scrapper/primary/spines/lunge';
import { overrides } from '@/data/overrides/powersets/scrapper/primary/spines/lunge';

export const Lunge: Power = withOverrides(base, overrides);
