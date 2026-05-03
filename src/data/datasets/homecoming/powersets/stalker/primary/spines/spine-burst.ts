/**
 * Spine Burst — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee spines
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SpineBurst as base } from '@/data/datasets/homecoming/generated/powersets/stalker/primary/spines/spine-burst';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/stalker/primary/spines/spine-burst';

export const SpineBurst: Power = withOverrides(base, overrides);
