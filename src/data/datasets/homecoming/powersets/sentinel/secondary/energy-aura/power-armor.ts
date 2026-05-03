/**
 * Power Armor — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_defense energy_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PowerArmor as base } from '@/data/datasets/homecoming/generated/powersets/sentinel/secondary/energy-aura/power-armor';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/sentinel/secondary/energy-aura/power-armor';

export const PowerArmor: Power = withOverrides(base, overrides);
