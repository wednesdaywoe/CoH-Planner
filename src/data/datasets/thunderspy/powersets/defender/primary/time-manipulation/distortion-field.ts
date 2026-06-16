/**
 * Distortion Field — COMPOSED EXPORT
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
import { DistortionField as base } from '@/data/datasets/thunderspy/generated/powersets/defender/primary/time-manipulation/distortion-field';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/primary/time-manipulation/distortion-field';

export const DistortionField: Power = withOverrides(base, overrides);
