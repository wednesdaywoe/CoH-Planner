/**
 * Embrace of Fire — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs dominator_assault fiery_assault
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { EmbraceofFire as base } from '@/data/datasets/rebirth/generated/powersets/dominator/secondary/fiery-assault/fiery-embrace';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/dominator/secondary/fiery-assault/fiery-embrace';

export const EmbraceofFire: Power = withOverrides(base, overrides);
