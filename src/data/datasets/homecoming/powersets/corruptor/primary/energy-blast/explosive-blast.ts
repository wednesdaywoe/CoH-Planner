/**
 * Explosive Blast — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged energy_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ExplosiveBlast as base } from '@/data/datasets/homecoming/generated/powersets/corruptor/primary/energy-blast/explosive-blast';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/corruptor/primary/energy-blast/explosive-blast';

export const ExplosiveBlast: Power = withOverrides(base, overrides);
