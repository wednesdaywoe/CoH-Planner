/**
 * Golden Dragonfly — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_assault ninja_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { GoldenDragonfly as base } from '@/data/datasets/rebirth/generated/powersets/guardian/primary/ninja-assault/golden-dragonfly';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/primary/ninja-assault/golden-dragonfly';

export const GoldenDragonfly: Power = withOverrides(base, overrides);
