/**
 * Kinetic Rebound — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_melee claws
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { KineticRebound as base } from '@/data/datasets/veracity/generated/powersets/scrapper/primary/claws/kinetic-rebound';
import { overrides } from '@/data/datasets/veracity/overrides/powersets/scrapper/primary/claws/kinetic-rebound';

export const KineticRebound: Power = withOverrides(base, overrides);
