/**
 * Initial Strike — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee brawling
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { InitialStrike as base } from '@/data/generated/powersets/scrapper/primary/street-justice/initial-strike';
import { overrides } from '@/data/overrides/powersets/scrapper/primary/street-justice/initial-strike';

export const InitialStrike: Power = withOverrides(base, overrides);
