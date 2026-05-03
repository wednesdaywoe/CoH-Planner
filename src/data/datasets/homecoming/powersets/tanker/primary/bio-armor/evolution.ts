/**
 * Adaptation — COMPOSED EXPORT
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
import { EvolvingArmor as base } from '@/data/datasets/homecoming/generated/powersets/tanker/primary/bio-armor/evolution';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/primary/bio-armor/evolution';

export const EvolvingArmor: Power = withOverrides(base, overrides);
