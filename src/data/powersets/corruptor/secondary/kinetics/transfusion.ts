/**
 * Transfusion — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs corruptor_buff kinetics
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Transfusion as base } from '@/data/generated/powersets/corruptor/secondary/kinetics/transfusion';
import { overrides } from '@/data/overrides/powersets/corruptor/secondary/kinetics/transfusion';

export const Transfusion: Power = withOverrides(base, overrides);
