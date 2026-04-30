/**
 * Chain Induction — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee electrical_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ChainInduction as base } from '@/data/datasets/rebirth/generated/powersets/stalker/primary/electrical-melee/chain-induction';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/primary/electrical-melee/chain-induction';

export const ChainInduction: Power = withOverrides(base, overrides);
