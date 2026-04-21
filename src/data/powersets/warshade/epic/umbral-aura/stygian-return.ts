/**
 * Stygian Return — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs warshade_defensive umbral_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { StygianReturn as base } from '@/data/generated/powersets/warshade/epic/umbral-aura/stygian-return';
import { overrides } from '@/data/overrides/powersets/warshade/epic/umbral-aura/stygian-return';

export const StygianReturn: Power = withOverrides(base, overrides);
