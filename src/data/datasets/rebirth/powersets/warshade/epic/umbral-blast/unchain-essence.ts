/**
 * Unchain Essence — COMPOSED EXPORT
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
import { UnchainEssence as base } from '@/data/datasets/rebirth/generated/powersets/warshade/epic/umbral-blast/unchain-essence';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/warshade/epic/umbral-blast/unchain-essence';

export const UnchainEssence: Power = withOverrides(base, overrides);
