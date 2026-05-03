/**
 * Reach for the Limit — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support martial_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ReachfortheLimit as base } from '@/data/datasets/homecoming/generated/powersets/blaster/secondary/martial-combat/reach-for-the-limit';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/secondary/martial-combat/reach-for-the-limit';

export const ReachfortheLimit: Power = withOverrides(base, overrides);
