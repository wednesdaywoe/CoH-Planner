/**
 * Oppressive Gloom — COMPOSED EXPORT
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
import { OppressiveGloom as base } from '@/data/datasets/rebirth/generated/powersets/stalker/secondary/dark-armor/oppressive-gloom';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/secondary/dark-armor/oppressive-gloom';

export const OppressiveGloom: Power = withOverrides(base, overrides);
