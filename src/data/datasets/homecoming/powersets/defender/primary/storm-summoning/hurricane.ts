/**
 * Hurricane — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff storm_summoning
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Hurricane as base } from '@/data/datasets/homecoming/generated/powersets/defender/primary/storm-summoning/hurricane';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/defender/primary/storm-summoning/hurricane';

export const Hurricane: Power = withOverrides(base, overrides);
