/**
 * Liquefy — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff sonic_resonance
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Liquefy as base } from '@/data/datasets/rebirth/generated/powersets/corruptor/secondary/sonic-resonance/liquefy';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/corruptor/secondary/sonic-resonance/liquefy';

export const Liquefy: Power = withOverrides(base, overrides);
