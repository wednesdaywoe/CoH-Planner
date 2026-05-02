/**
 * Charged Brawl — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee electrical_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ChargedBrawl as base } from '@/data/generated/powersets/brute/primary/electrical-melee/charged-brawl';
import { overrides } from '@/data/overrides/powersets/brute/primary/electrical-melee/charged-brawl';

export const ChargedBrawl: Power = withOverrides(base, overrides);
