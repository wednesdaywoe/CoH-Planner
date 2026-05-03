/**
 * Fire Breath — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged fire_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FireBreath as base } from '@/data/datasets/homecoming/generated/powersets/defender/secondary/fire-blast/fire-breath';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/defender/secondary/fire-blast/fire-breath';

export const FireBreath: Power = withOverrides(base, overrides);
