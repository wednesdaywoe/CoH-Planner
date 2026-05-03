/**
 * Soul Transfer — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_defense dark_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SoulTransfer as base } from '@/data/datasets/homecoming/generated/powersets/sentinel/secondary/dark-armor/soul-transfer';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/sentinel/secondary/dark-armor/soul-transfer';

export const SoulTransfer: Power = withOverrides(base, overrides);
