/**
 * Build Up — COMPOSED EXPORT
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
import { BuildUp as base } from '@/data/datasets/homecoming/generated/powersets/brute/primary/spines/build-up';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/brute/primary/spines/build-up';

export const BuildUp: Power = withOverrides(base, overrides);
