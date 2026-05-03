/**
 * Positron Cell — COMPOSED EXPORT
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
import { PositronCell as base } from '@/data/generated/powersets/blaster/secondary/atomic-manipulation/positron-cell';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/atomic-manipulation/positron-cell';

export const PositronCell: Power = withOverrides(base, overrides);
