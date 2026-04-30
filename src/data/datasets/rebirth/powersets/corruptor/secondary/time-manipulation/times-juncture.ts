/**
 * Time's Juncture — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff time_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TimesJuncture as base } from '@/data/generated/powersets/corruptor/secondary/time-manipulation/times-juncture';
import { overrides } from '@/data/overrides/powersets/corruptor/secondary/time-manipulation/times-juncture';

export const TimesJuncture: Power = withOverrides(base, overrides);
