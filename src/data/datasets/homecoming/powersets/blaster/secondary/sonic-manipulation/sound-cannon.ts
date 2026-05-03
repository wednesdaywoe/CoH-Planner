/**
 * Sound Cannon — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support sonic_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SoundCannon as base } from '@/data/generated/powersets/blaster/secondary/sonic-manipulation/sound-cannon';
import { overrides } from '@/data/overrides/powersets/blaster/secondary/sonic-manipulation/sound-cannon';

export const SoundCannon: Power = withOverrides(base, overrides);
