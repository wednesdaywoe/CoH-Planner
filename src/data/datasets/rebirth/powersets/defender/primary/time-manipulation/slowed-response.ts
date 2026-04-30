/**
 * Slowed Response — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff time_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SlowedResponse as base } from '@/data/generated/powersets/defender/primary/time-manipulation/slowed-response';
import { overrides } from '@/data/overrides/powersets/defender/primary/time-manipulation/slowed-response';

export const SlowedResponse: Power = withOverrides(base, overrides);
