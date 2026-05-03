/**
 * Rock Armor — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_defense stone_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RockArmor as base } from '@/data/generated/powersets/sentinel/secondary/stone-armor/stone-armor';
import { overrides } from '@/data/overrides/powersets/sentinel/secondary/stone-armor/stone-armor';

export const RockArmor: Power = withOverrides(base, overrides);
