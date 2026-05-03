/**
 * Eclipse — COMPOSED EXPORT
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
import { Eclipse as base } from '@/data/datasets/homecoming/generated/powersets/warshade/epic/umbral-aura/eclipse';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/warshade/epic/umbral-aura/eclipse';

export const Eclipse: Power = withOverrides(base, overrides);
