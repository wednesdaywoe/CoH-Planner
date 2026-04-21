/**
 * Form of the Mind — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee staff_fighting
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FormoftheMind as base } from '@/data/generated/powersets/scrapper/primary/staff-fighting/form-of-the-mind';
import { overrides } from '@/data/overrides/powersets/scrapper/primary/staff-fighting/form-of-the-mind';

export const FormoftheMind: Power = withOverrides(base, overrides);
