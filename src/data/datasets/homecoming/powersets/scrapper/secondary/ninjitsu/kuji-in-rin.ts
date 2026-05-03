/**
 * Kuji-In Rin — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense ninjitsu
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { KujiInRin as base } from '@/data/datasets/homecoming/generated/powersets/scrapper/secondary/ninjitsu/kuji-in-rin';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/scrapper/secondary/ninjitsu/kuji-in-rin';

export const KujiInRin: Power = withOverrides(base, overrides);
