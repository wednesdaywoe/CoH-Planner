/**
 * Reinforced Exoskeleton — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs teamwork tarantula_teamwork
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ReinforcedExoskeleton as base } from '@/data/datasets/thunderspy/generated/powersets/arachnos-widow/epic/tarantula-teamwork/reinforced-exoskeleton';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/arachnos-widow/epic/tarantula-teamwork/reinforced-exoskeleton';

export const ReinforcedExoskeleton: Power = withOverrides(base, overrides);
