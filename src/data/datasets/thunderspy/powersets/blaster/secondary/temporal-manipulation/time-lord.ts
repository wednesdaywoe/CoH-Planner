/**
 * Stable Time Loop — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support time_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TimeLord as base } from '@/data/datasets/thunderspy/generated/powersets/blaster/secondary/temporal-manipulation/time-lord';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/blaster/secondary/temporal-manipulation/time-lord';

export const TimeLord: Power = withOverrides(base, overrides);
