/**
 * Ice Arrow — COMPOSED EXPORT
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
import { IceArrow as base } from '@/data/generated/powersets/blaster/secondary/tactical-arrow/ice-arrow';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/tactical-arrow/ice-arrow';

export const IceArrow: Power = withOverrides(base, overrides);
