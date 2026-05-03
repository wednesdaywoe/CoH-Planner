/**
 * Elude — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense super_reflexes
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Elude as base } from '@/data/datasets/homecoming/generated/powersets/scrapper/secondary/super-reflexes/elude';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/scrapper/secondary/super-reflexes/elude';

export const Elude: Power = withOverrides(base, overrides);
