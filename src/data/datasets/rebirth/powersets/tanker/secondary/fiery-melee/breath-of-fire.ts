/**
 * Breath of Fire — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee fiery_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BreathofFire as base } from '@/data/datasets/rebirth/generated/powersets/tanker/secondary/fiery-melee/breath-of-fire';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/secondary/fiery-melee/breath-of-fire';

export const BreathofFire: Power = withOverrides(base, overrides);
