/**
 * Chrono Shift — COMPOSED EXPORT
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
import { ChronoShift as base } from '@/data/datasets/rebirth/generated/powersets/corruptor/secondary/time-manipulation/chrono-shift';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/corruptor/secondary/time-manipulation/chrono-shift';

export const ChronoShift: Power = withOverrides(base, overrides);
