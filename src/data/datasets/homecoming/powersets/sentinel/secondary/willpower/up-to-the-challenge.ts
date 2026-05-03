/**
 * Up to the Challenge — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_defense willpower
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { UptotheChallenge as base } from '@/data/generated/powersets/sentinel/secondary/willpower/up-to-the-challenge';
import { overrides } from '@/data/overrides/powersets/sentinel/secondary/willpower/up-to-the-challenge';

export const UptotheChallenge: Power = withOverrides(base, overrides);
