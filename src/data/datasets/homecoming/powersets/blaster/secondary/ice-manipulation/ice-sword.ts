/**
 * Ice Sword — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support ice_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { IceSword as base } from '@/data/generated/powersets/blaster/secondary/ice-manipulation/ice-sword';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/ice-manipulation/ice-sword';

export const IceSword: Power = withOverrides(base, overrides);
