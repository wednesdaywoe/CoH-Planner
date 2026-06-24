/**
 * Instant Regeneration — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_defense regeneration
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { InstantRegeneration as base } from '@/data/datasets/veracity/generated/powersets/sentinel/secondary/regeneration/instant-regeneration';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/sentinel/secondary/regeneration/instant-regeneration';

export const InstantRegeneration: Power = withOverrides(base, overrides);
