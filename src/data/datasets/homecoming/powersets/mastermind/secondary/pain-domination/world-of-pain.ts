/**
 * World of Pain — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff pain_domination
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { WorldofPain as base } from '@/data/generated/powersets/mastermind/secondary/pain-domination/world-of-pain';
import { overrides } from '@/data/overrides/powersets/mastermind/secondary/pain-domination/world-of-pain';

export const WorldofPain: Power = withOverrides(base, overrides);
