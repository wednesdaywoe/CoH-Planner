/**
 * Breath of Fire — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee fiery_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BreathofFire as base } from '@/data/datasets/homecoming/generated/powersets/stalker/primary/fiery-melee/breath-of-fire';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/stalker/primary/fiery-melee/breath-of-fire';

export const BreathofFire: Power = withOverrides(base, overrides);
