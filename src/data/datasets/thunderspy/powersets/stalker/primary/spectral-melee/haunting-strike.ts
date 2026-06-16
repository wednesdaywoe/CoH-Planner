/**
 * Haunting Strike — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee spectral_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HauntingStrike as base } from '@/data/datasets/thunderspy/generated/powersets/stalker/primary/spectral-melee/haunting-strike';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/stalker/primary/spectral-melee/haunting-strike';

export const HauntingStrike: Power = withOverrides(base, overrides);
