/**
 * Dull Pain — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense regeneration
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DullPain as base } from '@/data/generated/powersets/brute/secondary/regeneration/dull-pain';
import { overrides } from '@/data/overrides/powersets/brute/secondary/regeneration/dull-pain';

export const DullPain: Power = withOverrides(base, overrides);
