/**
 * Equip Knights — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon knights
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EquipKnights as base } from '@/data/datasets/thunderspy/generated/powersets/mastermind/primary/knights/equip-knights';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/mastermind/primary/knights/equip-knights';

export const EquipKnights: Power = withOverrides(base, overrides);
