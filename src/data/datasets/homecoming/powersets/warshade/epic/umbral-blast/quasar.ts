/**
 * Quasar — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs warshade_offensive umbral_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Quasar as base } from '@/data/generated/powersets/warshade/epic/umbral-blast/quasar';
import { overrides } from '@/data/overrides/powersets/warshade/epic/umbral-blast/quasar';

export const Quasar: Power = withOverrides(base, overrides);
