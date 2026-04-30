/**
 * Extinguish Light — COMPOSED EXPORT
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
import { ExtinguishLight as base } from '@/data/generated/powersets/warshade/epic/umbral-blast/starless-step';
import { overrides } from '@/data/overrides/powersets/warshade/epic/umbral-blast/starless-step';

export const ExtinguishLight: Power = withOverrides(base, overrides);
