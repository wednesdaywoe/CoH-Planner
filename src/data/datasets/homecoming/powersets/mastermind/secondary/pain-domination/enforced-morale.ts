/**
 * Enforced Morale — COMPOSED EXPORT
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
import { EnforcedMorale as base } from '@/data/generated/powersets/mastermind/secondary/pain-domination/enforced-morale';
import { overrides } from '@/data/overrides/powersets/mastermind/secondary/pain-domination/enforced-morale';

export const EnforcedMorale: Power = withOverrides(base, overrides);
