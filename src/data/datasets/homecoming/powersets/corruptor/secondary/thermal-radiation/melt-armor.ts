/**
 * Melt Armor — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff thermal_radiation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { MeltArmor as base } from '@/data/datasets/homecoming/generated/powersets/corruptor/secondary/thermal-radiation/melt-armor';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/corruptor/secondary/thermal-radiation/melt-armor';

export const MeltArmor: Power = withOverrides(base, overrides);
