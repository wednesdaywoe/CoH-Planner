/**
 * Evolving Armor — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense organic_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Adaptation as base } from '@/data/datasets/thunderspy/generated/powersets/tanker/primary/organic-armor/adaptation';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/tanker/primary/organic-armor/adaptation';

export const Adaptation: Power = withOverrides(base, overrides);
