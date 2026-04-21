/**
 * Shriek — COMPOSED EXPORT
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
import { Shriek as base } from '@/data/generated/powersets/corruptor/primary/sonic-attack/shriek';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/sonic-attack/shriek';

export const Shriek: Power = withOverrides(base, overrides);
