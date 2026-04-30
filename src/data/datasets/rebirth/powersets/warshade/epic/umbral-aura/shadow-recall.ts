/**
 * Starless Recall — COMPOSED EXPORT
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
import { StarlessRecall as base } from '@/data/datasets/rebirth/generated/powersets/warshade/epic/umbral-aura/shadow-recall';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/warshade/epic/umbral-aura/shadow-recall';

export const StarlessRecall: Power = withOverrides(base, overrides);
