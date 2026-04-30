/**
 * Sonic Repulsion — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff sonic_debuff
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SonicRepulsion as base } from '@/data/datasets/rebirth/generated/powersets/defender/primary/sonic-resonance/sonic-repulsion';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/defender/primary/sonic-resonance/sonic-repulsion';

export const SonicRepulsion: Power = withOverrides(base, overrides);
