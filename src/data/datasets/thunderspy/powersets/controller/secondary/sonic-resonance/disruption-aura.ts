/**
 * Disruption Aura — COMPOSED EXPORT
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
import { DisruptionAura as base } from '@/data/datasets/thunderspy/generated/powersets/controller/secondary/sonic-resonance/disruption-aura';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/controller/secondary/sonic-resonance/disruption-aura';

export const DisruptionAura: Power = withOverrides(base, overrides);
