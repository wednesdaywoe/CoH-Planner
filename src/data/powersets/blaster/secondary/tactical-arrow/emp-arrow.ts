/**
 * ESD Arrow — COMPOSED EXPORT
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
import { ESDArrow as base } from '@/data/generated/powersets/blaster/secondary/tactical-arrow/emp-arrow';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/tactical-arrow/emp-arrow';

export const ESDArrow: Power = withOverrides(base, overrides);
