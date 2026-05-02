/**
 * Melt Armor — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff thermal_radiation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { MeltArmor as base } from '@/data/generated/powersets/controller/secondary/thermal-radiation/melt-armor';
import { overrides } from '@/data/overrides/powersets/controller/secondary/thermal-radiation/melt-armor';

export const MeltArmor: Power = withOverrides(base, overrides);
