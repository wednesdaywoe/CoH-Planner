/**
 * Pierce — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs widow_training tarantula_training
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TRClawPierce as base } from '@/data/datasets/thunderspy/generated/powersets/arachnos-widow/epic/tarantula-training/tr-claw-pierce';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/arachnos-widow/epic/tarantula-training/tr-claw-pierce';

export const TRClawPierce: Power = withOverrides(base, overrides);
