/**
 * Seishinteki Kyoyo — COMPOSED EXPORT
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
import { SeishintekiKyoyo as base } from '@/data/generated/powersets/scrapper/secondary/ninjitsu/seishinteki-kyoyo';
import { overrides } from '@/data/overrides/powersets/scrapper/secondary/ninjitsu/seishinteki-kyoyo';

export const SeishintekiKyoyo: Power = withOverrides(base, overrides);
