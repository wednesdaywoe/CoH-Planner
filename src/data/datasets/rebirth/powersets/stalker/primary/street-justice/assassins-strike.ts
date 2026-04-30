/**
 * Assassin's Strike — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee brawling
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AssassinsStrike as base } from '@/data/generated/powersets/stalker/primary/street-justice/assassins-strike';
import { overrides } from '@/data/overrides/powersets/stalker/primary/street-justice/assassins-strike';

export const AssassinsStrike: Power = withOverrides(base, overrides);
