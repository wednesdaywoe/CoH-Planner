/**
 * Time Stop — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff time_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TimeStop as base } from '@/data/generated/powersets/mastermind/secondary/time-manipulation/time-stop';
import { overrides } from '@/data/overrides/powersets/mastermind/secondary/time-manipulation/time-stop';

export const TimeStop: Power = withOverrides(base, overrides);
