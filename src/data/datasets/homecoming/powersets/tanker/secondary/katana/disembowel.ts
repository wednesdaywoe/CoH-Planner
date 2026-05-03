/**
 * Soaring Dragon — COMPOSED EXPORT
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
import { SoaringDragon as base } from '@/data/generated/powersets/tanker/secondary/katana/disembowel';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/katana/disembowel';

export const SoaringDragon: Power = withOverrides(base, overrides);
