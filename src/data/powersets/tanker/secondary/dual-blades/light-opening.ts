/**
 * Nimble Slash — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs tanker_melee dual_blades
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { NimbleSlash as base } from '@/data/generated/powersets/tanker/secondary/dual-blades/light-opening';
import { overrides } from '@/data/overrides/powersets/tanker/secondary/dual-blades/light-opening';

export const NimbleSlash: Power = withOverrides(base, overrides);
