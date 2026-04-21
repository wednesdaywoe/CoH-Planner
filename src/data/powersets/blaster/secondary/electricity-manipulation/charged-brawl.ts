/**
 * Charged Brawl — COMPOSED EXPORT
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
import { ChargedBrawl as base } from '@/data/generated/powersets/blaster/secondary/electricity-manipulation/charged-brawl';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/electricity-manipulation/charged-brawl';

export const ChargedBrawl: Power = withOverrides(base, overrides);
