/**
 * Lucky — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense super_reflexes
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Lucky as base } from '@/data/datasets/homecoming/generated/powersets/tanker/primary/super-reflexes/lucky';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/primary/super-reflexes/lucky';

export const Lucky: Power = withOverrides(base, overrides);
