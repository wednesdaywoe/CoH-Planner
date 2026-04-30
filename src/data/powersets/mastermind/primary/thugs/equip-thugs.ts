/**
 * Equip Thugs — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon thugs
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EquipThugs as base } from '@/data/generated/powersets/mastermind/primary/thugs/equip-thugs';
import { overrides } from '@/data/overrides/powersets/mastermind/primary/thugs/equip-thugs';

export const EquipThugs: Power = withOverrides(base, overrides);
