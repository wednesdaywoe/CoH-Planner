/**
 * Indomitable Will — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs teamwork teamwork
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { IndomitableWill as base } from '@/data/generated/powersets/arachnos-widow/epic/teamwork/indomitable-will';
import { overrides } from '@/data/overrides/powersets/arachnos-widow/epic/teamwork/indomitable-will';

export const IndomitableWill: Power = withOverrides(base, overrides);
