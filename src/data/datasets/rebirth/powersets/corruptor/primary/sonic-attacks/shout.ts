/**
 * Shout — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged sonic_attack
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Shout as base } from '@/data/generated/powersets/corruptor/primary/sonic-attacks/shout';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/sonic-attacks/shout';

export const Shout: Power = withOverrides(base, overrides);
