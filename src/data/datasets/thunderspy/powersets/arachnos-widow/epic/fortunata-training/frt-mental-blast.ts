/**
 * Mental Blast — COMPOSED EXPORT
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
import { FRTMentalBlast as base } from '@/data/datasets/thunderspy/generated/powersets/arachnos-widow/epic/fortunata-training/frt-mental-blast';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/arachnos-widow/epic/fortunata-training/frt-mental-blast';

export const FRTMentalBlast: Power = withOverrides(base, overrides);
