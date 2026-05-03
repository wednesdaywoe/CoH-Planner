/**
 * Charged Bolts — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault electricity_manipulation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ChargedBolts as base } from '@/data/datasets/homecoming/generated/powersets/dominator/secondary/electricity-assault/electric-fence';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/dominator/secondary/electricity-assault/electric-fence';

export const ChargedBolts: Power = withOverrides(base, overrides);
