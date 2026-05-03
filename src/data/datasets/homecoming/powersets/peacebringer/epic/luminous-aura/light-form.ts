/**
 * Light Form — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs peacebringer_defensive luminous_aura
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { LightForm as base } from '@/data/datasets/homecoming/generated/powersets/peacebringer/epic/luminous-aura/light-form';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/peacebringer/epic/luminous-aura/light-form';

export const LightForm: Power = withOverrides(base, overrides);
