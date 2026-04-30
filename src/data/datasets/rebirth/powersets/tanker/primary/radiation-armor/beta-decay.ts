/**
 * Beta Decay — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense radiation_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { BetaDecay as base } from '@/data/generated/powersets/tanker/primary/radiation-armor/beta-decay';
import { overrides } from '@/data/overrides/powersets/tanker/primary/radiation-armor/beta-decay';

export const BetaDecay: Power = withOverrides(base, overrides);
