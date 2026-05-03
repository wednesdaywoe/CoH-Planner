/**
 * Atom Smasher — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee radiation_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AtomSmasher as base } from '@/data/datasets/homecoming/generated/powersets/tanker/secondary/radiation-melee/atom-smasher';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/secondary/radiation-melee/atom-smasher';

export const AtomSmasher: Power = withOverrides(base, overrides);
