/**
 * Elude — COMPOSED EXPORT
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
import { Elude as base } from '@/data/generated/powersets/arachnos-widow/epic/widow-teamwork/elude';
import { overrides } from '@/data/overrides/powersets/arachnos-widow/epic/widow-teamwork/elude';

export const Elude: Power = withOverrides(base, overrides);
