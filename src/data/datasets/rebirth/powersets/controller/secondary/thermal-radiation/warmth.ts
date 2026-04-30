/**
 * Warmth — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff thermal_radiation
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Warmth as base } from '@/data/generated/powersets/controller/secondary/thermal-radiation/warmth';
import { overrides } from '@/data/overrides/powersets/controller/secondary/thermal-radiation/warmth';

export const Warmth: Power = withOverrides(base, overrides);
