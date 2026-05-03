/**
 * Fate Sealed — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs teamwork fortunata_teamwork
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { FateSealed as base } from '@/data/datasets/homecoming/generated/powersets/arachnos-widow/epic/fortunata-teamwork/fate-sealed';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/arachnos-widow/epic/fortunata-teamwork/fate-sealed';

export const FateSealed: Power = withOverrides(base, overrides);
