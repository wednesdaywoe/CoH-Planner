/**
 * Repair — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon robotics
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Repair as base } from '@/data/generated/powersets/mastermind/primary/robotics/repair';
import { overrides } from '@/data/overrides/powersets/mastermind/primary/robotics/repair';

export const Repair: Power = withOverrides(base, overrides);
