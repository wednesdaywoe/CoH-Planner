/**
 * Wet Ice — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_defense ice_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { WetIce as base } from '@/data/generated/powersets/sentinel/secondary/ice-armor/wet-ice';
import { overrides } from '@/data/overrides/powersets/sentinel/secondary/ice-armor/wet-ice';

export const WetIce: Power = withOverrides(base, overrides);
