/**
 * Inferno — COMPOSED EXPORT
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
import { Inferno as base } from '@/data/generated/powersets/defender/secondary/fire-blast/inferno';
import { overrides } from '@/data/overrides/powersets/defender/secondary/fire-blast/inferno';

export const Inferno: Power = withOverrides(base, overrides);
