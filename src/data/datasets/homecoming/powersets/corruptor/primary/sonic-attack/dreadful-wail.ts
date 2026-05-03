/**
 * Dreadful Wail — COMPOSED EXPORT
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
import { DreadfulWail as base } from '@/data/datasets/homecoming/generated/powersets/corruptor/primary/sonic-attack/dreadful-wail';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/corruptor/primary/sonic-attack/dreadful-wail';

export const DreadfulWail: Power = withOverrides(base, overrides);
