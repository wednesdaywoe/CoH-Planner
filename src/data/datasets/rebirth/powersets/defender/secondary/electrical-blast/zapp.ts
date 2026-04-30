/**
 * Zapp — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged electrical_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Zapp as base } from '@/data/generated/powersets/defender/secondary/electrical-blast/zapp';
import { overrides } from '@/data/overrides/powersets/defender/secondary/electrical-blast/zapp';

export const Zapp: Power = withOverrides(base, overrides);
