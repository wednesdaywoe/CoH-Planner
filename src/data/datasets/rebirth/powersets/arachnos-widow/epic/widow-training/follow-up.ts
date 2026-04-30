/**
 * Follow Up — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs widow_training widow_training
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FollowUp as base } from '@/data/generated/powersets/arachnos-widow/epic/widow-training/follow-up';
import { overrides } from '@/data/overrides/powersets/arachnos-widow/epic/widow-training/follow-up';

export const FollowUp: Power = withOverrides(base, overrides);
