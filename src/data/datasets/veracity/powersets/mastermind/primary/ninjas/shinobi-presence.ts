/**
 * Shinobi Presence — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs mastermind_summon ninjas
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ShinobiPresence as base } from '@/data/datasets/veracity/generated/powersets/mastermind/primary/ninjas/shinobi-presence';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/mastermind/primary/ninjas/shinobi-presence';

export const ShinobiPresence: Power = withOverrides(base, overrides);
