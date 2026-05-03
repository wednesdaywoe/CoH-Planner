/**
 * Kuji-In Zen — COMPOSED EXPORT
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
import { KujiInZen as base } from '@/data/generated/powersets/mastermind/primary/ninjas/kuji-in-zen';
import { overrides } from '@/data/overrides/powersets/mastermind/primary/ninjas/kuji-in-zen';

export const KujiInZen: Power = withOverrides(base, overrides);
