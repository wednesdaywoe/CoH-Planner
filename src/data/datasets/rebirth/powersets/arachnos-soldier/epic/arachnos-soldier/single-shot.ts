/**
 * Single Shot — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs arachnos_soldiers arachnos_soldier
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SingleShot as base } from '@/data/datasets/rebirth/generated/powersets/arachnos-soldier/epic/arachnos-soldier/single-shot';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/arachnos-soldier/epic/arachnos-soldier/single-shot';

export const SingleShot: Power = withOverrides(base, overrides);
