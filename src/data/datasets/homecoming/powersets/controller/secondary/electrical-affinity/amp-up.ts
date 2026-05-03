/**
 * Amp Up — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff shock_therapy
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AmpUp as base } from '@/data/generated/powersets/controller/secondary/electrical-affinity/amp-up';
import { overrides } from '@/data/overrides/powersets/controller/secondary/electrical-affinity/amp-up';

export const AmpUp: Power = withOverrides(base, overrides);
