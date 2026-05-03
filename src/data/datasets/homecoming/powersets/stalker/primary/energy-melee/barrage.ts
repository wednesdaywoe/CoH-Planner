/**
 * Barrage — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee energy_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Barrage as base } from '@/data/datasets/homecoming/generated/powersets/stalker/primary/energy-melee/barrage';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/stalker/primary/energy-melee/barrage';

export const Barrage: Power = withOverrides(base, overrides);
