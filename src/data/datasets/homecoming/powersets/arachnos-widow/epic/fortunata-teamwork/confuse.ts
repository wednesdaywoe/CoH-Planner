/**
 * Confuse — COMPOSED EXPORT
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
import { Confuse as base } from '@/data/datasets/homecoming/generated/powersets/arachnos-widow/epic/fortunata-teamwork/confuse';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/arachnos-widow/epic/fortunata-teamwork/confuse';

export const Confuse: Power = withOverrides(base, overrides);
