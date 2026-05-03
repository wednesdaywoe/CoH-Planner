/**
 * Envenom — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff poison
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Envenom as base } from '@/data/generated/powersets/defender/primary/poison/envenom';
import { overrides } from '@/data/overrides/powersets/defender/primary/poison/envenom';

export const Envenom: Power = withOverrides(base, overrides);
