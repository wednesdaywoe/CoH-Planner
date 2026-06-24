/**
 * Tenebrous Regeneration — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_defense dark_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TenebrousRegeneration as base } from '@/data/datasets/veracity/generated/powersets/sentinel/secondary/dark-armor/tenebrous-regeneration';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/sentinel/secondary/dark-armor/tenebrous-regeneration';

export const TenebrousRegeneration: Power = withOverrides(base, overrides);
