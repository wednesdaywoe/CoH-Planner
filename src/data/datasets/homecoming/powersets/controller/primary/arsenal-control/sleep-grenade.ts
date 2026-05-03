/**
 * Sleep Grenade — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control arsenal_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SleepGrenade as base } from '@/data/generated/powersets/controller/primary/arsenal-control/sleep-grenade';
import { overrides } from '@/data/overrides/powersets/controller/primary/arsenal-control/sleep-grenade';

export const SleepGrenade: Power = withOverrides(base, overrides);
