/**
 * Choking Cloud — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff radiation_emission
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ChokingCloud as base } from '@/data/datasets/homecoming/generated/powersets/controller/secondary/radiation-emission/choking-cloud';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/controller/secondary/radiation-emission/choking-cloud';

export const ChokingCloud: Power = withOverrides(base, overrides);
