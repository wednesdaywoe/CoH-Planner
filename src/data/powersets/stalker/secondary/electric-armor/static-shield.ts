/**
 * Static Shield — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense electric_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { StaticShield as base } from '@/data/generated/powersets/stalker/secondary/electric-armor/static-shield';
import { overrides } from '@/data/overrides/powersets/stalker/secondary/electric-armor/static-shield';

export const StaticShield: Power = withOverrides(base, overrides);
