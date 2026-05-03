/**
 * Form of the Soul — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs brute_melee staff_fighting
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FormoftheSoul as base } from '@/data/datasets/homecoming/generated/powersets/brute/primary/staff-fighting/form-of-the-soul';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/brute/primary/staff-fighting/form-of-the-soul';

export const FormoftheSoul: Power = withOverrides(base, overrides);
