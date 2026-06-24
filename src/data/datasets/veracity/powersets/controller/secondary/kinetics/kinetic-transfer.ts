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
import { KineticTransfer as base } from '@/data/datasets/veracity/generated/powersets/controller/secondary/kinetics/kinetic-transfer';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/controller/secondary/kinetics/kinetic-transfer';

export const KineticTransfer: Power = withOverrides(base, overrides);
