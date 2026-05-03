/**
 * Subdual — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support mental_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Subdual as base } from '@/data/generated/powersets/blaster/secondary/mental-manipulation/subdual';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/mental-manipulation/subdual';

export const Subdual: Power = withOverrides(base, overrides);
