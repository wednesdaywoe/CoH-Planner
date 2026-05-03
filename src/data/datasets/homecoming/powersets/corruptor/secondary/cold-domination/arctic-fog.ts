/**
 * Arctic Fog — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff cold_domination
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ArcticFog as base } from '@/data/datasets/homecoming/generated/powersets/corruptor/secondary/cold-domination/arctic-fog';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/corruptor/secondary/cold-domination/arctic-fog';

export const ArcticFog: Power = withOverrides(base, overrides);
