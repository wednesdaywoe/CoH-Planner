/**
 * Kuji-In Retsu — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense ninjitsu
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { KujiInRetsu as base } from '@/data/generated/powersets/stalker/secondary/ninjitsu/kuji-in-retsu';
import { overrides } from '@/data/overrides/powersets/stalker/secondary/ninjitsu/kuji-in-retsu';

export const KujiInRetsu: Power = withOverrides(base, overrides);
