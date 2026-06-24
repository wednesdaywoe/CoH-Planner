/**
 * Cryonic Redoubt — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault icy_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { CryonicRedoubt as base } from '@/data/datasets/veracity/generated/powersets/dominator/secondary/icy-assault/cryonic-redoubt';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/dominator/secondary/icy-assault/cryonic-redoubt';

export const CryonicRedoubt: Power = withOverrides(base, overrides);
