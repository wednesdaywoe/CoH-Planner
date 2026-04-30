/**
 * Thunder Kick — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee martial_arts
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ThunderKick as base } from '@/data/datasets/rebirth/generated/powersets/tanker/secondary/martial-arts/thunder-kick';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/tanker/secondary/martial-arts/thunder-kick';

export const ThunderKick: Power = withOverrides(base, overrides);
