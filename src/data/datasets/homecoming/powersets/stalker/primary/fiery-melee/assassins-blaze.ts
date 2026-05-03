/**
 * Assassin's Blaze — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee fiery_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AssassinsBlaze as base } from '@/data/generated/powersets/stalker/primary/fiery-melee/assassins-blaze';
import { overrides } from '@/data/overrides/powersets/stalker/primary/fiery-melee/assassins-blaze';

export const AssassinsBlaze: Power = withOverrides(base, overrides);
