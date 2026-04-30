/**
 * Quickness — COMPOSED EXPORT
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
import { Quickness as base } from '@/data/datasets/rebirth/generated/powersets/scrapper/secondary/super-reflexes/quickness';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/scrapper/secondary/super-reflexes/quickness';

export const Quickness: Power = withOverrides(base, overrides);
