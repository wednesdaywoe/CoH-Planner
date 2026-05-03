/**
 * Gymnastics — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support tactical_arrow
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Gymnastics as base } from '@/data/datasets/homecoming/generated/powersets/blaster/secondary/tactical-arrow/quickness';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/secondary/tactical-arrow/quickness';

export const Gymnastics: Power = withOverrides(base, overrides);
