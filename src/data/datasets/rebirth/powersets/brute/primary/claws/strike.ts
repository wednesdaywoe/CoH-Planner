/**
 * Strike — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee claws
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Strike as base } from '@/data/datasets/rebirth/generated/powersets/brute/primary/claws/strike';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/brute/primary/claws/strike';

export const Strike: Power = withOverrides(base, overrides);
