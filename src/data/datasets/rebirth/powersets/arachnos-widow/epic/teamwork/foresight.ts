/**
 * Foresight — COMPOSED EXPORT
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
import { Foresight as base } from '@/data/datasets/rebirth/generated/powersets/arachnos-widow/epic/teamwork/foresight';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/arachnos-widow/epic/teamwork/foresight';

export const Foresight: Power = withOverrides(base, overrides);
