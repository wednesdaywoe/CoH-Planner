/**
 * Murky Cloud — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense dark_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { MurkyCloud as base } from '@/data/generated/powersets/tanker/primary/dark-armor/murky-cloud';
import { overrides } from '@/data/overrides/powersets/tanker/primary/dark-armor/murky-cloud';

export const MurkyCloud: Power = withOverrides(base, overrides);
