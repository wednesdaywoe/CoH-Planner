/**
 * Scream — COMPOSED EXPORT
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
import { Scream as base } from '@/data/generated/powersets/blaster/primary/sonic-attack/scream';
import { overrides } from '@/data/overrides/powersets/blaster/primary/sonic-attack/scream';

export const Scream: Power = withOverrides(base, overrides);
