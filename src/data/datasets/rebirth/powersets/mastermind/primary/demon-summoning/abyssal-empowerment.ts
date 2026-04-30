/**
 * Abyssal Empowerment — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon demon_summoning
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AbyssalEmpowerment as base } from '@/data/generated/powersets/mastermind/primary/demon-summoning/abyssal-empowerment';
import { overrides } from '@/data/overrides/powersets/mastermind/primary/demon-summoning/abyssal-empowerment';

export const AbyssalEmpowerment: Power = withOverrides(base, overrides);
