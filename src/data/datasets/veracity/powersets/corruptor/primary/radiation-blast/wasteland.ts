/**
 * Wasteland — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged radiation_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Wasteland as base } from '@/data/datasets/veracity/generated/powersets/corruptor/primary/radiation-blast/wasteland';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/corruptor/primary/radiation-blast/wasteland';

export const Wasteland: Power = withOverrides(base, overrides);
