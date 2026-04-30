/**
 * Adaptation — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_defense bio_organic_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Adaptation as base } from '@/data/datasets/rebirth/generated/powersets/brute/secondary/bio-armor/adaptation';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/brute/secondary/bio-armor/adaptation';

export const Adaptation: Power = withOverrides(base, overrides);
