/**
 * One with the Shield — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense shield_defense
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { OnewiththeShield as base } from '@/data/datasets/rebirth/generated/powersets/scrapper/secondary/shield-defense/one-with-the-shield';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/scrapper/secondary/shield-defense/one-with-the-shield';

export const OnewiththeShield: Power = withOverrides(base, overrides);
