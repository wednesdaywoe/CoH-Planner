/**
 * Sucker Punch — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee hobo_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SuckerPunch as base } from '@/data/datasets/thunderspy/generated/powersets/tanker/secondary/hard-life/sucker-punch';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/tanker/secondary/hard-life/sucker-punch';

export const SuckerPunch: Power = withOverrides(base, overrides);
