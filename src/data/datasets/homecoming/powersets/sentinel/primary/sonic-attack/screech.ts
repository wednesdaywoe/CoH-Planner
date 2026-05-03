/**
 * Screech — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_ranged sonic_attack
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Screech as base } from '@/data/datasets/homecoming/generated/powersets/sentinel/primary/sonic-attack/screech';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/sentinel/primary/sonic-attack/screech';

export const Screech: Power = withOverrides(base, overrides);
