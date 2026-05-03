/**
 * Stunning Shot — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_ranged archery
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { StunningShot as base } from '@/data/generated/powersets/corruptor/primary/archery/stunning-shot';
import { overrides } from '@/data/overrides/powersets/corruptor/primary/archery/stunning-shot';

export const StunningShot: Power = withOverrides(base, overrides);
