/**
 * Warriors Challenge — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee martial_arts
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { WarriorsChallenge as base } from '@/data/generated/powersets/scrapper/primary/martial-arts/warriors-challenge';
import { overrides } from '@/data/overrides/powersets/scrapper/primary/martial-arts/warriors-challenge';

export const WarriorsChallenge: Power = withOverrides(base, overrides);
