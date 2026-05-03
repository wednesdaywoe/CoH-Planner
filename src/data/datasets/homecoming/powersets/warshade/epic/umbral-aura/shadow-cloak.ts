/**
 * Shadow Cloak — COMPOSED EXPORT
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
import { ShadowCloak as base } from '@/data/datasets/homecoming/generated/powersets/warshade/epic/umbral-aura/shadow-cloak';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/warshade/epic/umbral-aura/shadow-cloak';

export const ShadowCloak: Power = withOverrides(base, overrides);
