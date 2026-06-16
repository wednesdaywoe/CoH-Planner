/**
 * Rain of Fire — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged fire_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RainofFire as base } from '@/data/datasets/thunderspy/generated/powersets/defender/secondary/fiery-combat/rain-of-fire';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/secondary/fiery-combat/rain-of-fire';

export const RainofFire: Power = withOverrides(base, overrides);
