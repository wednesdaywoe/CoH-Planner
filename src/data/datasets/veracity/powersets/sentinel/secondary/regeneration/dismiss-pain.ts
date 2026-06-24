/**
 * Dismiss Pain — COMPOSED EXPORT
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
import { DismissPain as base } from '@/data/datasets/veracity/generated/powersets/sentinel/secondary/regeneration/dismiss-pain';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/sentinel/secondary/regeneration/dismiss-pain';

export const DismissPain: Power = withOverrides(base, overrides);
