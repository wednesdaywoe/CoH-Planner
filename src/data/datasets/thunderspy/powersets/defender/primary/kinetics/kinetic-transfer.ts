/**
 * Fulcrum Shift — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff kinetics
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { KineticTransfer as base } from '@/data/datasets/thunderspy/generated/powersets/defender/primary/kinetics/kinetic-transfer';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/primary/kinetics/kinetic-transfer';

export const KineticTransfer: Power = withOverrides(base, overrides);
