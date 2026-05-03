/**
 * Seeds of Confusion — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_control plant_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SeedsofConfusion as base } from '@/data/generated/powersets/dominator/primary/plant-control/seeds-of-confusion';
import { overrides } from '@/data/overrides/powersets/dominator/primary/plant-control/seeds-of-confusion';

export const SeedsofConfusion: Power = withOverrides(base, overrides);
