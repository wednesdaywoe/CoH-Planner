/**
 * Tactical Upgrade — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon mercenaries
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TacticalUpgrade as base } from '@/data/generated/powersets/mastermind/primary/mercenaries/tactical-upgrade';
import { overrides } from '@/data/overrides/powersets/mastermind/primary/mercenaries/tactical-upgrade';

export const TacticalUpgrade: Power = withOverrides(base, overrides);
