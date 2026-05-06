/**
 * Tactical Training: Assault — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs teamwork teamwork
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TacticalTrainingAssault as base } from '@/data/datasets/homecoming/generated/powersets/arachnos-widow/epic/teamwork/tactical-training-assault';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/arachnos-widow/epic/teamwork/tactical-training-assault';

export const TacticalTrainingAssault: Power = withOverrides(base, overrides);
