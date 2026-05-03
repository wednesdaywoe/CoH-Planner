/**
 * Siphon Life — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee dark_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SiphonLife as base } from '@/data/datasets/homecoming/generated/powersets/tanker/secondary/dark-melee/siphon-life';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/secondary/dark-melee/siphon-life';

export const SiphonLife: Power = withOverrides(base, overrides);
