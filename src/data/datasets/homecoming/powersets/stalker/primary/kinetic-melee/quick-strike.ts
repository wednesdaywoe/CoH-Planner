/**
 * Quick Strike — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee kinetic_attack
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { QuickStrike as base } from '@/data/datasets/homecoming/generated/powersets/stalker/primary/kinetic-melee/quick-strike';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/stalker/primary/kinetic-melee/quick-strike';

export const QuickStrike: Power = withOverrides(base, overrides);
