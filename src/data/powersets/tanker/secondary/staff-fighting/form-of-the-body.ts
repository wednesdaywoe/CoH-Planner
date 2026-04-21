/**
 * Form of the Body — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee staff_fighting
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FormoftheBody as base } from '@/data/generated/powersets/tanker/secondary/staff-fighting/form-of-the-body';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/staff-fighting/form-of-the-body';

export const FormoftheBody: Power = withOverrides(base, overrides);
