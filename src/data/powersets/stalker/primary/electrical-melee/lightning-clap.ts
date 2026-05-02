/**
 * Thunder Strike — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee electrical_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ThunderStrike as base } from '@/data/generated/powersets/stalker/primary/electrical-melee/lightning-clap';
import { overrides } from '@/data/overrides/powersets/stalker/primary/electrical-melee/lightning-clap';

export const ThunderStrike: Power = withOverrides(base, overrides);
