/**
 * Share Pain — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff pain_domination
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SharePain as base } from '@/data/generated/powersets/controller/secondary/pain-domination/share-pain';
import { overrides } from '@/data/overrides/powersets/controller/secondary/pain-domination/share-pain';

export const SharePain: Power = withOverrides(base, overrides);
