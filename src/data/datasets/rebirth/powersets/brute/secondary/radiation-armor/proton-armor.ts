/**
 * Proton Armor — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense radiation_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ProtonArmor as base } from '@/data/datasets/rebirth/generated/powersets/brute/secondary/radiation-armor/proton-armor';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/brute/secondary/radiation-armor/proton-armor';

export const ProtonArmor: Power = withOverrides(base, overrides);
