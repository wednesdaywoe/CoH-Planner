/**
 * Sky Splitter — COMPOSED EXPORT
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
import { SkySplitter as base } from '@/data/generated/powersets/brute/primary/staff-fighting/sky-splitter';
import { overrides } from '@/data/overrides/powersets/brute/primary/staff-fighting/sky-splitter';

export const SkySplitter: Power = withOverrides(base, overrides);
