/**
 * Sirens Song — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged sonic_attack
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SirensSong as base } from '@/data/generated/powersets/blaster/primary/sonic-attack/sirens-song';
import { overrides } from '@/data/overrides/powersets/blaster/primary/sonic-attack/sirens-song';

export const SirensSong: Power = withOverrides(base, overrides);
