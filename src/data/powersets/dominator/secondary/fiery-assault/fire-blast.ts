/**
 * Fire Blast — COMPOSED EXPORT
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
import { FireBlast as base } from '@/data/generated/powersets/dominator/secondary/fiery-assault/fire-blast';
import { overrides } from '@/data/overrides/powersets/dominator/secondary/fiery-assault/fire-blast';

export const FireBlast: Power = withOverrides(base, overrides);
