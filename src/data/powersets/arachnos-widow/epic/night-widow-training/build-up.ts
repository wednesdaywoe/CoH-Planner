/**
 * Build Up — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs widow_training night_widow_training
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BuildUp as base } from '@/data/generated/powersets/arachnos-widow/epic/night-widow-training/build-up';
import { overrides } from '@/data/overrides/powersets/arachnos-widow/epic/night-widow-training/build-up';

export const BuildUp: Power = withOverrides(base, overrides);
