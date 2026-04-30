/**
 * Ripper — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_melee spines
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Ripper as base } from '@/data/datasets/rebirth/generated/powersets/stalker/primary/spines/ripper';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/stalker/primary/spines/ripper';

export const Ripper: Power = withOverrides(base, overrides);
