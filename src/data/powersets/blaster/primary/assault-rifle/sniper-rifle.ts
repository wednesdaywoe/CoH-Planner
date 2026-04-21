/**
 * Sniper Rifle — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged assault_rifle
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SniperRifle as base } from '@/data/generated/powersets/blaster/primary/assault-rifle/sniper-rifle';
import { overrides } from '@/data/overrides/powersets/blaster/primary/assault-rifle/sniper-rifle';

export const SniperRifle: Power = withOverrides(base, overrides);
