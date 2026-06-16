/**
 * Irradiated Ground — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support radiation_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ChokingCloud as base } from '@/data/datasets/thunderspy/generated/powersets/blaster/secondary/atomic-manipulation/choking-cloud';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/blaster/secondary/atomic-manipulation/choking-cloud';

export const ChokingCloud: Power = withOverrides(base, overrides);
