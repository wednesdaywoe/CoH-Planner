/**
 * Atomic Blast — COMPOSED EXPORT
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
import { AtomicBlast as base } from '@/data/datasets/homecoming/generated/powersets/corruptor/primary/radiation-blast/atomic-blast';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/corruptor/primary/radiation-blast/atomic-blast';

export const AtomicBlast: Power = withOverrides(base, overrides);
