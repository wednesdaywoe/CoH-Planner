/**
 * Ranged Shot — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged archery
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { RangedShot as base } from '@/data/datasets/homecoming/generated/powersets/defender/secondary/archery/ranged-shot';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/defender/secondary/archery/ranged-shot';

export const RangedShot: Power = withOverrides(base, overrides);
