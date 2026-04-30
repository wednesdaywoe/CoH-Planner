/**
 * Pistols — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon thugs
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Pistols as base } from '@/data/datasets/rebirth/generated/powersets/mastermind/primary/thugs/pistols';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/mastermind/primary/thugs/pistols';

export const Pistols: Power = withOverrides(base, overrides);
