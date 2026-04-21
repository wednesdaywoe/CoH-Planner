/**
 * Empowering Circuit — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff shock_therapy
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EmpoweringCircuit as base } from '@/data/generated/powersets/controller/secondary/electrical-affinity/empowering-circuit';
import { overrides } from '@/data/overrides/powersets/controller/secondary/electrical-affinity/empowering-circuit';

export const EmpoweringCircuit: Power = withOverrides(base, overrides);
