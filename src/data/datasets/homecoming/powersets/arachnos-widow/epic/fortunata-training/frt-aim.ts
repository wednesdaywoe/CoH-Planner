/**
 * Aim — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs widow_training fortunata_training
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Aim as base } from '@/data/datasets/homecoming/generated/powersets/arachnos-widow/epic/fortunata-training/frt-aim';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/arachnos-widow/epic/fortunata-training/frt-aim';

export const Aim: Power = withOverrides(base, overrides);
