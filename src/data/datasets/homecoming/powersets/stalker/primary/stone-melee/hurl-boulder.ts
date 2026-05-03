/**
 * Hurl Boulder — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee stone_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { HurlBoulder as base } from '@/data/datasets/homecoming/generated/powersets/stalker/primary/stone-melee/hurl-boulder';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/stalker/primary/stone-melee/hurl-boulder';

export const HurlBoulder: Power = withOverrides(base, overrides);
