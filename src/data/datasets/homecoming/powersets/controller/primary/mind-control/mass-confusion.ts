/**
 * Mass Confusion — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control mind_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { MassConfusion as base } from '@/data/datasets/homecoming/generated/powersets/controller/primary/mind-control/mass-confusion';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/controller/primary/mind-control/mass-confusion';

export const MassConfusion: Power = withOverrides(base, overrides);
