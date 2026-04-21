/**
 * Hardened Carapace — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense bio_organic_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HardenedCarapace as base } from '@/data/generated/powersets/stalker/secondary/bio-armor/hardened-carapace';
import { overrides } from '@/data/overrides/powersets/stalker/secondary/bio-armor/hardened-carapace';

export const HardenedCarapace: Power = withOverrides(base, overrides);
