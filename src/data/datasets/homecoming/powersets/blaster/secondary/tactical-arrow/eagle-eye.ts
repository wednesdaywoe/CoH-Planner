/**
 * Eagle Eye — COMPOSED EXPORT
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
import { EagleEye as base } from '@/data/generated/powersets/blaster/secondary/tactical-arrow/eagle-eye';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/tactical-arrow/eagle-eye';

export const EagleEye: Power = withOverrides(base, overrides);
