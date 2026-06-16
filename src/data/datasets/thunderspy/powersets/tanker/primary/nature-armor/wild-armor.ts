/**
 * Wild Armor — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense sacred_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { WildArmor as base } from '@/data/datasets/thunderspy/generated/powersets/tanker/primary/nature-armor/wild-armor';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/tanker/primary/nature-armor/wild-armor';

export const WildArmor: Power = withOverrides(base, overrides);
