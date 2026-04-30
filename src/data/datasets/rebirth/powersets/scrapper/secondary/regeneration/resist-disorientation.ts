/**
 * Resilience — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense regeneration
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Resilience as base } from '@/data/generated/powersets/scrapper/secondary/regeneration/resist-disorientation';
import { overrides } from '@/data/overrides/powersets/scrapper/secondary/regeneration/resist-disorientation';

export const Resilience: Power = withOverrides(base, overrides);
