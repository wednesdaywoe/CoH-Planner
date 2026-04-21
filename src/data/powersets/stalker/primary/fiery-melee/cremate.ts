/**
 * Cremate — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee fiery_melee
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Cremate as base } from '@/data/generated/powersets/stalker/primary/fiery-melee/cremate';
import { overrides } from '@/data/overrides/powersets/stalker/primary/fiery-melee/cremate';

export const Cremate: Power = withOverrides(base, overrides);
