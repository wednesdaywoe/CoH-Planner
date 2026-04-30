/**
 * Slice — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee broad_sword
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Slice as base } from '@/data/datasets/rebirth/generated/powersets/stalker/primary/broad-sword/slice';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/primary/broad-sword/slice';

export const Slice: Power = withOverrides(base, overrides);
