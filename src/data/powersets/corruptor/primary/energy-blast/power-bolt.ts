/**
 * Power Bolt — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged energy_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PowerBolt as base } from '@/data/generated/powersets/corruptor/primary/energy-blast/power-bolt';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/energy-blast/power-bolt';

export const PowerBolt: Power = withOverrides(base, overrides);
