/**
 * Placate — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs teamwork widow_teamwork
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Placate as base } from '@/data/generated/powersets/arachnos-widow/epic/widow-teamwork/placate';
import { overrides } from '@/data/overrides/powersets/arachnos-widow/epic/widow-teamwork/placate';

export const Placate: Power = withOverrides(base, overrides);
