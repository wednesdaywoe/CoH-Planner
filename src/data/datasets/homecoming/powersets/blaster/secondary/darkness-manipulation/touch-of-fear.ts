/**
 * Touch of the Beyond — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support darkness_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TouchoftheBeyond as base } from '@/data/datasets/homecoming/generated/powersets/blaster/secondary/darkness-manipulation/touch-of-fear';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/secondary/darkness-manipulation/touch-of-fear';

export const TouchoftheBeyond: Power = withOverrides(base, overrides);
