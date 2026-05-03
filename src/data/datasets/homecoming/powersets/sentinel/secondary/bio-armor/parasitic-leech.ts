/**
 * Parasitic Leech — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_defense bio_organic_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ParasiticLeech as base } from '@/data/datasets/homecoming/generated/powersets/sentinel/secondary/bio-armor/parasitic-leech';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/sentinel/secondary/bio-armor/parasitic-leech';

export const ParasiticLeech: Power = withOverrides(base, overrides);
