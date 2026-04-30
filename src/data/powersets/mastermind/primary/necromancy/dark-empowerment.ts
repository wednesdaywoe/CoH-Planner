/**
 * Dark Empowerment — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon necromancy
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DarkEmpowerment as base } from '@/data/generated/powersets/mastermind/primary/necromancy/dark-empowerment';
import { overrides } from '@/data/overrides/powersets/mastermind/primary/necromancy/dark-empowerment';

export const DarkEmpowerment: Power = withOverrides(base, overrides);
