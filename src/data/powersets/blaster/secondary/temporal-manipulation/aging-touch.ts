/**
 * Aging Touch — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support time_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AgingTouch as base } from '@/data/generated/powersets/blaster/secondary/temporal-manipulation/aging-touch';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/temporal-manipulation/aging-touch';

export const AgingTouch: Power = withOverrides(base, overrides);
