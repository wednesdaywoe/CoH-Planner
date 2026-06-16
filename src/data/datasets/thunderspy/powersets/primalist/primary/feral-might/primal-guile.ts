/**
 * Primal Guile — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs feral_might feral_might
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { PrimalGuile as base } from '@/data/datasets/thunderspy/generated/powersets/primalist/primary/feral-might/primal-guile';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/primalist/primary/feral-might/primal-guile';

export const PrimalGuile: Power = withOverrides(base, overrides);
