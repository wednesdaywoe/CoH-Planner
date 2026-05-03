/**
 * Fire Blast — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged fire_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FireBlast as base } from '@/data/datasets/homecoming/generated/powersets/corruptor/primary/fire-blast/fire-blast';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/corruptor/primary/fire-blast/fire-blast';

export const FireBlast: Power = withOverrides(base, overrides);
