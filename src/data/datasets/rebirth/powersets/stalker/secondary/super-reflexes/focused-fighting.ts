/**
 * Focused Fighting — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense super_reflexes
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FocusedFighting as base } from '@/data/datasets/rebirth/generated/powersets/stalker/secondary/super-reflexes/focused-fighting';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/secondary/super-reflexes/focused-fighting';

export const FocusedFighting: Power = withOverrides(base, overrides);
