/**
 * Thunder Kick — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee martial_arts
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ThunderKick as base } from '@/data/generated/powersets/stalker/primary/martial-arts/thunder-kick';
import { overrides } from '@/data/overrides/powersets/stalker/primary/martial-arts/thunder-kick';

export const ThunderKick: Power = withOverrides(base, overrides);
