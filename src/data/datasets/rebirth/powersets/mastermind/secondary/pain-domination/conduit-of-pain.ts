/**
 * Conduit of Pain — COMPOSED EXPORT
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
import { ConduitofPain as base } from '@/data/datasets/rebirth/generated/powersets/mastermind/secondary/pain-domination/conduit-of-pain';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/mastermind/secondary/pain-domination/conduit-of-pain';

export const ConduitofPain: Power = withOverrides(base, overrides);
