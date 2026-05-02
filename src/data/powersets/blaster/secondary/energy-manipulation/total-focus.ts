/**
 * Total Focus — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support energy_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TotalFocus as base } from '@/data/generated/powersets/blaster/secondary/energy-manipulation/total-focus';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/energy-manipulation/total-focus';

export const TotalFocus: Power = withOverrides(base, overrides);
