/**
 * DNA Siphon — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense bio_organic_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DNASiphon as base } from '@/data/datasets/homecoming/generated/powersets/stalker/secondary/bio-armor/dna-siphon';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/stalker/secondary/bio-armor/dna-siphon';

export const DNASiphon: Power = withOverrides(base, overrides);
