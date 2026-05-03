/**
 * Gloom — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged dark_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Gloom as base } from '@/data/datasets/homecoming/generated/powersets/defender/secondary/dark-blast/gloom';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/defender/secondary/dark-blast/gloom';

export const Gloom: Power = withOverrides(base, overrides);
