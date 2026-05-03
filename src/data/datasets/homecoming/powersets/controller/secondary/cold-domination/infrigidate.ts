/**
 * Infrigidate — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff cold_domination
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Infrigidate as base } from '@/data/datasets/homecoming/generated/powersets/controller/secondary/cold-domination/infrigidate';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/controller/secondary/cold-domination/infrigidate';

export const Infrigidate: Power = withOverrides(base, overrides);
