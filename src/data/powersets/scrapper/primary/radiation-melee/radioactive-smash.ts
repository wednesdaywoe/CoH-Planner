/**
 * Radioactive Smash — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee radiation_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RadioactiveSmash as base } from '@/data/generated/powersets/scrapper/primary/radiation-melee/radioactive-smash';
import { overrides } from '@/data/overrides/powersets/scrapper/primary/radiation-melee/radioactive-smash';

export const RadioactiveSmash: Power = withOverrides(base, overrides);
