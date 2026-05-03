/**
 * Enervating Field — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff radiation_emission
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EnervatingField as base } from '@/data/datasets/homecoming/generated/powersets/corruptor/secondary/radiation-emission/enervating-field';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/corruptor/secondary/radiation-emission/enervating-field';

export const EnervatingField: Power = withOverrides(base, overrides);
