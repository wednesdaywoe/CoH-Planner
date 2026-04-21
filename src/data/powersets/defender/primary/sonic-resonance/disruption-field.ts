/**
 * Disruption Field — COMPOSED EXPORT
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
import { DisruptionField as base } from '@/data/generated/powersets/defender/primary/sonic-resonance/disruption-field';
import { overrides } from '@/data/overrides/powersets/defender/primary/sonic-resonance/disruption-field';

export const DisruptionField: Power = withOverrides(base, overrides);
