/**
 * Suppressive Fire — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged dual_pistols
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SuppressiveFire as base } from '@/data/generated/powersets/corruptor/primary/dual-pistols/suppressive-fire';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/dual-pistols/suppressive-fire';

export const SuppressiveFire: Power = withOverrides(base, overrides);
