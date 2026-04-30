/**
 * Nebulous Form — COMPOSED EXPORT
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
import { NebulousForm as base } from '@/data/generated/powersets/warshade/epic/umbral-aura/nebulous-form';
import { overrides } from '@/data/overrides/powersets/warshade/epic/umbral-aura/nebulous-form';

export const NebulousForm: Power = withOverrides(base, overrides);
