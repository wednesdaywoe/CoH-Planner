/**
 * Shout — COMPOSED EXPORT
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
import { Shout as base } from '@/data/datasets/thunderspy/generated/powersets/blaster/primary/sonic-attack/shout';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/blaster/primary/sonic-attack/shout';

export const Shout: Power = withOverrides(base, overrides);
