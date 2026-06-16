/**
 * Rally The Militia — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon knights
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RallyTheMilitia as base } from '@/data/datasets/thunderspy/generated/powersets/mastermind/primary/knights/rally-the-militia';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/mastermind/primary/knights/rally-the-militia';

export const RallyTheMilitia: Power = withOverrides(base, overrides);
