/**
 * Insulating Circuit — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff shock_therapy
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { InsulatingCircuit as base } from '@/data/generated/powersets/corruptor/secondary/electrical-affinity/insulating-circuit';
import { overrides } from '@/data/overrides/powersets/corruptor/secondary/electrical-affinity/insulating-circuit';

export const InsulatingCircuit: Power = withOverrides(base, overrides);
