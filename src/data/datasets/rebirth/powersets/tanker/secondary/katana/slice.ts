/**
 * Flashing Steel — COMPOSED EXPORT
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
import { FlashingSteel as base } from '@/data/datasets/rebirth/generated/powersets/tanker/secondary/katana/slice';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/secondary/katana/slice';

export const FlashingSteel: Power = withOverrides(base, overrides);
