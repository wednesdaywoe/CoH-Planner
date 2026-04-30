/**
 * Equip Mercenary — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon mercenaries
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EquipMercenary as base } from '@/data/datasets/rebirth/generated/powersets/mastermind/primary/mercenaries/equip-mercenary';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/mastermind/primary/mercenaries/equip-mercenary';

export const EquipMercenary: Power = withOverrides(base, overrides);
