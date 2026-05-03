/**
 * Pulse Rifle Burst — COMPOSED EXPORT
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
import { PulseRifleBurst as base } from '@/data/datasets/homecoming/generated/powersets/mastermind/primary/robotics/pulse-rifle-burst';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/mastermind/primary/robotics/pulse-rifle-burst';

export const PulseRifleBurst: Power = withOverrides(base, overrides);
