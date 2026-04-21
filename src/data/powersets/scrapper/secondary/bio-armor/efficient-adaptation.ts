/**
 * Efficient Adaptation — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense bio_organic_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EfficientAdaptation as base } from '@/data/generated/powersets/scrapper/secondary/bio-armor/efficient-adaptation';
import { overrides } from '@/data/overrides/powersets/scrapper/secondary/bio-armor/efficient-adaptation';

export const EfficientAdaptation: Power = withOverrides(base, overrides);
