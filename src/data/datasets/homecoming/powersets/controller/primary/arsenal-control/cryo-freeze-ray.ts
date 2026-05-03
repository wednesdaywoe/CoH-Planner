/**
 * Cryo Freeze Ray — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_control arsenal_control
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { CryoFreezeRay as base } from '@/data/datasets/homecoming/generated/powersets/controller/primary/arsenal-control/cryo-freeze-ray';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/controller/primary/arsenal-control/cryo-freeze-ray';

export const CryoFreezeRay: Power = withOverrides(base, overrides);
