/**
 * Shin Breaker — COMPOSED EXPORT
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
import { ShinBreaker as base } from '@/data/generated/powersets/scrapper/primary/street-justice/low-kick';
import { overrides } from '@/data/overrides/powersets/scrapper/primary/street-justice/low-kick';

export const ShinBreaker: Power = withOverrides(base, overrides);
