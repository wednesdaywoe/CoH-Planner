/**
 * Stone Skin — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_defense stone_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { StoneSkin as base } from '@/data/datasets/rebirth/generated/powersets/tanker/primary/stone-armor/stone-skin';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/primary/stone-armor/stone-skin';

export const StoneSkin: Power = withOverrides(base, overrides);
