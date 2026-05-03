/**
 * Quills — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee spines
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Quills as base } from '@/data/datasets/homecoming/generated/powersets/brute/primary/spines/quills';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/brute/primary/spines/quills';

export const Quills: Power = withOverrides(base, overrides);
