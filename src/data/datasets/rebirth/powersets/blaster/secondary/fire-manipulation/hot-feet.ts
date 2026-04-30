/**
 * Hot Feet — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support fire_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HotFeet as base } from '@/data/generated/powersets/blaster/secondary/fire-manipulation/hot-feet';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/fire-manipulation/hot-feet';

export const HotFeet: Power = withOverrides(base, overrides);
