/**
 * Freeze Ray — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged ice_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FreezeRay as base } from '@/data/generated/powersets/defender/secondary/ice-blast/freeze-ray';
import { overrides } from '@/data/overrides/powersets/defender/secondary/ice-blast/freeze-ray';

export const FreezeRay: Power = withOverrides(base, overrides);
