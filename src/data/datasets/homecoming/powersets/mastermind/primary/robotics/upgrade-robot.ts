/**
 * Upgrade Robot — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon robotics
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { UpgradeRobot as base } from '@/data/datasets/homecoming/generated/powersets/mastermind/primary/robotics/upgrade-robot';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/mastermind/primary/robotics/upgrade-robot';

export const UpgradeRobot: Power = withOverrides(base, overrides);
