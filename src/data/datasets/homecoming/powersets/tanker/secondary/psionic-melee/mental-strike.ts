/**
 * Mental Strike — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee psionic_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { MentalStrike as base } from '@/data/datasets/homecoming/generated/powersets/tanker/secondary/psionic-melee/mental-strike';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/secondary/psionic-melee/mental-strike';

export const MentalStrike: Power = withOverrides(base, overrides);
