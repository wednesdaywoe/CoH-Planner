/**
 * Flay — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee pale_blade
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Flay as base } from '@/data/datasets/thunderspy/generated/powersets/tanker/secondary/pale-blade/flay';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/tanker/secondary/pale-blade/flay';

export const Flay: Power = withOverrides(base, overrides);
