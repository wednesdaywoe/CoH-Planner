/**
 * Kuji-In Toh — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_support ninja_training
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { KujiInToh as base } from '@/data/datasets/homecoming/generated/powersets/blaster/secondary/ninja-training/kuji-in-toh';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/blaster/secondary/ninja-training/kuji-in-toh';

export const KujiInToh: Power = withOverrides(base, overrides);
