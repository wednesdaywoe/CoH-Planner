/**
 * Hurl Boulder — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee stone_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HurlBoulder as base } from '@/data/generated/powersets/tanker/secondary/stone-melee/hurl-boulder';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/stone-melee/hurl-boulder';

export const HurlBoulder: Power = withOverrides(base, overrides);
