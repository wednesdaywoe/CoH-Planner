/**
 * Chain Fences — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control electric_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ChainFences as base } from '@/data/generated/powersets/controller/primary/electric-control/chain-fences';
import { overrides } from '@/data/overrides/powersets/controller/primary/electric-control/chain-fences';

export const ChainFences: Power = withOverrides(base, overrides);
