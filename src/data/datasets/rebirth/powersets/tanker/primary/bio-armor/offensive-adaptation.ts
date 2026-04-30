/**
 * Offensive Adaptation — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense bio_organic_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { OffensiveAdaptation as base } from '@/data/datasets/rebirth/generated/powersets/tanker/primary/bio-armor/offensive-adaptation';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/primary/bio-armor/offensive-adaptation';

export const OffensiveAdaptation: Power = withOverrides(base, overrides);
