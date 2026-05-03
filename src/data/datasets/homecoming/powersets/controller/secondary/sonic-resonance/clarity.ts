/**
 * Clarity — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff sonic_debuff
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Clarity as base } from '@/data/datasets/homecoming/generated/powersets/controller/secondary/sonic-resonance/clarity';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/controller/secondary/sonic-resonance/clarity';

export const Clarity: Power = withOverrides(base, overrides);
