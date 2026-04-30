/**
 * Mental Training — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs teamwork widow_teamwork
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { MentalTraining as base } from '@/data/datasets/rebirth/generated/powersets/arachnos-widow/epic/widow-teamwork/mental-training';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/arachnos-widow/epic/widow-teamwork/mental-training';

export const MentalTraining: Power = withOverrides(base, overrides);
