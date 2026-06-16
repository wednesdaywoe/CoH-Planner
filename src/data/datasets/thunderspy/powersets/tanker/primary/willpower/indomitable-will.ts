/**
 * Indomitable Will — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense willpower
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { IndomitableWill as base } from '@/data/datasets/thunderspy/generated/powersets/tanker/primary/willpower/indomitable-will';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/tanker/primary/willpower/indomitable-will';

export const IndomitableWill: Power = withOverrides(base, overrides);
