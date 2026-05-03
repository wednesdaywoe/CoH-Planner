/**
 * Sting of the Wasp — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee katana
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { StingoftheWasp as base } from '@/data/datasets/homecoming/generated/powersets/tanker/secondary/katana/hack';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/tanker/secondary/katana/hack';

export const StingoftheWasp: Power = withOverrides(base, overrides);
