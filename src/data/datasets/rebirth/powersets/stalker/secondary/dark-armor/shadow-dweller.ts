/**
 * Shadow Dweller — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense dark_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ShadowDweller as base } from '@/data/generated/powersets/stalker/secondary/dark-armor/shadow-dweller';
import { overrides } from '@/data/overrides/powersets/stalker/secondary/dark-armor/shadow-dweller';

export const ShadowDweller: Power = withOverrides(base, overrides);
