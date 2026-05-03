/**
 * Dragon's Tail — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_assault martial_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DragonsTail as base } from '@/data/datasets/rebirth/generated/powersets/guardian/primary/martial-assault/dragons-tail';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/primary/martial-assault/dragons-tail';

export const DragonsTail: Power = withOverrides(base, overrides);
