/**
 * Lingering Radiation — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_buff radiation_emission
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { LingeringRadiation as base } from '@/data/generated/powersets/mastermind/secondary/radiation-emission/lingering-radiation';
import { overrides } from '@/data/overrides/powersets/mastermind/secondary/radiation-emission/lingering-radiation';

export const LingeringRadiation: Power = withOverrides(base, overrides);
