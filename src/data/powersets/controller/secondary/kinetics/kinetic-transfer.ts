/**
 * Fulcrum Shift — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff kinetics
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FulcrumShift as base } from '@/data/generated/powersets/controller/secondary/kinetics/kinetic-transfer';
import { overrides } from '@/data/overrides/powersets/controller/secondary/kinetics/kinetic-transfer';

export const FulcrumShift: Power = withOverrides(base, overrides);
