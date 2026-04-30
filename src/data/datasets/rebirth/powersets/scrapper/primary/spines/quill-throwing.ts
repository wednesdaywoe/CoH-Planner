/**
 * Throw Spines — COMPOSED EXPORT
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
import { ThrowSpines as base } from '@/data/generated/powersets/scrapper/primary/spines/quill-throwing';
import { overrides } from '@/data/overrides/powersets/scrapper/primary/spines/quill-throwing';

export const ThrowSpines: Power = withOverrides(base, overrides);
