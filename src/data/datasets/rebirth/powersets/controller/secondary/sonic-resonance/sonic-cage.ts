/**
 * Sonic Cage — COMPOSED EXPORT
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
import { SonicCage as base } from '@/data/datasets/rebirth/generated/powersets/controller/secondary/sonic-resonance/sonic-cage';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/controller/secondary/sonic-resonance/sonic-cage';

export const SonicCage: Power = withOverrides(base, overrides);
