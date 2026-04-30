/**
 * Shriek — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged sonic_attack
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Shriek as base } from '@/data/datasets/rebirth/generated/powersets/defender/secondary/sonic-attack/shriek';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/defender/secondary/sonic-attack/shriek';

export const Shriek: Power = withOverrides(base, overrides);
