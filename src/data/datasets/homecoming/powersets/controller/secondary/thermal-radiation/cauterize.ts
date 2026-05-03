/**
 * Cauterize — COMPOSED EXPORT
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
import { Cauterize as base } from '@/data/datasets/homecoming/generated/powersets/controller/secondary/thermal-radiation/cauterize';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/controller/secondary/thermal-radiation/cauterize';

export const Cauterize: Power = withOverrides(base, overrides);
