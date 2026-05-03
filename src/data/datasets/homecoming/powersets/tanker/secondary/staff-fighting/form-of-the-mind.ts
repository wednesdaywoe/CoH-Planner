/**
 * Form of the Mind — COMPOSED EXPORT
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
import { FormoftheMind as base } from '@/data/datasets/homecoming/generated/powersets/tanker/secondary/staff-fighting/form-of-the-mind';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/secondary/staff-fighting/form-of-the-mind';

export const FormoftheMind: Power = withOverrides(base, overrides);
