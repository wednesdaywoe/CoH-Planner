/**
 * Power Armor — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense energy_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PowerArmor as base } from '@/data/generated/powersets/tanker/primary/energy-aura/energy-reserve';
import { overrides } from '@/data/overrides/powersets/tanker/primary/energy-aura/energy-reserve';

export const PowerArmor: Power = withOverrides(base, overrides);
