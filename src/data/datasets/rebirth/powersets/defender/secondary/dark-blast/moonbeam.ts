/**
 * Moonbeam — COMPOSED EXPORT
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
import { Moonbeam as base } from '@/data/datasets/rebirth/generated/powersets/defender/secondary/dark-blast/moonbeam';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/defender/secondary/dark-blast/moonbeam';

export const Moonbeam: Power = withOverrides(base, overrides);
