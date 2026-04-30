/**
 * Ring of Fire — COMPOSED EXPORT
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
import { RingofFire as base } from '@/data/datasets/rebirth/generated/powersets/blaster/secondary/fire-manipulation/ring-of-fire';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/blaster/secondary/fire-manipulation/ring-of-fire';

export const RingofFire: Power = withOverrides(base, overrides);
