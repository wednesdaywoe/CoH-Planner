/**
 * Force of Thunder — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support electricity_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ForceofThunder as base } from '@/data/generated/powersets/blaster/secondary/electricity-manipulation/lightning-field';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/electricity-manipulation/lightning-field';

export const ForceofThunder: Power = withOverrides(base, overrides);
