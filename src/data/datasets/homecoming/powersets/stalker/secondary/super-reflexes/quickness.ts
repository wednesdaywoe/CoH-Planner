/**
 * Quickness — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense super_reflexes
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Quickness as base } from '@/data/datasets/homecoming/generated/powersets/stalker/secondary/super-reflexes/quickness';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/stalker/secondary/super-reflexes/quickness';

export const Quickness: Power = withOverrides(base, overrides);
