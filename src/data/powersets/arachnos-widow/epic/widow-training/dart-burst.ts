/**
 * Dart Burst — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs widow_training widow_training
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DartBurst as base } from '@/data/generated/powersets/arachnos-widow/epic/widow-training/dart-burst';
import { overrides } from '@/data/overrides/powersets/arachnos-widow/epic/widow-training/dart-burst';

export const DartBurst: Power = withOverrides(base, overrides);
