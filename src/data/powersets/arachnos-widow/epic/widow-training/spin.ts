/**
 * Spin — COMPOSED EXPORT
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
import { Spin as base } from '@/data/generated/powersets/arachnos-widow/epic/widow-training/spin';
import { overrides } from '@/data/overrides/powersets/arachnos-widow/epic/widow-training/spin';

export const Spin: Power = withOverrides(base, overrides);
