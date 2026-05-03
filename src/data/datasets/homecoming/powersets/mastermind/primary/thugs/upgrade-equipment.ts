/**
 * Upgrade Equipment — COMPOSED EXPORT
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
import { UpgradeEquipment as base } from '@/data/datasets/homecoming/generated/powersets/mastermind/primary/thugs/upgrade-equipment';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/mastermind/primary/thugs/upgrade-equipment';

export const UpgradeEquipment: Power = withOverrides(base, overrides);
