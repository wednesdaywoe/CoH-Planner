/**
 * Genomic Evolution — COMPOSED EXPORT
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
import { GenomicEvolution as base } from '@/data/datasets/homecoming/generated/powersets/sentinel/secondary/bio-armor/genomic-evolution';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/sentinel/secondary/bio-armor/genomic-evolution';

export const GenomicEvolution: Power = withOverrides(base, overrides);
