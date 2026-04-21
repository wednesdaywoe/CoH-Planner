/**
 * High Pain Tolerance — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense willpower
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HighPainTolerance as base } from '@/data/generated/powersets/stalker/secondary/willpower/high-pain-tolerance';
import { overrides } from '@/data/overrides/powersets/stalker/secondary/willpower/high-pain-tolerance';

export const HighPainTolerance: Power = withOverrides(base, overrides);
